using System.Text.Json.Serialization;

namespace Blazwind.Components.Map.Models;

/// <summary>
///     Comprehensive MapLibre source model
/// </summary>
public class MapSource
{
    /// <summary>
    ///     Unique source identifier (not sent to MapLibre, used as key)
    /// </summary>
    [JsonIgnore]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    ///     Source type: vector, raster, raster-dem, geojson, image, video, canvas
    /// </summary>
    [JsonPropertyName("type")]
    public string Type { get; set; } = MapSourceType.Vector;

    /// <summary>
    ///     Tile URL pattern for vector/raster sources
    /// </summary>
    [JsonPropertyName("tiles")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string>? Tiles { get; set; }

    /// <summary>
    ///     TileJSON URL or style URL
    /// </summary>
    [JsonPropertyName("url")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Url { get; set; }

    /// <summary>
    ///     GeoJSON data (object, URL string, or FeatureCollection)
    /// </summary>
    [JsonPropertyName("data")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Data { get; set; }

    /// <summary>
    ///     Tile size (default 512)
    /// </summary>
    [JsonPropertyName("tileSize")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? TileSize { get; set; }

    /// <summary>
    ///     Attribution text
    /// </summary>
    [JsonPropertyName("attribution")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Attribution { get; set; }

    /// <summary>
    ///     Tile scheme: xyz or tms
    /// </summary>
    [JsonPropertyName("scheme")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Scheme { get; set; }

    /// <summary>
    ///     Minimum zoom level
    /// </summary>
    [JsonPropertyName("minzoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? MinZoom { get; set; }

    /// <summary>
    ///     Maximum zoom level
    /// </summary>
    [JsonPropertyName("maxzoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? MaxZoom { get; set; }

    /// <summary>
    ///     Bounding box [sw_lng, sw_lat, ne_lng, ne_lat]
    /// </summary>
    [JsonPropertyName("bounds")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double[]? Bounds { get; set; }

    /// <summary>
    ///     Whether to generate feature IDs (GeoJSON only)
    /// </summary>
    [JsonPropertyName("generateId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? GenerateId { get; set; }

    /// <summary>
    ///     Property to use as feature ID (GeoJSON only)
    /// </summary>
    [JsonPropertyName("promoteId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? PromoteId { get; set; }

    /// <summary>
    ///     Cluster configuration (GeoJSON only)
    /// </summary>
    [JsonPropertyName("cluster")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Cluster { get; set; }

    /// <summary>
    ///     Cluster radius (GeoJSON only)
    /// </summary>
    [JsonPropertyName("clusterRadius")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? ClusterRadius { get; set; }

    /// <summary>
    ///     Maximum zoom to cluster points (GeoJSON only)
    /// </summary>
    [JsonPropertyName("clusterMaxZoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? ClusterMaxZoom { get; set; }

    /// <summary>
    ///     Cluster properties (GeoJSON only)
    /// </summary>
    [JsonPropertyName("clusterProperties")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Dictionary<string, object>? ClusterProperties { get; set; }

    /// <summary>
    ///     Line metrics (GeoJSON only, for line-gradient)
    /// </summary>
    [JsonPropertyName("lineMetrics")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? LineMetrics { get; set; }

    /// <summary>
    ///     Buffer size for tiles
    /// </summary>
    [JsonPropertyName("buffer")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Buffer { get; set; }

    /// <summary>
    ///     Tolerance for simplification (GeoJSON only)
    /// </summary>
    [JsonPropertyName("tolerance")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Tolerance { get; set; }

    /// <summary>
    ///     Encoding for raster-dem: terrarium or mapbox
    /// </summary>
    [JsonPropertyName("encoding")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Encoding { get; set; }

    /// <summary>
    ///     Red factor for custom encoding
    /// </summary>
    [JsonPropertyName("redFactor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? RedFactor { get; set; }

    /// <summary>
    ///     Blue factor for custom encoding
    /// </summary>
    [JsonPropertyName("blueFactor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? BlueFactor { get; set; }

    /// <summary>
    ///     Green factor for custom encoding
    /// </summary>
    [JsonPropertyName("greenFactor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? GreenFactor { get; set; }

    /// <summary>
    ///     Base shift for custom encoding
    /// </summary>
    [JsonPropertyName("baseShift")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? BaseShift { get; set; }

    /// <summary>
    ///     Image coordinates (image source)
    /// </summary>
    [JsonPropertyName("coordinates")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double[][]? Coordinates { get; set; }

    /// <summary>
    ///     Video URLs (video source)
    /// </summary>
    [JsonPropertyName("urls")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string>? Urls { get; set; }

    /// <summary>
    ///     Whether source is volatile
    /// </summary>
    [JsonPropertyName("volatile")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Volatile { get; set; }

    /// <summary>
    ///     Converts this source to a JavaScript-compatible object
    /// </summary>
    public object ToJsObject()
    {
        var result = new Dictionary<string, object?>();

        result["type"] = Type;

        if (Tiles != null) result["tiles"] = Tiles;
        if (Url != null) result["url"] = Url;
        if (Data != null) result["data"] = Data;
        if (TileSize.HasValue) result["tileSize"] = TileSize.Value;
        if (Attribution != null) result["attribution"] = Attribution;
        if (Scheme != null) result["scheme"] = Scheme;
        if (MinZoom.HasValue) result["minzoom"] = MinZoom.Value;
        if (MaxZoom.HasValue) result["maxzoom"] = MaxZoom.Value;
        if (Bounds != null) result["bounds"] = Bounds;
        if (GenerateId.HasValue) result["generateId"] = GenerateId.Value;
        if (PromoteId != null) result["promoteId"] = PromoteId;
        if (Cluster.HasValue) result["cluster"] = Cluster.Value;
        if (ClusterRadius.HasValue) result["clusterRadius"] = ClusterRadius.Value;
        if (ClusterMaxZoom.HasValue) result["clusterMaxZoom"] = ClusterMaxZoom.Value;
        if (ClusterProperties != null) result["clusterProperties"] = ClusterProperties;
        if (LineMetrics.HasValue) result["lineMetrics"] = LineMetrics.Value;
        if (Buffer.HasValue) result["buffer"] = Buffer.Value;
        if (Tolerance.HasValue) result["tolerance"] = Tolerance.Value;
        if (Encoding != null) result["encoding"] = Encoding;
        if (Coordinates != null) result["coordinates"] = Coordinates;
        if (Urls != null) result["urls"] = Urls;
        if (Volatile.HasValue) result["volatile"] = Volatile.Value;

        return result;
    }
}

/// <summary>
///     WMS source configuration helper
/// </summary>
public static class WmsSourceHelper
{
    /// <summary>
    ///     Creates a WMS raster source
    /// </summary>
    public static MapSource CreateWmsSource(
        string id,
        string baseUrl,
        string layers,
        int tileSize = 256,
        string format = "image/png",
        bool transparent = true,
        string version = "1.1.1",
        string? crs = null,
        string? attribution = null)
    {
        // MapLibre only supports {bbox-epsg-3857} placeholder for raster sources
        // WIDTH and HEIGHT must be hardcoded to match tileSize
        var url = $"{baseUrl}?SERVICE=WMS&VERSION={version}&REQUEST=GetMap" +
                  $"&LAYERS={layers}&FORMAT={format}&TRANSPARENT={transparent.ToString().ToLower()}" +
                  $"&{(version == "1.3.0" ? "CRS" : "SRS")}={crs ?? "EPSG:3857"}" +
                  $"&BBOX={{bbox-epsg-3857}}&WIDTH={tileSize}&HEIGHT={tileSize}";

        return new MapSource
        {
            Id = id,
            Type = MapSourceType.Raster,
            Tiles = new List<string> { url },
            TileSize = tileSize,
            Attribution = attribution
        };
    }
}

/// <summary>
///     Martin tile server source helper
/// </summary>
public static class MartinSourceHelper
{
    /// <summary>
    ///     Creates a Martin vector tile source
    /// </summary>
    public static MapSource CreateMartinSource(
        string id,
        string martinBaseUrl,
        string tableName,
        int minZoom = 0,
        int maxZoom = 22,
        string? attribution = null)
    {
        return new MapSource
        {
            Id = id,
            Type = MapSourceType.Vector,
            Tiles = new List<string> { $"{martinBaseUrl}/{tableName}/{{z}}/{{x}}/{{y}}" },
            MinZoom = minZoom,
            MaxZoom = maxZoom,
            Attribution = attribution
        };
    }
}

/// <summary>
///     GeoServer source helper
/// </summary>
public static class GeoServerSourceHelper
{
    /// <summary>
    ///     Creates a GeoServer WMS source
    /// </summary>
    public static MapSource CreateGeoServerWmsSource(
        string id,
        string geoserverUrl,
        string workspace,
        string layerName,
        int tileSize = 256,
        string format = "image/png",
        string? attribution = null)
    {
        var url = $"{geoserverUrl}/{workspace}/wms" +
                  $"?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap" +
                  $"&LAYERS={workspace}:{layerName}&FORMAT={format}&TRANSPARENT=true" +
                  "&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH={width}&HEIGHT={height}";

        return new MapSource
        {
            Id = id,
            Type = MapSourceType.Raster,
            Tiles = new List<string> { url },
            TileSize = tileSize,
            Attribution = attribution
        };
    }

    /// <summary>
    ///     Creates a GeoServer WFS GeoJSON source
    /// </summary>
    public static MapSource CreateGeoServerWfsSource(
        string id,
        string geoserverUrl,
        string workspace,
        string layerName,
        string? cqlFilter = null,
        int maxFeatures = 10000,
        string? attribution = null)
    {
        var url = $"{geoserverUrl}/{workspace}/ows" +
                  $"?service=WFS&version=1.0.0&request=GetFeature" +
                  $"&typeName={workspace}:{layerName}&outputFormat=application/json" +
                  $"&maxFeatures={maxFeatures}";

        if (!string.IsNullOrEmpty(cqlFilter)) url += $"&CQL_FILTER={Uri.EscapeDataString(cqlFilter)}";

        return new MapSource
        {
            Id = id,
            Type = MapSourceType.GeoJson,
            Data = url,
            Attribution = attribution
        };
    }
}