using System.Text.Json.Serialization;

namespace Blazwind.Components.Map.Models;

/// <summary>
/// Map events that can be subscribed to
/// </summary>
public class MapEventArgs
{
    public string Type { get; set; } = string.Empty;
}

/// <summary>
/// Mouse event arguments
/// </summary>
public class MapMouseEventArgs : MapEventArgs
{
    public LngLat LngLat { get; set; } = new(0, 0);

    [JsonPropertyName("point")] public double[] Point { get; set; } = new[] { 0.0, 0.0 };

    [JsonPropertyName("clientPoint")] public double[] ClientPoint { get; set; } = new[] { 0.0, 0.0 };

    [JsonPropertyName("originalEvent")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? OriginalEvent { get; set; }
}

/// <summary>
/// Layer click event arguments
/// </summary>
public class MapLayerEventArgs : MapEventArgs
{
    [JsonPropertyName("layerId")] public string LayerId { get; set; } = string.Empty;

    public LngLat LngLat { get; set; } = new(0, 0);

    [JsonPropertyName("features")] public List<MapFeature> Features { get; set; } = new();
}

/// <summary>
/// Map feature from query results
/// </summary>
public class MapFeature
{
    [JsonPropertyName("id")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Id { get; set; }

    [JsonPropertyName("type")] public string Type { get; set; } = "Feature";

    [JsonPropertyName("geometry")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public MapFeatureGeometry? Geometry { get; set; }

    [JsonPropertyName("properties")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Dictionary<string, object>? Properties { get; set; }

    [JsonPropertyName("source")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Source { get; set; }

    [JsonPropertyName("sourceLayer")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? SourceLayer { get; set; }

    [JsonPropertyName("layer")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Layer { get; set; }
}

/// <summary>
/// GeoJSON geometry
/// </summary>
public class MapFeatureGeometry
{
    [JsonPropertyName("type")] public string Type { get; set; } = "Point";

    [JsonPropertyName("coordinates")] public object Coordinates { get; set; } = new double[] { 0.0, 0.0 };
}

/// <summary>
/// Move event arguments
/// </summary>
public class MapMoveEventArgs : MapEventArgs
{
    public LngLat Center { get; set; } = new(0, 0);

    [JsonPropertyName("zoom")] public double Zoom { get; set; }

    [JsonPropertyName("bearing")] public double Bearing { get; set; }

    [JsonPropertyName("pitch")] public double Pitch { get; set; }
}

/// <summary>
/// Zoom event arguments
/// </summary>
public class MapZoomEventArgs : MapEventArgs
{
    [JsonPropertyName("zoom")] public double Zoom { get; set; }
}

/// <summary>
/// Rotate event arguments
/// </summary>
public class MapRotateEventArgs : MapEventArgs
{
    [JsonPropertyName("bearing")] public double Bearing { get; set; }
}

/// <summary>
/// Pitch event arguments
/// </summary>
public class MapPitchEventArgs : MapEventArgs
{
    [JsonPropertyName("pitch")] public double Pitch { get; set; }
}

/// <summary>
/// Data event arguments
/// </summary>
public class MapDataEventArgs : MapEventArgs
{
    [JsonPropertyName("dataType")] public string DataType { get; set; } = string.Empty;

    [JsonPropertyName("isSourceLoaded")] public bool IsSourceLoaded { get; set; }

    [JsonPropertyName("sourceId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? SourceId { get; set; }

    [JsonPropertyName("sourceDataType")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? SourceDataType { get; set; }
}

/// <summary>
/// Error event arguments
/// </summary>
public class MapErrorEventArgs : MapEventArgs
{
    [JsonPropertyName("error")] public MapError Error { get; set; } = new();
}

/// <summary>
/// Map error
/// </summary>
public class MapError
{
    [JsonPropertyName("message")] public string Message { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Status { get; set; }

    [JsonPropertyName("url")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Url { get; set; }
}

/// <summary>
/// Marker drag event arguments
/// </summary>
public class MapMarkerEventArgs : MapEventArgs
{
    [JsonPropertyName("markerId")] public string MarkerId { get; set; } = string.Empty;

    public LngLat LngLat { get; set; } = new(0, 0);
}

/// <summary>
/// Draw event arguments
/// </summary>
public class MapDrawEventArgs : MapEventArgs
{
    [JsonPropertyName("features")] public List<MapFeature> Features { get; set; } = new();
}

/// <summary>
/// Enhanced layer click event arguments with click order priority
/// </summary>
public class MapLayerClickEventArgs : MapLayerEventArgs
{
    /// <summary>
    /// Click order/priority of the clicked layer (higher = top priority)
    /// </summary>
    [JsonPropertyName("clickOrder")]
    public int ClickOrder { get; set; }
}

/// <summary>
/// Fly animation event arguments
/// </summary>
public class MapFlyEventArgs : MapEventArgs
{
    /// <summary>
    /// Target center of the fly animation
    /// </summary>
    public LngLat? TargetCenter { get; set; }

    /// <summary>
    /// Target zoom level
    /// </summary>
    [JsonPropertyName("targetZoom")]
    public double? TargetZoom { get; set; }
}