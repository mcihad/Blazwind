using Blazwind.Components.Workflow.Interfaces;

namespace Blazwind.Components.Workflow.Events;

/// <summary>
///     Event args for node position changes (after drag)
/// </summary>
public class NodePositionChangedEventArgs : EventArgs
{
    public required string NodeId { get; init; }
    public required NodePosition OldPosition { get; init; }
    public required NodePosition NewPosition { get; init; }
}

/// <summary>
///     Event args for node status changes
/// </summary>
public class NodeStatusChangedEventArgs : EventArgs
{
    public required string NodeId { get; init; }
    public required WorkflowNodeStatus OldStatus { get; init; }
    public required WorkflowNodeStatus NewStatus { get; init; }
}

/// <summary>
///     Event args for node click
/// </summary>
public class NodeClickedEventArgs : EventArgs
{
    public required string NodeId { get; init; }
    public required IWorkflowNode Node { get; init; }
}

/// <summary>
///     Event args for edge click
/// </summary>
public class EdgeClickedEventArgs : EventArgs
{
    public required string EdgeId { get; init; }
    public required IWorkflowEdge Edge { get; init; }
}