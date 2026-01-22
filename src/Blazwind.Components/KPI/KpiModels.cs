namespace Blazwind.Components.KPI;

/// <summary>
/// KPI value format type
/// </summary>
public enum KpiFormat
{
    /// <summary>
    /// Regular number format (N0)
    /// </summary>
    Number,

    /// <summary>
    /// Currency format with prefix
    /// </summary>
    Currency,

    /// <summary>
    /// Percentage format with suffix
    /// </summary>
    Percent,

    /// <summary>
    /// Decimal format (N2)
    /// </summary>
    Decimal
}