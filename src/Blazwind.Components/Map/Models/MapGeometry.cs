using System.Text.Json.Serialization;

namespace Blazwind.Components.Map.Models;

/// <summary>
///     Represents a LngLat coordinate
/// </summary>
public class LngLat
{
    public LngLat()
    {
    }

    public LngLat(double lng, double lat)
    {
        Lng = lng;
        Lat = lat;
    }

    [JsonPropertyName("lng")]
    public double Lng { get; set; }

    [JsonPropertyName("lat")]
    public double Lat { get; set; }

    public double[] ToArray()
    {
        return new[] { Lng, Lat };
    }

    public static LngLat FromArray(double[] arr)
    {
        return new LngLat(arr[0], arr[1]);
    }

    public override string ToString()
    {
        return $"[{Lng}, {Lat}]";
    }
}

/// <summary>
///     Represents a bounding box
/// </summary>
public class LngLatBounds
{
    public LngLatBounds()
    {
    }

    public LngLatBounds(LngLat sw, LngLat ne)
    {
        Southwest = sw;
        Northeast = ne;
    }

    public LngLatBounds(double swLng, double swLat, double neLng, double neLat)
    {
        Southwest = new LngLat(swLng, swLat);
        Northeast = new LngLat(neLng, neLat);
    }

    public LngLat Southwest { get; set; } = new();
    public LngLat Northeast { get; set; } = new();

    public double[][] ToArray()
    {
        return new[]
        {
            Southwest.ToArray(),
            Northeast.ToArray()
        };
    }
}

/// <summary>
///     Camera position options
/// </summary>
public class CameraOptions
{
    [JsonIgnore]
    public LngLat? Center { get; set; }

    [JsonPropertyName("zoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Zoom { get; set; }

    [JsonPropertyName("bearing")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Bearing { get; set; }

    [JsonPropertyName("pitch")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Pitch { get; set; }

    [JsonIgnore]
    public LngLat? Around { get; set; }

    [JsonPropertyName("padding")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public PaddingOptions? Padding { get; set; }

    public virtual object ToJsObject()
    {
        var result = new Dictionary<string, object?>();

        if (Center != null) result["center"] = Center.ToArray();
        if (Zoom.HasValue) result["zoom"] = Zoom.Value;
        if (Bearing.HasValue) result["bearing"] = Bearing.Value;
        if (Pitch.HasValue) result["pitch"] = Pitch.Value;
        if (Around != null) result["around"] = Around.ToArray();
        if (Padding != null)
            result["padding"] = new
            {
                top = Padding.Top,
                bottom = Padding.Bottom,
                left = Padding.Left,
                right = Padding.Right
            };

        return result;
    }
}

/// <summary>
///     Padding options for camera
/// </summary>
public class PaddingOptions
{
    [JsonPropertyName("top")]
    public int Top { get; set; }

    [JsonPropertyName("bottom")]
    public int Bottom { get; set; }

    [JsonPropertyName("left")]
    public int Left { get; set; }

    [JsonPropertyName("right")]
    public int Right { get; set; }
}

/// <summary>
///     Animation options
/// </summary>
public class AnimationOptions
{
    [JsonPropertyName("duration")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Duration { get; set; }

    [JsonPropertyName("easing")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Easing { get; set; }

    [JsonPropertyName("essential")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Essential { get; set; }

    [JsonPropertyName("animate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Animate { get; set; }
}

/// <summary>
///     FlyTo options
/// </summary>
public class FlyToOptions : CameraOptions
{
    [JsonPropertyName("duration")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Duration { get; set; }

    [JsonPropertyName("essential")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Essential { get; set; }

    [JsonPropertyName("curve")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Curve { get; set; }

    [JsonPropertyName("speed")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Speed { get; set; }

    [JsonPropertyName("screenSpeed")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? ScreenSpeed { get; set; }

    [JsonPropertyName("maxDuration")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? MaxDuration { get; set; }

    public override object ToJsObject()
    {
        var result = (Dictionary<string, object?>)base.ToJsObject();

        if (Duration.HasValue) result["duration"] = Duration.Value;
        if (Essential.HasValue) result["essential"] = Essential.Value;
        if (Curve.HasValue) result["curve"] = Curve.Value;
        if (Speed.HasValue) result["speed"] = Speed.Value;
        if (ScreenSpeed.HasValue) result["screenSpeed"] = ScreenSpeed.Value;
        if (MaxDuration.HasValue) result["maxDuration"] = MaxDuration.Value;

        return result;
    }
}

/// <summary>
///     EaseTo options
/// </summary>
public class EaseToOptions : CameraOptions
{
    [JsonPropertyName("duration")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Duration { get; set; }

    [JsonPropertyName("essential")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Essential { get; set; }

    [JsonPropertyName("easing")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Easing { get; set; }

    public override object ToJsObject()
    {
        var result = (Dictionary<string, object?>)base.ToJsObject();

        if (Duration.HasValue) result["duration"] = Duration.Value;
        if (Essential.HasValue) result["essential"] = Essential.Value;
        if (Easing != null) result["easing"] = Easing;

        return result;
    }
}

/// <summary>
///     FitBounds options
/// </summary>
public class FitBoundsOptions
{
    [JsonPropertyName("padding")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Padding { get; set; }

    [JsonPropertyName("maxZoom")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? MaxZoom { get; set; }

    [JsonPropertyName("duration")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Duration { get; set; }

    [JsonPropertyName("linear")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Linear { get; set; }

    [JsonPropertyName("essential")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Essential { get; set; }

    [JsonPropertyName("offset")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double[]? Offset { get; set; }

    public object ToJsObject()
    {
        var result = new Dictionary<string, object?>();

        if (Padding != null) result["padding"] = Padding;
        if (MaxZoom.HasValue) result["maxZoom"] = MaxZoom.Value;
        if (Duration.HasValue) result["duration"] = Duration.Value;
        if (Linear.HasValue) result["linear"] = Linear.Value;
        if (Essential.HasValue) result["essential"] = Essential.Value;
        if (Offset != null) result["offset"] = Offset;

        return result;
    }
}