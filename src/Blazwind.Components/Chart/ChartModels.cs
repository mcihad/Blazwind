using System.Text.Json.Serialization;

namespace Blazwind.Components.Chart;

/// <summary>
///     Base chart options
/// </summary>
public class ChartOptions
{
    [JsonPropertyName("title")]
    public ChartTitle? Title { get; set; }

    [JsonPropertyName("tooltip")]
    public ChartTooltip? Tooltip { get; set; }

    [JsonPropertyName("legend")]
    public ChartLegend? Legend { get; set; }

    [JsonPropertyName("grid")]
    public ChartGrid? Grid { get; set; }

    [JsonPropertyName("xAxis")]
    public object? XAxis { get; set; }

    [JsonPropertyName("yAxis")]
    public object? YAxis { get; set; }

    [JsonPropertyName("series")]
    public List<ChartSeries>? Series { get; set; }

    [JsonPropertyName("color")]
    public List<string>? Color { get; set; }

    [JsonPropertyName("backgroundColor")]
    public string? BackgroundColor { get; set; }

    [JsonPropertyName("animation")]
    public bool Animation { get; set; } = true;

    [JsonPropertyName("animationDuration")]
    public int AnimationDuration { get; set; } = 1000;

    [JsonPropertyName("animationDurationUpdate")]
    public int? AnimationDurationUpdate { get; set; }

    [JsonPropertyName("animationEasing")]
    public string? AnimationEasing { get; set; }

    [JsonPropertyName("animationEasingUpdate")]
    public string? AnimationEasingUpdate { get; set; }

    [JsonPropertyName("dataset")]
    public object? Dataset { get; set; }

    [JsonPropertyName("visualMap")]
    public object? VisualMap { get; set; }

    [JsonPropertyName("dataZoom")]
    public object? DataZoom { get; set; }
}

/// <summary>
///     Chart title
/// </summary>
public class ChartTitle
{
    [JsonPropertyName("show")]
    public bool Show { get; set; } = true;

    [JsonPropertyName("text")]
    public string? Text { get; set; }

    [JsonPropertyName("subtext")]
    public string? Subtext { get; set; }

    [JsonPropertyName("left")]
    public string Left { get; set; } = ChartPosition.Center;

    [JsonPropertyName("top")]
    public string Top { get; set; } = ChartPosition.Top;

    [JsonPropertyName("bottom")]
    public string? Bottom { get; set; }

    [JsonPropertyName("textStyle")]
    public ChartTextStyle? TextStyle { get; set; }
}

/// <summary>
///     Chart tooltip
/// </summary>
public class ChartTooltip
{
    [JsonPropertyName("show")]
    public bool Show { get; set; } = true;

    [JsonPropertyName("trigger")]
    public string Trigger { get; set; } = ChartTooltipTrigger.Item; // item, axis, none

    [JsonPropertyName("triggerOn")]
    public string? TriggerOn { get; set; }

    [JsonPropertyName("formatter")]
    public string? Formatter { get; set; }

    [JsonPropertyName("position")]
    public object? Position { get; set; }

    [JsonPropertyName("axisPointer")]
    public object? AxisPointer { get; set; }
}

/// <summary>
///     Chart legend
/// </summary>
public class ChartLegend
{
    [JsonPropertyName("show")]
    public bool Show { get; set; } = true;

    [JsonPropertyName("type")]
    public string Type { get; set; } = ChartLegendType.Plain; // plain, scroll

    [JsonPropertyName("orient")]
    public string Orient { get; set; } = ChartLegendOrient.Horizontal; // horizontal, vertical

    [JsonPropertyName("left")]
    public string Left { get; set; } = ChartPosition.Center;

    [JsonPropertyName("top")]
    public string Top { get; set; } = ChartPosition.Bottom;

    [JsonPropertyName("data")]
    public List<string>? Data { get; set; }
}

/// <summary>
///     Chart grid
/// </summary>
public class ChartGrid
{
    [JsonPropertyName("left")]
    public object Left { get; set; } = "10%";

    [JsonPropertyName("right")]
    public object Right { get; set; } = "10%";

    [JsonPropertyName("bottom")]
    public object Bottom { get; set; } = "15%";

