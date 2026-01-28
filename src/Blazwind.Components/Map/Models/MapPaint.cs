using System.Text.Json.Serialization;

namespace Blazwind.Components.Map.Models;

/// <summary>
///     Paint properties for fill layers
/// </summary>
public class FillPaint
{
    [JsonPropertyName("fill-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? FillColor { get; set; }

    [JsonPropertyName("fill-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? FillOpacity { get; set; }

    [JsonPropertyName("fill-outline-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? FillOutlineColor { get; set; }

    [JsonPropertyName("fill-pattern")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? FillPattern { get; set; }

    [JsonPropertyName("fill-antialias")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? FillAntialias { get; set; }

    [JsonPropertyName("fill-translate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double[]? FillTranslate { get; set; }

    [JsonPropertyName("fill-translate-anchor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? FillTranslateAnchor { get; set; }
}

/// <summary>
///     Paint properties for line layers
/// </summary>
public class LinePaint
{
    [JsonPropertyName("line-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? LineColor { get; set; }

    [JsonPropertyName("line-width")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? LineWidth { get; set; }

    [JsonPropertyName("line-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? LineOpacity { get; set; }

    [JsonPropertyName("line-blur")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? LineBlur { get; set; }

    [JsonPropertyName("line-dasharray")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double[]? LineDasharray { get; set; }

    [JsonPropertyName("line-gap-width")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? LineGapWidth { get; set; }

    [JsonPropertyName("line-offset")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? LineOffset { get; set; }

    [JsonPropertyName("line-translate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double[]? LineTranslate { get; set; }

    [JsonPropertyName("line-gradient")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? LineGradient { get; set; }
}

/// <summary>
///     Paint properties for circle layers
/// </summary>
public class CirclePaint
{
    [JsonPropertyName("circle-radius")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? CircleRadius { get; set; }

    [JsonPropertyName("circle-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? CircleColor { get; set; }

    [JsonPropertyName("circle-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? CircleOpacity { get; set; }

    [JsonPropertyName("circle-blur")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? CircleBlur { get; set; }

    [JsonPropertyName("circle-stroke-width")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? CircleStrokeWidth { get; set; }

    [JsonPropertyName("circle-stroke-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? CircleStrokeColor { get; set; }

    [JsonPropertyName("circle-stroke-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? CircleStrokeOpacity { get; set; }

    [JsonPropertyName("circle-translate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double[]? CircleTranslate { get; set; }

    [JsonPropertyName("circle-pitch-alignment")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? CirclePitchAlignment { get; set; }

    [JsonPropertyName("circle-pitch-scale")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? CirclePitchScale { get; set; }
}

/// <summary>
///     Paint properties for symbol layers
/// </summary>
public class SymbolPaint
{
    [JsonPropertyName("icon-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? IconColor { get; set; }

    [JsonPropertyName("icon-halo-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? IconHaloColor { get; set; }

    [JsonPropertyName("icon-halo-width")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? IconHaloWidth { get; set; }

    [JsonPropertyName("icon-halo-blur")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? IconHaloBlur { get; set; }

    [JsonPropertyName("icon-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? IconOpacity { get; set; }

    [JsonPropertyName("text-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? TextColor { get; set; }

    [JsonPropertyName("text-halo-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? TextHaloColor { get; set; }

    [JsonPropertyName("text-halo-width")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? TextHaloWidth { get; set; }

    [JsonPropertyName("text-halo-blur")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? TextHaloBlur { get; set; }

    [JsonPropertyName("text-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? TextOpacity { get; set; }
}

/// <summary>
///     Layout properties for symbol layers
/// </summary>
public class SymbolLayout
{
    [JsonPropertyName("icon-image")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? IconImage { get; set; }

    [JsonPropertyName("icon-size")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? IconSize { get; set; }

    [JsonPropertyName("icon-anchor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? IconAnchor { get; set; }

    [JsonPropertyName("icon-offset")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? IconOffset { get; set; }

    [JsonPropertyName("icon-rotate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? IconRotate { get; set; }

    [JsonPropertyName("icon-allow-overlap")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? IconAllowOverlap { get; set; }

    [JsonPropertyName("icon-ignore-placement")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? IconIgnorePlacement { get; set; }

    [JsonPropertyName("text-field")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? TextField { get; set; }

    [JsonPropertyName("text-font")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string[]? TextFont { get; set; }

    [JsonPropertyName("text-size")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? TextSize { get; set; }

    [JsonPropertyName("text-anchor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? TextAnchor { get; set; }

    [JsonPropertyName("text-offset")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? TextOffset { get; set; }

    [JsonPropertyName("text-max-width")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? TextMaxWidth { get; set; }

    [JsonPropertyName("text-line-height")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? TextLineHeight { get; set; }

    [JsonPropertyName("text-allow-overlap")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? TextAllowOverlap { get; set; }

    [JsonPropertyName("symbol-placement")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? SymbolPlacement { get; set; }

    [JsonPropertyName("symbol-spacing")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? SymbolSpacing { get; set; }

    [JsonPropertyName("visibility")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Visibility { get; set; }
}

/// <summary>
///     Paint properties for heatmap layers
/// </summary>
public class HeatmapPaint
{
    [JsonPropertyName("heatmap-radius")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? HeatmapRadius { get; set; }

    [JsonPropertyName("heatmap-weight")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? HeatmapWeight { get; set; }

    [JsonPropertyName("heatmap-intensity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? HeatmapIntensity { get; set; }

    [JsonPropertyName("heatmap-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? HeatmapColor { get; set; }

    [JsonPropertyName("heatmap-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? HeatmapOpacity { get; set; }
}

/// <summary>
///     Paint properties for fill-extrusion layers
/// </summary>
public class FillExtrusionPaint
{
    [JsonPropertyName("fill-extrusion-color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? FillExtrusionColor { get; set; }

    [JsonPropertyName("fill-extrusion-height")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? FillExtrusionHeight { get; set; }

    [JsonPropertyName("fill-extrusion-base")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? FillExtrusionBase { get; set; }

    [JsonPropertyName("fill-extrusion-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? FillExtrusionOpacity { get; set; }

    [JsonPropertyName("fill-extrusion-pattern")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? FillExtrusionPattern { get; set; }

    [JsonPropertyName("fill-extrusion-translate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double[]? FillExtrusionTranslate { get; set; }

    [JsonPropertyName("fill-extrusion-translate-anchor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? FillExtrusionTranslateAnchor { get; set; }

    [JsonPropertyName("fill-extrusion-vertical-gradient")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? FillExtrusionVerticalGradient { get; set; }
}

/// <summary>
///     Paint properties for raster layers
/// </summary>
public class RasterPaint
{
    [JsonPropertyName("raster-opacity")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? RasterOpacity { get; set; }

    [JsonPropertyName("raster-hue-rotate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? RasterHueRotate { get; set; }

    [JsonPropertyName("raster-brightness-min")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? RasterBrightnessMin { get; set; }

    [JsonPropertyName("raster-brightness-max")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? RasterBrightnessMax { get; set; }

    [JsonPropertyName("raster-saturation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? RasterSaturation { get; set; }

    [JsonPropertyName("raster-contrast")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? RasterContrast { get; set; }

    [JsonPropertyName("raster-resampling")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? RasterResampling { get; set; }

    [JsonPropertyName("raster-fade-duration")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? RasterFadeDuration { get; set; }
}