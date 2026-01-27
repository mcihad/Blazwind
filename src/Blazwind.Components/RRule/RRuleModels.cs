namespace Blazwind.Components.RRule;

/// <summary>
/// Recurrence frequency
/// </summary>
public enum RRuleFrequency
{
    Daily,
    Weekly,
    Monthly,
    Yearly
}

/// <summary>
/// End type
/// </summary>
public enum RRuleEndType
{
    Never,
    AfterCount,
    UntilDate
}

/// <summary>
/// Monthly recurrence type
/// </summary>
public enum RRuleMonthlyType
{
    /// <summary>Specific day of the month (e.g. the 15th of every month)</summary>
    DayOfMonth,

    /// <summary>Specific weekday of a specific week in the month (e.g. the 2nd Monday of every month)</summary>
    WeekdayOfMonth
}

/// <summary>
/// RRULE options – bridge between UI state and RRULE
/// </summary>
public class RRuleOptions
{
    /// <summary>Recurrence frequency (daily, weekly, monthly, yearly)</summary>
    public RRuleFrequency Frequency { get; set; } = RRuleFrequency.Weekly;

    /// <summary>Interval (every X days/weeks/months/years)</summary>
    public int Interval { get; set; } = 1;

    /// <summary>Weekly: selected days</summary>
    public HashSet<DayOfWeek> ByDays { get; set; } = new();

    /// <summary>Monthly type: day of month or weekday?</summary>
    public RRuleMonthlyType MonthlyType { get; set; } = RRuleMonthlyType.DayOfMonth;

    /// <summary>Monthly (DayOfMonth): which day of the month (1–31)</summary>
    public int ByMonthDay { get; set; } = 1;

    /// <summary>Monthly (WeekdayOfMonth): which week (1 = first, 2 = second, -1 = last)</summary>
    public int BySetPos { get; set; } = 1;

    /// <summary>Monthly (WeekdayOfMonth): which weekday</summary>
    public DayOfWeek ByWeekDay { get; set; } = DayOfWeek.Monday;

    /// <summary>Yearly: which month (1–12)</summary>
    public int ByMonth { get; set; } = 1;

    /// <summary>End type</summary>
    public RRuleEndType EndType { get; set; } = RRuleEndType.Never;

    /// <summary>End (AfterCount): after how many occurrences</summary>
    public int Count { get; set; } = 10;

    /// <summary>End (UntilDate): until which date</summary>
    public DateTime? Until { get; set; }

    /// <summary>Create a new instance with default settings</summary>
    public static RRuleOptions CreateDefault(DateTime? startDate = null)
    {
        var date = startDate ?? DateTime.Today;
        return new RRuleOptions
        {
            Frequency = RRuleFrequency.Weekly,
            Interval = 1,
            ByDays = new HashSet<DayOfWeek> { date.DayOfWeek },
            ByMonthDay = date.Day,
            ByMonth = date.Month,
            ByWeekDay = date.DayOfWeek
        };
    }
}

/// <summary>
/// Helper model for weekdays
/// </summary>
public class WeekDayInfo
{
    public DayOfWeek Day { get; set; }
    public string ShortName { get; set; } = "";
    public string LongName { get; set; } = "";
    public bool IsSelected { get; set; }
}