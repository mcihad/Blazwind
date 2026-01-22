namespace Blazwind.Components.RRule;

using Blazwind.Components.Shared;

/// <summary>
/// RRule occurrence expander - generates event instances within a date range
/// </summary>
public static class RRuleExpander
{
    /// <summary>
    /// Expand a recurring event into individual occurrences within the given date range
    /// </summary>
    /// <param name="masterEvent">The master recurring event</param>
    /// <param name="rangeStart">Start of the visible date range</param>
    /// <param name="rangeEnd">End of the visible date range</param>
    /// <param name="maxOccurrences">Maximum number of occurrences to generate (safety limit)</param>
    /// <returns>Enumerable of CalendarEvent instances for each occurrence</returns>
    public static IEnumerable<CalendarEvent> ExpandRecurrence(
        CalendarEvent masterEvent,
        DateTime rangeStart,
        DateTime rangeEnd,
        int maxOccurrences = 100)
    {
        if (!masterEvent.IsRecurring || string.IsNullOrEmpty(masterEvent.RecurrenceRule))
        {
            yield return masterEvent;
            yield break;
        }

        var options = RRuleBuilder.Parse(masterEvent.RecurrenceRule);
        var duration = masterEvent.EndTime - masterEvent.StartTime;
        var occurrenceCount = 0;
        var currentDate = masterEvent.StartTime.Date;

        // Determine end date based on RRULE end type
        var absoluteEnd = options.EndType switch
        {
            RRuleEndType.UntilDate when options.Until.HasValue => options.Until.Value,
            _ => rangeEnd.AddYears(1) // Safety limit
        };

        while (currentDate <= rangeEnd && currentDate <= absoluteEnd && occurrenceCount < maxOccurrences)
        {
            if (options.EndType == RRuleEndType.AfterCount && occurrenceCount >= options.Count)
                break;

            if (ShouldOccurOnDate(currentDate, masterEvent.StartTime, options))
            {
                var occurrenceStart = currentDate.Add(masterEvent.StartTime.TimeOfDay);
                var occurrenceEnd = occurrenceStart.Add(duration);

                // Only yield if occurrence is within visible range
                if (occurrenceEnd >= rangeStart && occurrenceStart <= rangeEnd)
                {
                    yield return new CalendarEvent
                    {
                        Id = $"{masterEvent.Id}_{occurrenceStart:yyyyMMdd}",
                        Title = masterEvent.Title,
                        Description = masterEvent.Description,
                        StartTime = occurrenceStart,
                        EndTime = occurrenceEnd,
                        CalendarId = masterEvent.CalendarId,
                        Color = masterEvent.Color,
                        IsAllDay = masterEvent.IsAllDay,
                        Location = masterEvent.Location,
                        ExtraData = masterEvent.ExtraData,
                        IsRecurring = true,
                        RecurrenceRule = masterEvent.RecurrenceRule,
                        RecurrenceMasterId = masterEvent.Id
                    };
                }

                occurrenceCount++;
            }

            currentDate = GetNextDate(currentDate, options);
        }
    }

    /// <summary>
    /// Expand all recurring events in a collection
    /// </summary>
    public static IEnumerable<CalendarEvent> ExpandAll(
        IEnumerable<CalendarEvent> events,
        DateTime rangeStart,
        DateTime rangeEnd)
    {
        foreach (var evt in events)
        {
            if (evt.IsRecurring && !string.IsNullOrEmpty(evt.RecurrenceRule) &&
                string.IsNullOrEmpty(evt.RecurrenceMasterId))
            {
                // Master event: expand it
                foreach (var occurrence in ExpandRecurrence(evt, rangeStart, rangeEnd))
                {
                    yield return occurrence;
                }
            }
            else if (string.IsNullOrEmpty(evt.RecurrenceMasterId))
            {
                // Non-recurring event: return as-is
                yield return evt;
            }
            // Skip already-expanded instances (have RecurrenceMasterId)
        }
    }

    private static bool ShouldOccurOnDate(DateTime date, DateTime originalStart, RRuleOptions options)
    {
        return options.Frequency switch
        {
            RRuleFrequency.Daily => CheckDailyOccurrence(date, originalStart, options),
            RRuleFrequency.Weekly => CheckWeeklyOccurrence(date, originalStart, options),
            RRuleFrequency.Monthly => CheckMonthlyOccurrence(date, originalStart, options),
            RRuleFrequency.Yearly => CheckYearlyOccurrence(date, originalStart, options),
            _ => false
        };
    }

    private static bool CheckDailyOccurrence(DateTime date, DateTime originalStart, RRuleOptions options)
    {
        if (date < originalStart.Date) return false;
        var daysDiff = (date - originalStart.Date).Days;
        return daysDiff % options.Interval == 0;
    }

    private static bool CheckWeeklyOccurrence(DateTime date, DateTime originalStart, RRuleOptions options)
    {
        if (date < originalStart.Date) return false;

        // Check if the day of week is in the selected days
        if (options.ByDays.Count > 0 && !options.ByDays.Contains(date.DayOfWeek))
            return false;

        // Check interval (every N weeks)
        var weeksDiff = (int)((date - originalStart.Date).Days / 7);
        return weeksDiff % options.Interval == 0 ||
               (options.ByDays.Count > 0 && IsInSameIntervalWeek(date, originalStart, options.Interval));
    }

    private static bool IsInSameIntervalWeek(DateTime date, DateTime originalStart, int interval)
    {
        // Calculate week number from original start
        var startOfWeek = originalStart.AddDays(-(int)originalStart.DayOfWeek);
        var dateStartOfWeek = date.AddDays(-(int)date.DayOfWeek);
        var weeksDiff = (int)((dateStartOfWeek - startOfWeek).Days / 7);
        return weeksDiff >= 0 && weeksDiff % interval == 0;
    }

    private static bool CheckMonthlyOccurrence(DateTime date, DateTime originalStart, RRuleOptions options)
    {
        if (date < originalStart.Date) return false;

        var monthsDiff = (date.Year - originalStart.Year) * 12 + (date.Month - originalStart.Month);
        if (monthsDiff % options.Interval != 0) return false;

        if (options.MonthlyType == RRuleMonthlyType.DayOfMonth)
        {
            return date.Day == options.ByMonthDay;
        }
        else // WeekdayOfMonth
        {
            return date.DayOfWeek == options.ByWeekDay && GetWeekOfMonth(date) == options.BySetPos;
        }
    }

    private static bool CheckYearlyOccurrence(DateTime date, DateTime originalStart, RRuleOptions options)
    {
        if (date < originalStart.Date) return false;

        var yearsDiff = date.Year - originalStart.Year;
        if (yearsDiff % options.Interval != 0) return false;

        return date.Month == options.ByMonth && date.Day == options.ByMonthDay;
    }

    private static int GetWeekOfMonth(DateTime date)
    {
        var firstOfMonth = new DateTime(date.Year, date.Month, 1);
        var firstDayOfWeek = (int)firstOfMonth.DayOfWeek;
        return (date.Day + firstDayOfWeek - 1) / 7 + 1;
    }

    private static DateTime GetNextDate(DateTime current, RRuleOptions options)
    {
        return options.Frequency switch
        {
            RRuleFrequency.Daily => current.AddDays(1),
            RRuleFrequency.Weekly => current.AddDays(1), // Check each day for BYDAY support
            RRuleFrequency.Monthly => current.AddDays(1), // Check each day for complex monthly rules
            RRuleFrequency.Yearly => current.AddDays(1), // Check each day
            _ => current.AddDays(1)
        };
    }
}