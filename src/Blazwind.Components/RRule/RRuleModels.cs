namespace Blazwind.Components.RRule;

/// <summary>
/// Tekrarlama sıklığı
/// </summary>
public enum RRuleFrequency
{
    Daily,
    Weekly,
    Monthly,
    Yearly
}

/// <summary>
/// Bitiş tipi
/// </summary>
public enum RRuleEndType
{
    Never,
    AfterCount,
    UntilDate
}

/// <summary>
/// Aylık tekrar tipi
/// </summary>
public enum RRuleMonthlyType
{
    /// <summary>Ayın belirli günü (örn: her ayın 15'i)</summary>
    DayOfMonth,

    /// <summary>Ayın belirli haftasının belirli günü (örn: her ayın 2. Pazartesi)</summary>
    WeekdayOfMonth
}

/// <summary>
/// RRULE seçenekleri - UI state ve RRULE arasında köprü
/// </summary>
public class RRuleOptions
{
    /// <summary>Tekrarlama sıklığı (günlük, haftalık, aylık, yıllık)</summary>
    public RRuleFrequency Frequency { get; set; } = RRuleFrequency.Weekly;

    /// <summary>Aralık (her X gün/hafta/ay/yıl)</summary>
    public int Interval { get; set; } = 1;

    /// <summary>Haftalık: Seçili günler</summary>
    public HashSet<DayOfWeek> ByDays { get; set; } = new();

    /// <summary>Aylık tip: Ayın günü mü, Hafta günü mü?</summary>
    public RRuleMonthlyType MonthlyType { get; set; } = RRuleMonthlyType.DayOfMonth;

    /// <summary>Aylık (DayOfMonth): Ayın hangi günü (1-31)</summary>
    public int ByMonthDay { get; set; } = 1;

    /// <summary>Aylık (WeekdayOfMonth): Kaçıncı hafta (1=ilk, 2=ikinci, -1=son)</summary>
    public int BySetPos { get; set; } = 1;

    /// <summary>Aylık (WeekdayOfMonth): Hangi gün</summary>
    public DayOfWeek ByWeekDay { get; set; } = DayOfWeek.Monday;

    /// <summary>Yıllık: Hangi ay (1-12)</summary>
    public int ByMonth { get; set; } = 1;

    /// <summary>Bitiş tipi</summary>
    public RRuleEndType EndType { get; set; } = RRuleEndType.Never;

    /// <summary>Bitiş (AfterCount): Kaç tekrar sonra</summary>
    public int Count { get; set; } = 10;

    /// <summary>Bitiş (UntilDate): Hangi tarihe kadar</summary>
    public DateTime? Until { get; set; }

    /// <summary>Varsayılan ayarlarla yeni bir instance oluştur</summary>
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
/// Hafta günleri için yardımcı model
/// </summary>
public class WeekDayInfo
{
    public DayOfWeek Day { get; set; }
    public string ShortName { get; set; } = "";
    public string LongName { get; set; } = "";
    public bool IsSelected { get; set; }
}