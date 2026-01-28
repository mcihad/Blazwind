using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Blazwind.Components.RRule;

/// <summary>
/// RRULE string builder ve parser (RFC 5545)
/// Bidirectional: Options ↔ RRULE string
/// </summary>
public static class RRuleBuilder
{
    private static readonly Dictionary<DayOfWeek, string> DayToRRule = new()
    {
        { DayOfWeek.Sunday, "SU" },
        { DayOfWeek.Monday, "MO" },
        { DayOfWeek.Tuesday, "TU" },
        { DayOfWeek.Wednesday, "WE" },
        { DayOfWeek.Thursday, "TH" },
        { DayOfWeek.Friday, "FR" },
        { DayOfWeek.Saturday, "SA" }
    };

    private static readonly Dictionary<string, DayOfWeek> RRuleToDay =
        DayToRRule.ToDictionary(x => x.Value, x => x.Key);

    /// <summary>
    /// RRuleOptions'ı RRULE string'e çevir
    /// </summary>
    public static string Build(RRuleOptions options)
    {
        var parts = new List<string>();

        // FREQ
        parts.Add($"FREQ={options.Frequency.ToString().ToUpper()}");

        // INTERVAL (1 ise genellikle yazılmaz ama biz yazalım netlik için)
        if (options.Interval > 1)
        {
            parts.Add($"INTERVAL={options.Interval}");
        }

        // BYDAY (Haftalık veya Aylık WeekdayOfMonth için)
        if (options.Frequency == RRuleFrequency.Weekly && options.ByDays.Count > 0)
        {
            var days = options.ByDays
                .OrderBy(d => ((int)d + 6) % 7) // Pazartesi'den başlat
                .Select(d => DayToRRule[d]);
            parts.Add($"BYDAY={string.Join(",", days)}");
        }
        else if (options.Frequency == RRuleFrequency.Monthly && options.MonthlyType == RRuleMonthlyType.WeekdayOfMonth)
        {
            // BYDAY=2MO (ikinci Pazartesi)
            var pos = options.BySetPos;
            var day = DayToRRule[options.ByWeekDay];
            parts.Add($"BYDAY={pos}{day}");
        }

        // BYMONTHDAY (Aylık DayOfMonth için)
        if (options.Frequency == RRuleFrequency.Monthly && options.MonthlyType == RRuleMonthlyType.DayOfMonth)
        {
            parts.Add($"BYMONTHDAY={options.ByMonthDay}");
        }

        // BYMONTH (Yıllık için)
        if (options.Frequency == RRuleFrequency.Yearly)
        {
            parts.Add($"BYMONTH={options.ByMonth}");
            parts.Add($"BYMONTHDAY={options.ByMonthDay}");
        }

        // Bitiş
        switch (options.EndType)
        {
            case RRuleEndType.AfterCount:
                parts.Add($"COUNT={options.Count}");
                break;
            case RRuleEndType.UntilDate when options.Until.HasValue:
                parts.Add($"UNTIL={options.Until.Value:yyyyMMdd}T235959Z");
                break;
        }

        return string.Join(";", parts);
    }

    /// <summary>
    /// RRULE string'i RRuleOptions'a çevir (parse)
    /// </summary>
    public static RRuleOptions Parse(string rrule)
    {
        var options = new RRuleOptions();

        if (string.IsNullOrWhiteSpace(rrule))
            return options;

        // RRULE: prefix'i varsa kaldır
        rrule = rrule.TrimStart();
        if (rrule.StartsWith("RRULE:", StringComparison.OrdinalIgnoreCase))
            rrule = rrule[6..];

        var parts = rrule.Split(';', StringSplitOptions.RemoveEmptyEntries);

        foreach (var part in parts)
        {
            var kv = part.Split('=', 2);
            if (kv.Length != 2) continue;

            var key = kv[0].ToUpperInvariant();
            var value = kv[1];

            switch (key)
            {
                case "FREQ":
                    options.Frequency = value.ToUpperInvariant() switch
                    {
                        "DAILY" => RRuleFrequency.Daily,
                        "WEEKLY" => RRuleFrequency.Weekly,
                        "MONTHLY" => RRuleFrequency.Monthly,
                        "YEARLY" => RRuleFrequency.Yearly,
                        _ => RRuleFrequency.Weekly
                    };
                    break;

                case "INTERVAL":
                    if (int.TryParse(value, out var interval))
                        options.Interval = interval;
                    break;

                case "BYDAY":
                    ParseByDay(value, options);
                    break;

                case "BYMONTHDAY":
                    if (int.TryParse(value, out var monthDay))
                        options.ByMonthDay = monthDay;
                    break;

                case "BYMONTH":
                    if (int.TryParse(value, out var month))
                        options.ByMonth = month;
                    break;

                case "COUNT":
                    if (int.TryParse(value, out var count))
                    {
                        options.EndType = RRuleEndType.AfterCount;
                        options.Count = count;
                    }

                    break;

                case "UNTIL":
                    if (TryParseUntil(value, out var until))
                    {
                        options.EndType = RRuleEndType.UntilDate;
                        options.Until = until;
                    }

                    break;
            }
        }

        return options;
    }

