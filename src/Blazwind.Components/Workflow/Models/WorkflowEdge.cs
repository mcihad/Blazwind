using System.Text.Json.Serialization;
using Blazwind.Components.Workflow.Interfaces;

namespace Blazwind.Components.Workflow.Models;

/// <summary>
///     Default implementation of workflow edge
/// </summary>
public class WorkflowEdge : IWorkflowEdge
{
    public WorkflowEdge()
    {
    }

    public WorkflowEdge(string from, string to, string? label = null)
    {
        Id = $"{from}-{to}";
        FromNodeId = from;
        ToNodeId = to;
        Label = label;
    }

    [JsonPropertyName("id")]
    public string Id { get; init; } = Guid.NewGuid().ToString("N")[..8];

    [JsonPropertyName("from")]
    public string FromNodeId { get; init; } = string.Empty;

    [JsonPropertyName("to")]
    public string ToNodeId { get; init; } = string.Empty;

    [JsonPropertyName("label")]
    public string? Label { get; set; }

    [JsonPropertyName("edgeType")]
    public string EdgeType { get; init; } = "default";

    [JsonPropertyName("animated")]
    public bool Animated { get; set; }

    /// <summary>
    ///     Factory method
    /// </summary>
    public static WorkflowEdge Create(string from, string to, string? label = null)
    {
        return new WorkflowEdge(from, to, label);
    }
}

/// <summary>
///     Workflow edge with transition condition
/// </summary>
public class WorkflowTransition : WorkflowEdge, IWorkflowTransition
{
    public WorkflowTransition()
    {
    }

    public WorkflowTransition(string from, string to, string? label = null,
        Func<WorkflowContext, bool>? condition = null)
        : base(from, to, label)
    {
        Condition = condition;
    }

    [JsonIgnore]
    public Func<WorkflowContext, bool>? Condition { get; set; }

    [JsonPropertyName("priority")]
    public int Priority { get; set; }

    /// <summary>
    ///     Evaluate condition
    /// </summary>
    public bool Evaluate(WorkflowContext context)
    {
        return Condition?.Invoke(context) ?? true;
    }
}