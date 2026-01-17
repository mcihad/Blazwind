# Workflow

A BPMN-style workflow visualization component.

## Examples

### Basic Usage
```razor
<BwWorkflow Nodes="_nodes" Edges="_edges" Height="300px" />

@code {
    private List<WorkflowNode> _nodes = new()
    {
        WorkflowNode.CreateStart("start", "Start"),
        WorkflowNode.CreateTask("task1", "Task 1", WorkflowNodeStatus.Active),
        WorkflowNode.CreateEnd("end", "End")
    };
    
    private List<WorkflowEdge> _edges = new()
    {
        WorkflowEdge.Create("start", "task1"),
        WorkflowEdge.Create("task1", "end")
    };
}
```

### State Management
```razor
<BwWorkflow @ref="_workflow" Nodes="_nodes" Edges="_edges" />

@code {
    private BwWorkflow? _workflow;
    
    async Task CompleteTask()
    {
        await _workflow.UpdateNodeStatusAsync("task1", WorkflowNodeStatus.Completed);
    }
}
```

## API

| Parameter | Type | Default | Description |
|---|---|---|---|
| `Nodes` | `List<WorkflowNode>` | `[]` | Workflow nodes |
| `Edges` | `List<WorkflowEdge>` | `[]` | Connections between nodes |
| `Height` | `string` | `400px` | Container height |
| `NodeWidth` | `int` | `160` | Node width |
| `NodeHeight` | `int` | `60` | Node height |
| `HorizontalSpacing` | `int` | `80` | Horizontal gap |
| `VerticalSpacing` | `int` | `60` | Vertical gap |
| `Direction` | `WorkflowDirection` | `Horizontal` | Flow direction |
| `ShowLabels` | `bool` | `true` | Show connection labels |
| `Interactive` | `bool` | `true` | Make nodes clickable |
| `OnNodeClick` | `EventCallback<WorkflowNode>` | - | Node click event |

## Node Types

- `start` - Start point (circle)
- `end` - End point (circle, bold)
- `task` - Task (rectangle)
- `decision` - Decision point (diamond)
- `parallel` - Parallel gateway
- `subprocess` - Sub-process

## Status Colors

| Status | Color |
|---|---|
| `Pending` | Gray |
| `Active` | Blue |
| `Completed` | Green |
| `Error` | Red |
| `Skipped` | Light Gray |

## Factory Methods

```csharp
// Start node
WorkflowNode.CreateStart("id", "Start")

// End node
WorkflowNode.CreateEnd("id", "End")

// Task node
WorkflowNode.CreateTask("id", "Process", WorkflowNodeStatus.Active)

// Decision node
WorkflowNode.CreateDecision("id", "Approve?")

// Edge
WorkflowEdge.Create("from", "to", "Yes")
```

## Methods

| Method | Signature | Description |
|---|---|---|
| `UpdateNodeStatusAsync` | `Task UpdateNodeStatusAsync(string nodeId, WorkflowNodeStatus status)` | Updates the status of a node |