    [JsonPropertyName("top")]
    public object Top { get; set; } = "15%";

    [JsonPropertyName("width")]
    public object? Width { get; set; }

    [JsonPropertyName("height")]
    public object? Height { get; set; }

    [JsonPropertyName("containLabel")]
    public bool ContainLabel { get; set; } = true;
}

/// <summary>
///     Chart axis
/// </summary>
public class ChartAxis
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = ChartAxisType.Category; // category, value, time, log

    [JsonPropertyName("data")]
    public List<string>? Data { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("nameLocation")]
    public string NameLocation { get; set; } = ChartPosition.End; // start, middle, end

    [JsonPropertyName("nameGap")]
    public int? NameGap { get; set; }

    [JsonPropertyName("boundaryGap")]
    public object? BoundaryGap { get; set; }

    [JsonPropertyName("axisLabel")]
    public ChartAxisLabel? AxisLabel { get; set; }

    [JsonPropertyName("min")]
    public object? Min { get; set; }

    [JsonPropertyName("max")]
    public object? Max { get; set; }

    [JsonPropertyName("scale")]
    public bool Scale { get; set; }

    [JsonPropertyName("splitArea")]
    public object? SplitArea { get; set; }

    [JsonPropertyName("splitLine")]
    public object? SplitLine { get; set; }

    [JsonPropertyName("axisLine")]
    public object? AxisLine { get; set; }

    [JsonPropertyName("axisTick")]
    public object? AxisTick { get; set; }

    [JsonPropertyName("animationDuration")]
    public int? AnimationDuration { get; set; }

    [JsonPropertyName("animationDurationUpdate")]
    public int? AnimationDurationUpdate { get; set; }
}

/// <summary>
///     Axis label
/// </summary>
public class ChartAxisLabel
{
    [JsonPropertyName("rotate")]
    public int Rotate { get; set; } = 0;

    [JsonPropertyName("formatter")]
    public string? Formatter { get; set; }

    [JsonPropertyName("distance")]
    public int? Distance { get; set; }

    [JsonPropertyName("color")]
    public string? Color { get; set; }

    [JsonPropertyName("fontSize")]
    public int? FontSize { get; set; }
}

/// <summary>
///     Chart series
/// </summary>
public class ChartSeries
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = ChartSeriesType.Line;

    [JsonPropertyName("animation")]
    public bool? Animation { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("coordinateSystem")]
    public string? CoordinateSystem { get; set; }

    [JsonPropertyName("xAxisIndex")]
    public int? XAxisIndex { get; set; }

    [JsonPropertyName("yAxisIndex")]
    public int? YAxisIndex { get; set; }

    [JsonPropertyName("data")]
    public object? Data { get; set; }

    [JsonPropertyName("stack")]
    public string? Stack { get; set; }

    [JsonPropertyName("smooth")]
    public bool Smooth { get; set; } = false;

    [JsonPropertyName("step")]
    public string? Step { get; set; }

    [JsonPropertyName("connectNulls")]
    public bool ConnectNulls { get; set; }

    [JsonPropertyName("showSymbol")]
    public bool ShowSymbol { get; set; } = true;

    [JsonPropertyName("symbol")]
    public string? Symbol { get; set; }

    [JsonPropertyName("symbolSize")]
    public object? SymbolSize { get; set; }

    [JsonPropertyName("areaStyle")]
    public object? AreaStyle { get; set; }

    [JsonPropertyName("itemStyle")]
    public ChartItemStyle? ItemStyle { get; set; }

    [JsonPropertyName("label")]
    public ChartLabel? Label { get; set; }

    [JsonPropertyName("radius")]
    public object? Radius { get; set; } // For pie charts: ["40%", "70%"]

    [JsonPropertyName("center")]
    public List<string>? Center { get; set; } // For pie charts: ["50%", "50%"]

    [JsonPropertyName("roseType")]
    public string? RoseType { get; set; } // For pie charts: area, radius

    [JsonPropertyName("emphasis")]
    public ChartEmphasis? Emphasis { get; set; }

    // Graph / Tree / Sankey properties
    [JsonPropertyName("layout")]
    public string? Layout { get; set; }

    [JsonPropertyName("links")]
    public List<object>? Links { get; set; }

    [JsonPropertyName("categories")]
    public List<object>? Categories { get; set; }

    [JsonPropertyName("force")]
    public object? Force { get; set; }

    [JsonPropertyName("roam")]
    public bool Roam { get; set; }

    [JsonPropertyName("draggable")]
    public bool Draggable { get; set; }

    // Effect Scatter
    [JsonPropertyName("rippleEffect")]
    public object? RippleEffect { get; set; }

    // Bar Race
    [JsonPropertyName("realtimeSort")]
    public bool RealtimeSort { get; set; }

    [JsonPropertyName("seriesLayoutBy")]
    public string? SeriesLayoutBy { get; set; }

    [JsonPropertyName("encode")]
    public object? Encode { get; set; }

    // Gauge
    [JsonPropertyName("progress")]
    public object? Progress { get; set; }

    [JsonPropertyName("detail")]
    public object? Detail { get; set; }

    [JsonPropertyName("axisLine")]
    public object? AxisLine { get; set; }

    [JsonPropertyName("axisTick")]
    public object? AxisTick { get; set; }

    [JsonPropertyName("splitLine")]
    public object? SplitLine { get; set; }

    [JsonPropertyName("axisLabel")]
    public object? AxisLabel { get; set; }

    [JsonPropertyName("anchor")]
    public object? Anchor { get; set; }

    [JsonPropertyName("title")]
    public object? Title { get; set; }

    [JsonPropertyName("pointer")]
    public object? Pointer { get; set; }
}

