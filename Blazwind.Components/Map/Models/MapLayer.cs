using System.Text.Json.Serialization;

namespace Blazwind.Components.Map.Models;

/// <summary>
/// Comprehensive MapLibre layer model with full metadata support
/// </summary>
public class MapLayer
{
    /// <summary>
    /// Unique layer identifier
    /// </summary>
    [JsonPropertyName("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// Layer type: fill, line, symbol, circle, heatmap, fill-extrusion, raster, hillshade, background, sky
    /// </summary>
    [JsonPropertyName("type")]
    public string Type { get; set; } = MapLayerType.Fill;

    /// <summary>
    /// Source ID for this layer
    /// </summary>
    [JsonPropertyName("source")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? SourceId { get; set; }

    /// <summary>
    /// Source layer name (for vector tile sources)
    /// </summary>
    [JsonPropertyName("source-layer")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? SourceLayer { get; set; }

    /// <summary>
    /// Paint properties for styling
    /// </summary>
    [JsonPropertyName("paint")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Paint { get; set; }

    /// <summary>
    /// Layout properties for rendering
    /// </summary>
    [JsonPropertyName("layout")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Layout { get; set; }

    /// <summary>
    /// Filter expression
    /// </summary>
    [JsonPropertyName("filter")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Filter { get; set; }

    /// <summary>
    /// Minimum zoom level
    /// </summary>
    [JsonPropertyName("minzoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public float? MinZoom { get; set; }

    /// <summary>
    /// Maximum zoom level
    /// </summary>
    [JsonPropertyName("maxzoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public float? MaxZoom { get; set; }

    /// <summary>
    /// Layer metadata for custom data
    /// </summary>
    [JsonPropertyName("metadata")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Dictionary<string, object>? Metadata { get; set; }

    /// <summary>
    /// Whether this layer responds to click/hover events
    /// </summary>
    [JsonIgnore]
    public bool Interactive { get; set; }

    /// <summary>
    /// Insert layer before this layer ID
    /// </summary>
    [JsonIgnore]
    public string? BeforeId { get; set; }

    /// <summary>
    /// Click order/priority - higher value = clicked first when layers overlap (like z-index)
    /// Default is 0. Only used when Interactive is true.
    /// </summary>
    [JsonIgnore]
    public int ClickOrder { get; set; }

    // ===== Extended Metadata (not sent to MapLibre directly) =====

    /// <summary>
    /// Display name for the layer
    /// </summary>
    [JsonIgnore]
    public string? Name { get; set; }

    /// <summary>
    /// Description of the layer
    /// </summary>
    [JsonIgnore]
    public string? Description { get; set; }

    /// <summary>
    /// Layer visibility state
    /// </summary>
    [JsonIgnore]
    public bool Visible { get; set; } = true;

    /// <summary>
    /// Layer order/priority (lower = rendered first)
    /// </summary>
    [JsonIgnore]
    public int Order { get; set; }

    /// <summary>
    /// Layer group for organization
    /// </summary>
    [JsonIgnore]
    public string? Group { get; set; }

    /// <summary>
    /// Icon class for layer panel display
    /// </summary>
    [JsonIgnore]
    public string? IconClass { get; set; }

    /// <summary>
    /// Whether the layer can be toggled by user
    /// </summary>
    [JsonIgnore]
    public bool Toggleable { get; set; } = true;

    /// <summary>
    /// Whether the layer is expanded in layer tree
    /// </summary>
    [JsonIgnore]
    public bool Expanded { get; set; }

    /// <summary>
    /// Legend configuration
    /// </summary>
    [JsonIgnore]
    public LayerLegend? Legend { get; set; }

    /// <summary>
    /// Attribute fields for feature info
    /// </summary>
    [JsonIgnore]
    public List<LayerField>? Fields { get; set; }

    /// <summary>
    /// Custom data attached to the layer
    /// </summary>
    [JsonIgnore]
    public Dictionary<string, object>? CustomData { get; set; }

    /// <summary>
    /// Converts this layer to a JavaScript-compatible object
    /// </summary>
    public object ToJsObject()
    {
        var result = new Dictionary<string, object?>
        {
            ["id"] = Id,
            ["type"] = Type,
            ["interactive"] = Interactive,
            ["clickOrder"] = ClickOrder
        };

        if (SourceId != null) result["source"] = SourceId;
        if (SourceLayer != null) result["source-layer"] = SourceLayer;
        if (Paint != null) result["paint"] = Paint;

        // Handle layout with visibility
        var layout = Layout as Dictionary<string, object?> ?? new Dictionary<string, object?>();
        if (!Visible)
        {
            layout["visibility"] = "none";
        }

        if (layout.Count > 0) result["layout"] = layout;

        if (Filter != null) result["filter"] = Filter;
        if (MinZoom.HasValue) result["minzoom"] = MinZoom.Value;
        if (MaxZoom.HasValue) result["maxzoom"] = MaxZoom.Value;

        // Include custom metadata for layer info
        var metadata = Metadata ?? new Dictionary<string, object>();
        if (Name != null) metadata["name"] = Name;
        if (Description != null) metadata["description"] = Description;
        if (Group != null) metadata["group"] = Group;
        metadata["order"] = Order;
        metadata["toggleable"] = Toggleable;
        if (metadata.Count > 0) result["metadata"] = metadata;

        return result;
    }
}

/// <summary>
/// Legend configuration for a layer
/// </summary>
public class LayerLegend
{
    public string? Title { get; set; }
    public List<LegendItem>? Items { get; set; }
    public bool Show { get; set; } = true;
}

/// <summary>
/// Individual legend item
/// </summary>
public class LegendItem
{
    public string? Label { get; set; }
    public string? Color { get; set; }
    public string? Icon { get; set; }
    public object? Value { get; set; }
    public string? Shape { get; set; } // circle, square, line
}

/// <summary>
/// Field definition for feature attributes
/// </summary>
public class LayerField
{
    public string Name { get; set; } = string.Empty;
    public string? Alias { get; set; }
    public string Type { get; set; } = "string"; // string, number, date, boolean
    public bool Visible { get; set; } = true;
    public bool Searchable { get; set; }
    public string? Format { get; set; }
    public int? Order { get; set; }
}