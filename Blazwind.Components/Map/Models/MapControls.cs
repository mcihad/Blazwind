using System.Text.Json.Serialization;

namespace Blazwind.Components.Map.Models;

/// <summary>
/// Control position on the map
/// </summary>
public static class ControlPosition
{
    public const string TopLeft = "top-left";
    public const string TopRight = "top-right";
    public const string BottomLeft = "bottom-left";
    public const string BottomRight = "bottom-right";
}

/// <summary>
/// Navigation control options
/// </summary>
public class NavigationControlOptions
{
    [JsonPropertyName("showCompass")] public bool ShowCompass { get; set; } = true;

    [JsonPropertyName("showZoom")] public bool ShowZoom { get; set; } = true;

    [JsonPropertyName("visualizePitch")] public bool VisualizePitch { get; set; }

    [JsonPropertyName("position")] public string Position { get; set; } = ControlPosition.TopRight;
}

/// <summary>
/// Scale control options
/// </summary>
public class ScaleControlOptions
{
    [JsonPropertyName("maxWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? MaxWidth { get; set; }

    [JsonPropertyName("unit")] public string Unit { get; set; } = "metric";

    [JsonPropertyName("position")] public string Position { get; set; } = ControlPosition.BottomLeft;
}

/// <summary>
/// Fullscreen control options
/// </summary>
public class FullscreenControlOptions
{
    [JsonPropertyName("container")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Container { get; set; }

    [JsonPropertyName("position")] public string Position { get; set; } = ControlPosition.TopRight;
}

/// <summary>
/// Geolocate control options
/// </summary>
public class GeolocateControlOptions
{
    [JsonPropertyName("positionOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public PositionOptions? PositionOptions { get; set; }

    [JsonPropertyName("fitBoundsOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public FitBoundsOptions? FitBoundsOptions { get; set; }

    [JsonPropertyName("trackUserLocation")]
    public bool TrackUserLocation { get; set; }

    [JsonPropertyName("showAccuracyCircle")]
    public bool ShowAccuracyCircle { get; set; } = true;

    [JsonPropertyName("showUserLocation")] public bool ShowUserLocation { get; set; } = true;

    [JsonPropertyName("showUserHeading")] public bool ShowUserHeading { get; set; }

    [JsonPropertyName("position")] public string Position { get; set; } = ControlPosition.TopRight;
}

/// <summary>
/// Position options for geolocation
/// </summary>
public class PositionOptions
{
    [JsonPropertyName("enableHighAccuracy")]
    public bool EnableHighAccuracy { get; set; }

    [JsonPropertyName("timeout")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Timeout { get; set; }

    [JsonPropertyName("maximumAge")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? MaximumAge { get; set; }
}

/// <summary>
/// Attribution control options
/// </summary>
public class AttributionControlOptions
{
    [JsonPropertyName("compact")] public bool Compact { get; set; } = true;

    [JsonPropertyName("customAttribution")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? CustomAttribution { get; set; }

    [JsonPropertyName("position")] public string Position { get; set; } = ControlPosition.BottomRight;
}

/// <summary>
/// Terrain control options
/// </summary>
public class TerrainControlOptions
{
    [JsonPropertyName("source")] public string Source { get; set; } = string.Empty;

    [JsonPropertyName("exaggeration")] public double Exaggeration { get; set; } = 1.0;

    [JsonPropertyName("position")] public string Position { get; set; } = ControlPosition.TopRight;
}

/// <summary>
/// Logo control options
/// </summary>
public class LogoControlOptions
{
    [JsonPropertyName("compact")] public bool Compact { get; set; }

    [JsonPropertyName("position")] public string Position { get; set; } = ControlPosition.BottomLeft;
}

/// <summary>
/// All map control configuration
/// </summary>
public class MapControlsConfig
{
    public NavigationControlOptions? Navigation { get; set; }
    public ScaleControlOptions? Scale { get; set; }
    public FullscreenControlOptions? Fullscreen { get; set; }
    public GeolocateControlOptions? Geolocate { get; set; }
    public AttributionControlOptions? Attribution { get; set; }
    public TerrainControlOptions? Terrain { get; set; }
    public LogoControlOptions? Logo { get; set; }
}