/// <summary>
///     Item style
/// </summary>
public class ChartItemStyle
{
    [JsonPropertyName("color")]
    public object? Color { get; set; }

    [JsonPropertyName("borderRadius")]
    public int BorderRadius { get; set; } = 0;

    [JsonPropertyName("borderColor")]
    public string? BorderColor { get; set; }

    [JsonPropertyName("borderWidth")]
    public int BorderWidth { get; set; } = 0;

    [JsonPropertyName("shadowBlur")]
    public int? ShadowBlur { get; set; }

    [JsonPropertyName("shadowColor")]
    public string? ShadowColor { get; set; }

    [JsonPropertyName("opacity")]
    public double? Opacity { get; set; }
}

/// <summary>
///     Chart label
/// </summary>
public class ChartLabel
{
    [JsonPropertyName("show")]
    public bool Show { get; set; } = false;

    [JsonPropertyName("position")]
    public string Position { get; set; } = ChartPosition.Top;

    [JsonPropertyName("formatter")]
    public string? Formatter { get; set; }

    [JsonPropertyName("color")]
    public string? Color { get; set; }

    [JsonPropertyName("fontSize")]
    public int? FontSize { get; set; }

    [JsonPropertyName("valueAnimation")]
    public bool ValueAnimation { get; set; }
}

/// <summary>
///     Emphasis style
/// </summary>
public class ChartEmphasis
{
    [JsonPropertyName("focus")]
    public string? Focus { get; set; }

    [JsonPropertyName("itemStyle")]
    public ChartItemStyle? ItemStyle { get; set; }

    [JsonPropertyName("label")]
    public ChartLabel? Label { get; set; }
}

/// <summary>
///     Text style
/// </summary>
public class ChartTextStyle
{
    [JsonPropertyName("fontSize")]
    public int FontSize { get; set; } = 14;

    [JsonPropertyName("fontWeight")]
    public string FontWeight { get; set; } = "normal";

    [JsonPropertyName("color")]
    public string? Color { get; set; }
}

/// <summary>
///     Pie chart data item
/// </summary>
public class PieDataItem
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("value")]
    public double Value { get; set; }

    [JsonPropertyName("itemStyle")]
    public ChartItemStyle? ItemStyle { get; set; }
}

/// <summary>
///     Chart click event data
/// </summary>
public class ChartClickEventArgs
{
    public string? ComponentType { get; set; }
    public string? SeriesType { get; set; }
    public int SeriesIndex { get; set; }
    public string? SeriesName { get; set; }
    public string? Name { get; set; }
    public int DataIndex { get; set; }
    public object? Value { get; set; }
}