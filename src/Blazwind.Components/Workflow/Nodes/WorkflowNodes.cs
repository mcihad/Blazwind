using System.Text.Json.Serialization;
using Blazwind.Components.Workflow.Events;
using Blazwind.Components.Workflow.Interfaces;

namespace Blazwind.Components.Workflow.Nodes;

/// <summary>
///     Abstract base class for workflow nodes
/// </summary>
public abstract class WorkflowNodeBase : IWorkflowNode
{
    [JsonPropertyName("id")]
    public string Id { get; init; } = Guid.NewGuid().ToString("N")[..8];

    [JsonPropertyName("label")]
    public string Label { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("icon")]
    public string? Icon { get; set; }

    [JsonPropertyName("status")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public WorkflowNodeStatus Status { get; set; } = WorkflowNodeStatus.Pending;

    [JsonPropertyName("position")]
    public NodePosition Position { get; set; } = NodePosition.Zero;

    [JsonPropertyName("nodeType")]
    public abstract string NodeType { get; }

    [JsonPropertyName("metadata")]
    public Dictionary<string, object>? Metadata { get; set; }

    /// <summary>
    ///     Event raised when status changes
    /// </summary>
    public event EventHandler<NodeStatusChangedEventArgs>? StatusChanged;

    /// <summary>
    ///     Event raised when position changes
    /// </summary>
    public event EventHandler<NodePositionChangedEventArgs>? PositionChanged;

    /// <summary>
    ///     Update status and raise event
    /// </summary>
    public void SetStatus(WorkflowNodeStatus newStatus)
    {
        if (Status == newStatus) return;
        var oldStatus = Status;
        Status = newStatus;
        StatusChanged?.Invoke(this, new NodeStatusChangedEventArgs
        {
            NodeId = Id,
            OldStatus = oldStatus,
            NewStatus = newStatus
        });
    }

    /// <summary>
    ///     Update position and raise event
    /// </summary>
    public void SetPosition(NodePosition newPosition)
    {
        if (Position == newPosition) return;
        var oldPosition = Position;
        Position = newPosition;
        PositionChanged?.Invoke(this, new NodePositionChangedEventArgs
        {
            NodeId = Id,
            OldPosition = oldPosition,
            NewPosition = newPosition
        });
    }
}

/// <summary>
///     Start node (circle shape)
/// </summary>
public class StartNode : WorkflowNodeBase
{
    public StartNode()
    {
        Icon = "fa-solid fa-play";
    }

    public StartNode(string id, string label = "Start") : this()
    {
        Id = id;
        Label = label;
    }

    public override string NodeType => "start";
}

/// <summary>
///     End node (circle shape, bold)
/// </summary>
public class EndNode : WorkflowNodeBase
{
    public EndNode()
    {
        Icon = "fa-solid fa-flag-checkered";
    }

    public EndNode(string id, string label = "End") : this()
    {
        Id = id;
        Label = label;
    }

    public override string NodeType => "end";
}

/// <summary>
///     Task node (rounded rectangle)
/// </summary>
public class TaskNode : WorkflowNodeBase
{
    public TaskNode()
    {
    }

    public TaskNode(string id, string label, string? icon = null)
    {
        Id = id;
        Label = label;
        Icon = icon;
    }

    public override string NodeType => "task";
}

/// <summary>
///     Decision node (diamond shape)
/// </summary>
public class DecisionNode : WorkflowNodeBase
{
    public DecisionNode()
    {
        Icon = "fa-solid fa-code-branch";
    }

    public DecisionNode(string id, string label) : this()
    {
        Id = id;
        Label = label;
    }

    public override string NodeType => "decision";
}

/// <summary>
///     Parallel gateway node
/// </summary>
public class ParallelNode : WorkflowNodeBase
{
    public ParallelNode()
    {
        Icon = "fa-solid fa-code-merge";
    }

    public ParallelNode(string id, string label) : this()
    {
        Id = id;
        Label = label;
    }

    public override string NodeType => "parallel";
}

/// <summary>
///     Subprocess node (nested workflow)
/// </summary>
public class SubprocessNode : WorkflowNodeBase
{
    public SubprocessNode()
    {
        Icon = "fa-solid fa-layer-group";
    }

    public SubprocessNode(string id, string label) : this()
    {
        Id = id;
        Label = label;
    }

    public override string NodeType => "subprocess";

    /// <summary>
    ///     Optional nested workflow
    /// </summary>
    public List<IWorkflowNode>? NestedNodes { get; set; }
}