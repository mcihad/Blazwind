using System.Text.Json.Serialization;

namespace Blazwind.Components.OrgChart;

/// <summary>
/// Represents a node in the organization chart
/// </summary>
public class OrgChartNode
{
    /// <summary>
    /// Unique identifier for the node
    /// </summary>
    [JsonPropertyName("id")]
    public string Id { get; set; } = "";

    /// <summary>
    /// Display name
    /// </summary>
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    /// <summary>
    /// Job title or role
    /// </summary>
    [JsonPropertyName("title")]
    public string? Title { get; set; }

    /// <summary>
    /// Avatar image URL
    /// </summary>
    [JsonPropertyName("avatar")]
    public string? Avatar { get; set; }

    /// <summary>
    /// Department name
    /// </summary>
    [JsonPropertyName("department")]
    public string? Department { get; set; }

    /// <summary>
    /// Email address
    /// </summary>
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    /// <summary>
    /// Phone number
    /// </summary>
    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    /// <summary>
    /// Child nodes
    /// </summary>
    [JsonPropertyName("children")]
    public List<OrgChartNode>? Children { get; set; }

    /// <summary>
    /// Additional custom data
    /// </summary>
    [JsonPropertyName("metadata")]
    public Dictionary<string, object>? Metadata { get; set; }

    /// <summary>
    /// Node background color (hex, e.g. "#3b82f6")
    /// </summary>
    [JsonPropertyName("color")]
    public string? Color { get; set; }

    /// <summary>
    /// Node border color (hex)
    /// </summary>
    [JsonPropertyName("borderColor")]
    public string? BorderColor { get; set; }
}