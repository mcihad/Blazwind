using System.Text.Json.Serialization;

namespace Blazwind.Components.Workflow;

/// <summary>
/// Workflow node type
/// </summary>
public enum WorkflowNodeType
{
    Start,
    End,
    Task,
    Decision,
    Parallel,
    Subprocess
}

/// <summary>
/// Workflow node status
/// </summary>
public enum WorkflowNodeStatus
{
    Pending,
    Active,
    Completed,
    Error,
    Skipped
}

/// <summary>
/// Workflow direction
/// </summary>
public enum WorkflowDirection
{
    Horizontal,
    Vertical
}

/// <summary>
/// Represents a workflow node
/// </summary>
public class WorkflowNode
{
    /// <summary>
    /// Unique identifier
    /// </summary>
    [JsonPropertyName("id")]
    public string Id { get; set; } = "";

    /// <summary>
    /// Node type
    /// </summary>
    [JsonPropertyName("type")]
    public string Type { get; set; } = "task";

    /// <summary>
    /// Display label
    /// </summary>
    [JsonPropertyName("label")]
    public string Label { get; set; } = "";

    /// <summary>
    /// Description
    /// </summary>
    [JsonPropertyName("description")]
    public string? Description { get; set; }

    /// <summary>
    /// Node status
    /// </summary>
    [JsonPropertyName("status")]
    public string? Status { get; set; }

    /// <summary>
    /// Icon class
    /// </summary>
    [JsonPropertyName("icon")]
    public string? Icon { get; set; }

    /// <summary>
    /// Additional metadata
    /// </summary>
    [JsonPropertyName("metadata")]
    public Dictionary<string, object>? Metadata { get; set; }

    /// <summary>
    /// Helper method to create a start node
    /// </summary>
    public static WorkflowNode CreateStart(string id, string label = "Başlangıç") => new()
    {
        Id = id,
        Type = "start",
        Label = label,
        Status = "completed"
    };

    /// <summary>
    /// Helper method to create an end node
    /// </summary>
    public static WorkflowNode CreateEnd(string id, string label = "Bitiş") => new()
    {
        Id = id,
        Type = "end",
        Label = label
    };

    /// <summary>
    /// Helper method to create a task node
    /// </summary>
    public static WorkflowNode CreateTask(string id, string label,
        WorkflowNodeStatus status = WorkflowNodeStatus.Pending) => new()
    {
        Id = id,
        Type = "task",
        Label = label,
        Status = status.ToString().ToLower()
    };

    /// <summary>
    /// Helper method to create a decision node
    /// </summary>
    public static WorkflowNode CreateDecision(string id, string label) => new()
    {
        Id = id,
        Type = "decision",
        Label = label
    };
}

/// <summary>
/// Represents a workflow edge (connection between nodes)
/// </summary>
public class WorkflowEdge
{
    /// <summary>
    /// Unique identifier
    /// </summary>
    [JsonPropertyName("id")]
    public string Id { get; set; } = "";

    /// <summary>
    /// Source node ID
    /// </summary>
    [JsonPropertyName("from")]
    public string From { get; set; } = "";

    /// <summary>
    /// Target node ID
    /// </summary>
    [JsonPropertyName("to")]
    public string To { get; set; } = "";

    /// <summary>
    /// Edge label
    /// </summary>
    [JsonPropertyName("label")]
    public string? Label { get; set; }

    /// <summary>
    /// Condition expression
    /// </summary>
    [JsonPropertyName("condition")]
    public string? Condition { get; set; }

    /// <summary>
    /// Helper method to create an edge
    /// </summary>
    public static WorkflowEdge Create(string from, string to, string? label = null) => new()
    {
        Id = $"edge-{from}-{to}",
        From = from,
        To = to,
        Label = label
    };
}