    private static void ParseByDay(string value, RRuleOptions options)
    {
        // BYDAY=MO,WE,FR veya BYDAY=2MO (aylık için)
        var days = value.Split(',', StringSplitOptions.RemoveEmptyEntries);

        foreach (var day in days)
        {
            // Pozisyon varsa parse et (örn: 2MO, -1FR)
            var match = Regex.Match(day, @"^(-?\d)?([A-Z]{2})$");
            if (match.Success)
            {
                var posStr = match.Groups[1].Value;
                var dayStr = match.Groups[2].Value;

                if (RRuleToDay.TryGetValue(dayStr, out var dayOfWeek))
                {
                    if (!string.IsNullOrEmpty(posStr) && int.TryParse(posStr, out var pos))
                    {
                        // Aylık tip (örn: 2MO = ikinci Pazartesi)
                        options.MonthlyType = RRuleMonthlyType.WeekdayOfMonth;
                        options.BySetPos = pos;
                        options.ByWeekDay = dayOfWeek;
                    }
                    else
                    {
                        // Haftalık tip
                        options.ByDays.Add(dayOfWeek);
                    }
                }
            }
        }
    }

    private static bool TryParseUntil(string value, out DateTime result)
    {
        // Format: YYYYMMDD veya YYYYMMDDTHHmmssZ
        result = default;

        if (value.Length >= 8)
        {
            var dateStr = value[..8];
            if (DateTime.TryParseExact(dateStr, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None,
                    out result))
            {
                return true;
            }
        }

        return false;
    }

    /// <summary>
    /// İnsan okunabilir önizleme metni oluştur (English)
    /// </summary>
    public static string GetHumanReadable(RRuleOptions options)
    {
        var sb = new StringBuilder();

        // Interval ve Frequency
        var intervalText = options.Interval > 1 ? $"{options.Interval} " : "";

        switch (options.Frequency)
        {
            case RRuleFrequency.Daily:
                sb.Append(options.Interval == 1 ? "Every day" : $"Every {options.Interval} days");
                break;

            case RRuleFrequency.Weekly:
                if (options.Interval == 1)
                    sb.Append("Every week");
                else
                    sb.Append($"Every {options.Interval} weeks");

                if (options.ByDays.Count > 0)
                {
                    var dayNames = options.ByDays
                        .OrderBy(d => ((int)d + 6) % 7)
                        .Select(GetEnglishDayName);
                    sb.Append($" on {string.Join(", ", dayNames)}");
                }

                break;

            case RRuleFrequency.Monthly:
                if (options.Interval == 1)
                    sb.Append("Every month");
                else
                    sb.Append($"Every {options.Interval} months");

                if (options.MonthlyType == RRuleMonthlyType.DayOfMonth)
                {
                    sb.Append($" on the {options.ByMonthDay}{GetOrdinalSuffix(options.ByMonthDay)}");
                }
                else
                {
                    var posText = options.BySetPos switch
                    {
                        1 => "first",
                        2 => "second",
                        3 => "third",
                        4 => "fourth",
                        -1 => "last",
                        _ => $"{options.BySetPos}th"
                    };
                    sb.Append($" on the {posText} {GetEnglishDayName(options.ByWeekDay)}");
                }

                break;

            case RRuleFrequency.Yearly:
                if (options.Interval == 1)
                    sb.Append("Every year");
                else
                    sb.Append($"Every {options.Interval} years");

                var monthName = GetEnglishMonthName(options.ByMonth);
                sb.Append($" on {monthName} {options.ByMonthDay}{GetOrdinalSuffix(options.ByMonthDay)}");
                break;
        }

        // Bitiş
        switch (options.EndType)
        {
            case RRuleEndType.AfterCount:
                sb.Append($", {options.Count} times");
                break;
            case RRuleEndType.UntilDate when options.Until.HasValue:
                sb.Append($", until {options.Until.Value:MMMM dd, yyyy}");
                break;
        }

        return sb.ToString();
    }

    private static string GetOrdinalSuffix(int number)
    {
        if (number <= 0) return number.ToString();

        return (number % 100) switch
        {
            11 or 12 or 13 => "th",
            _ => (number % 10) switch
            {
                1 => "st",
                2 => "nd",
                3 => "rd",
                _ => "th"
            }
        };
    }

    private static string GetEnglishDayName(DayOfWeek day) => day switch
    {
        DayOfWeek.Monday => "Monday",
        DayOfWeek.Tuesday => "Tuesday",
        DayOfWeek.Wednesday => "Wednesday",
        DayOfWeek.Thursday => "Thursday",
        DayOfWeek.Friday => "Friday",
        DayOfWeek.Saturday => "Saturday",
        DayOfWeek.Sunday => "Sunday",
        _ => day.ToString()
    };

    private static string GetEnglishMonthName(int month) => month switch
    {
        1 => "January",
        2 => "February",
        3 => "March",
        4 => "April",
        5 => "May",
        6 => "June",
        7 => "July",
        8 => "August",
        9 => "September",
        10 => "October",
        11 => "November",
        12 => "December",
        _ => month.ToString()
    };
}