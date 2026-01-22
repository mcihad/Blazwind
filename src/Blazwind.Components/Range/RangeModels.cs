namespace Blazwind.Components.Range;

/// <summary>
/// Step unit for date range components
/// </summary>
public enum DateStepUnit
{
    Hour,
    Day,
    Week,
    Month,
    Year
}

/// <summary>
/// Date range preset for quick selection
/// </summary>
public class DateRangePreset
{
    public string Label { get; set; } = "";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

/// <summary>
/// Range value changed event arguments
/// </summary>
public class RangeChangedEventArgs<T>
{
    public T Start { get; set; } = default!;
    public T End { get; set; } = default!;
    public T? Min { get; set; }
    public T? Max { get; set; }
}

/// <summary>
/// Brush selection changed event arguments
/// </summary>
public class BrushChangedEventArgs<T>
{
    public T Start { get; set; } = default!;
    public T End { get; set; } = default!;
    public T Min { get; set; } = default!;
    public T Max { get; set; } = default!;
    public double StartPercent { get; set; }
    public double EndPercent { get; set; }
}