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
    /// İnsan okunabilir önizleme metni oluştur (Türkçe)
    /// </summary>
    public static string GetHumanReadable(RRuleOptions options)
    {
        var sb = new StringBuilder();

        // Interval ve Frequency
        var intervalText = options.Interval > 1 ? $"{options.Interval} " : "";

        switch (options.Frequency)
        {
            case RRuleFrequency.Daily:
                sb.Append(options.Interval == 1 ? "Her gün" : $"Her {options.Interval} günde bir");
                break;

            case RRuleFrequency.Weekly:
                if (options.Interval == 1)
                    sb.Append("Her hafta");
                else
                    sb.Append($"Her {options.Interval} haftada bir");

                if (options.ByDays.Count > 0)
                {
                    var dayNames = options.ByDays
                        .OrderBy(d => ((int)d + 6) % 7)
                        .Select(GetTurkishDayName);
                    sb.Append($" {string.Join(", ", dayNames)}");
                }

                break;

            case RRuleFrequency.Monthly:
                if (options.Interval == 1)
                    sb.Append("Her ay");
                else
                    sb.Append($"Her {options.Interval} ayda bir");

                if (options.MonthlyType == RRuleMonthlyType.DayOfMonth)
                {
                    sb.Append($" {options.ByMonthDay}. gün");
                }
                else
                {
                    var posText = options.BySetPos switch
                    {
                        1 => "ilk",
                        2 => "ikinci",
                        3 => "üçüncü",
                        4 => "dördüncü",
                        -1 => "son",
                        _ => $"{options.BySetPos}."
                    };
                    sb.Append($" {posText} {GetTurkishDayName(options.ByWeekDay)}");
                }

                break;

            case RRuleFrequency.Yearly:
                if (options.Interval == 1)
                    sb.Append("Her yıl");
                else
                    sb.Append($"Her {options.Interval} yılda bir");

                var monthName = GetTurkishMonthName(options.ByMonth);
                sb.Append($" {options.ByMonthDay} {monthName}");
                break;
        }

        // Bitiş
        switch (options.EndType)
        {
            case RRuleEndType.AfterCount:
                sb.Append($", {options.Count} kez");
                break;
            case RRuleEndType.UntilDate when options.Until.HasValue:
                sb.Append($", {options.Until.Value:dd MMMM yyyy} tarihine kadar");
                break;
        }

        return sb.ToString();
    }

    private static string GetTurkishDayName(DayOfWeek day) => day switch
    {
        DayOfWeek.Monday => "Pazartesi",
        DayOfWeek.Tuesday => "Salı",
        DayOfWeek.Wednesday => "Çarşamba",
        DayOfWeek.Thursday => "Perşembe",
        DayOfWeek.Friday => "Cuma",
        DayOfWeek.Saturday => "Cumartesi",
        DayOfWeek.Sunday => "Pazar",
        _ => day.ToString()
    };

    private static string GetTurkishMonthName(int month) => month switch
    {
        1 => "Ocak",
        2 => "Şubat",
        3 => "Mart",
        4 => "Nisan",
        5 => "Mayıs",
        6 => "Haziran",
        7 => "Temmuz",
        8 => "Ağustos",
        9 => "Eylül",
        10 => "Ekim",
        11 => "Kasım",
        12 => "Aralık",
        _ => month.ToString()
    };
}