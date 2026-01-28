namespace Blazwind.Components.Workflow.Interfaces;

/// <summary>
///     Base interface for all workflow nodes
/// </summary>
public interface IWorkflowNode
{
    /// <summary>
    ///     Unique identifier for the node
    /// </summary>
    string Id { get; }

    /// <summary>
    ///     Display label
    /// </summary>
    string Label { get; set; }

    /// <summary>
    ///     Optional description
    /// </summary>
    string? Description { get; set; }

    /// <summary>
    ///     FontAwesome icon class (e.g., "fa-solid fa-user")
    /// </summary>
    string? Icon { get; set; }

    /// <summary>
    ///     Current status of the node
    /// </summary>
    WorkflowNodeStatus Status { get; set; }

    /// <summary>
    ///     Position in the canvas (for drag support)
    /// </summary>
    NodePosition Position { get; set; }

    /// <summary>
    ///     Node type identifier (e.g., "start", "end", "task", "decision")
    ///     Used for rendering and extensibility
    /// </summary>
    string NodeType { get; }

    /// <summary>
    ///     Additional metadata for custom properties
    /// </summary>
    Dictionary<string, object>? Metadata { get; set; }
}

/// <summary>
///     Node position in the workflow canvas
/// </summary>
public record NodePosition(double X, double Y)
{
    public static NodePosition Zero => new(0, 0);
}

/// <summary>
///     Status of a workflow node
/// </summary>
public enum WorkflowNodeStatus
{
    Pending,
    Active,
    Completed,
    Error,
    Skipped
}