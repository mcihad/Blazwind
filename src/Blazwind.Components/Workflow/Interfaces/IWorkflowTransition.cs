namespace Blazwind.Components.Workflow.Interfaces;

/// <summary>
/// Interface for workflow transitions with conditions
/// </summary>
public interface IWorkflowTransition : IWorkflowEdge
{
    /// <summary>
    /// Condition function to evaluate if this transition is valid
    /// Returns true if the transition should be followed
    /// </summary>
    Func<WorkflowContext, bool>? Condition { get; set; }
    
    /// <summary>
    /// Priority when multiple transitions are possible (higher = first)
    /// </summary>
    int Priority { get; set; }
}

/// <summary>
/// Runtime context passed to transition conditions
/// </summary>
public class WorkflowContext
{
    /// <summary>
    /// Current node being evaluated
    /// </summary>
    public IWorkflowNode? CurrentNode { get; set; }
    
    /// <summary>
    /// All nodes in the workflow
    /// </summary>
    public IReadOnlyList<IWorkflowNode> Nodes { get; set; } = [];
    
    /// <summary>
    /// All edges in the workflow
    /// </summary>
    public IReadOnlyList<IWorkflowEdge> Edges { get; set; } = [];
    
    /// <summary>
    /// Custom data for condition evaluation
    /// </summary>
    public Dictionary<string, object> Data { get; set; } = new();
    
    /// <summary>
    /// Get typed data value
    /// </summary>
    public T? GetData<T>(string key) => Data.TryGetValue(key, out var value) && value is T typed ? typed : default;
    
    /// <summary>
    /// Set data value
    /// </summary>
    public void SetData<T>(string key, T value) where T : notnull => Data[key] = value;
}
