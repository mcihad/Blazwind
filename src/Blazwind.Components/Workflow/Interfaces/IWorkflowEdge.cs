namespace Blazwind.Components.Workflow.Interfaces;

/// <summary>
/// Interface for workflow edges (connections between nodes)
/// </summary>
public interface IWorkflowEdge
{
    /// <summary>
    /// Unique identifier for the edge
    /// </summary>
    string Id { get; }
    
    /// <summary>
    /// Source node ID
    /// </summary>
    string FromNodeId { get; }
    
    /// <summary>
    /// Target node ID
    /// </summary>
    string ToNodeId { get; }
    
    /// <summary>
    /// Optional label displayed on the edge
    /// </summary>
    string? Label { get; set; }
    
    /// <summary>
    /// Edge type for styling (e.g., "default", "conditional", "error")
    /// </summary>
    string EdgeType { get; }
    
    /// <summary>
    /// Whether the edge should be animated
    /// </summary>
    bool Animated { get; set; }
}
