using System.Text.Json.Serialization;

namespace Blazwind.Components.Map.Models;

/// <summary>
/// Map marker options
/// </summary>
public class MapMarker
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public LngLat LngLat { get; set; } = new(0, 0);

    [JsonPropertyName("color")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Color { get; set; }

    [JsonPropertyName("draggable")] public bool Draggable { get; set; }

    [JsonPropertyName("rotation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Rotation { get; set; }

    [JsonPropertyName("rotationAlignment")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? RotationAlignment { get; set; }

    [JsonPropertyName("pitchAlignment")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PitchAlignment { get; set; }

    [JsonPropertyName("scale")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Scale { get; set; }

    [JsonPropertyName("anchor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Anchor { get; set; }

    [JsonPropertyName("offset")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double[]? Offset { get; set; }

    /// <summary>
    /// HTML content for custom marker
    /// </summary>
    [JsonPropertyName("element")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Element { get; set; }

    /// <summary>
    /// Popup content (HTML)
    /// </summary>
    [JsonPropertyName("popupHtml")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PopupHtml { get; set; }

    /// <summary>
    /// Popup options
    /// </summary>
    [JsonPropertyName("popupOptions")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public MapPopupOptions? PopupOptions { get; set; }

    /// <summary>
    /// Converts this marker to a JavaScript-compatible object
    /// </summary>
    public object ToJsObject()
    {
        var result = new Dictionary<string, object?>
        {
            ["id"] = Id,
            ["lngLat"] = new[] { LngLat.Lng, LngLat.Lat },
            ["draggable"] = Draggable
        };

        if (Color != null) result["color"] = Color;
        if (Rotation.HasValue) result["rotation"] = Rotation.Value;
        if (RotationAlignment != null) result["rotationAlignment"] = RotationAlignment;
        if (PitchAlignment != null) result["pitchAlignment"] = PitchAlignment;
        if (Scale.HasValue) result["scale"] = Scale.Value;
        if (Anchor != null) result["anchor"] = Anchor;
        if (Offset != null) result["offset"] = Offset;
        if (Element != null) result["element"] = Element;
        if (PopupHtml != null) result["popupHtml"] = PopupHtml;
        if (PopupOptions != null) result["popupOptions"] = PopupOptions.ToJsObject();

        return result;
    }
}

/// <summary>
/// Popup options
/// </summary>
public class MapPopupOptions
{
    [JsonPropertyName("closeButton")] public bool CloseButton { get; set; } = true;

    [JsonPropertyName("closeOnClick")] public bool CloseOnClick { get; set; } = true;

    [JsonPropertyName("closeOnMove")] public bool CloseOnMove { get; set; }

    [JsonPropertyName("anchor")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Anchor { get; set; }

    [JsonPropertyName("offset")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Offset { get; set; }

    [JsonPropertyName("className")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? ClassName { get; set; }

    [JsonPropertyName("maxWidth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? MaxWidth { get; set; }

    /// <summary>
    /// Converts this options to a JavaScript-compatible object
    /// </summary>
    public object ToJsObject()
    {
        var result = new Dictionary<string, object?>
        {
            ["closeButton"] = CloseButton,
            ["closeOnClick"] = CloseOnClick,
            ["closeOnMove"] = CloseOnMove
        };

        if (Anchor != null) result["anchor"] = Anchor;
        if (Offset != null) result["offset"] = Offset;
        if (ClassName != null) result["className"] = ClassName;
        if (MaxWidth != null) result["maxWidth"] = MaxWidth;

        return result;
    }
}

/// <summary>
/// Popup model for standalone popups
/// </summary>
public class MapPopup
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public LngLat LngLat { get; set; } = new(0, 0);

    [JsonPropertyName("html")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Html { get; set; }

    [JsonPropertyName("text")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Text { get; set; }

    [JsonPropertyName("options")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public MapPopupOptions? Options { get; set; }
}