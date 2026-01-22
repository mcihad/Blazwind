# Workflow

A BPMN-style workflow visualization component with interactive pan/zoom, custom icons, and modern visuals.

## Examples

### Basic Usage
```razor
<BwWorkflow Nodes="_nodes" Edges="_edges" Height="300px" />

@code {
    private List<WorkflowNode> _nodes = new()
    {
        WorkflowNode.CreateStart("start", "Start"),
        new WorkflowNode { Id = "task1", Type = "task", Label = "Task 1", Status = "active", Icon = "fa-solid fa-user" },
        WorkflowNode.CreateEnd("end", "End")
    };
    
    private List<WorkflowEdge> _edges = new()
    {
        WorkflowEdge.Create("start", "task1"),
        WorkflowEdge.Create("task1", "end")
    };
}
```

### Zoom & Fit to Screen
By default, the workflow will fit to the screen on load. You can disable this or control it programmatically.

```razor
<BwWorkflow @ref="_workflow" Nodes="_nodes" Edges="_edges" FitToScreen="true" />
<button @onclick="() => _workflow.ZoomInAsync()">Zoom In</button>
<button @onclick="() => _workflow.FitToScreenAsync()">Fit</button>
```

## API

| Parameter | Type | Default | Description |
|---|---|---|---|
| `Nodes` | `List<WorkflowNode>` | `[]` | Workflow nodes |
| `Edges` | `List<WorkflowEdge>` | `[]` | Connections between nodes |
| `Height` | `string` | `400px` | Container height |
| `NodeWidth` | `int` | `180` | Node width |
| `NodeHeight` | `int` | `70` | Node height |
| `HorizontalSpacing` | `int` | `100` | Horizontal gap |
| `VerticalSpacing` | `int` | `80` | Vertical gap |
| `Direction` | `WorkflowDirection` | `Horizontal` | Flow direction |
| `ShowLabels` | `bool` | `true` | Show connection labels |
| `Interactive` | `bool` | `true` | Make nodes clickable |
| `FitToScreen` | `bool` | `true` | Auto-fit diagram on load |
| `OnNodeClick` | `EventCallback<WorkflowNode>` | - | Node click event |

## Node Types

- `start` - Start point (circle)
- `end` - End point (circle, bold)
- `task` - Task (rounded rectangle)
- `decision` - Decision point (diamond)
- `parallel` - Parallel gateway (icon)
- `subprocess` - Sub-process (icon)

## Status Colors (Glassmorphism)

| Status | Details |
|---|---|
| `Pending` | Neutral gray, ghost style |
| `Active` | Blue gradient, glowing effect, animated edge |
| `Completed` | Green gradient, success style |
| `Error` | Red gradient, error style |
| `Skipped` | Light gray, dimmed |

## Factory Methods

```csharp
// Start node
WorkflowNode.CreateStart("id", "Start")

// End node
WorkflowNode.CreateEnd("id", "End")

// Task node with Icon
new WorkflowNode { 
    Id = "task1", 
    Type = "task", 
    Label = "User Task", 
    Icon = "fa-solid fa-user",
    Status = "active"
}

// Decision node
WorkflowNode.CreateDecision("id", "Approve?")

// Edge with label
WorkflowEdge.Create("from", "to", "Yes")
```

## Methods

| Method | Signature | Description |
|---|---|---|
| `UpdateNodeStatusAsync` | `Task UpdateNodeStatusAsync(string nodeId, WorkflowNodeStatus status)` | Updates the status of a node |
| `ZoomInAsync` | `Task ZoomInAsync()` | Zooms in |
| `ZoomOutAsync` | `Task ZoomOutAsync()` | Zooms out |
| `FitToScreenAsync` | `Task FitToScreenAsync()` | Fits diagram to container |
| `ExportPngAsync` | `Task ExportPngAsync()` | Exports workflow as PNG image |
| `ToggleFullscreenAsync` | `Task ToggleFullscreenAsync()` | Toggles fullscreen mode |

## Events

| Event | Type | Description |
|---|---|---|
| `OnNodeClick` | `EventCallback<NodeClickedEventArgs>` | Fired when a node is clicked |
| `OnNodeDragEnd` | `EventCallback<NodeDragEndEventArgs>` | Fired after a node is dragged |

## Node Types (Interfaces)

Use the typed node classes for better type safety:

```csharp
// Using typed nodes
List<IWorkflowNode> _nodes = new()
{
    new StartNode("start", "Start"),
    new TaskNode("task1", "User Review", "fa-solid fa-user") { Status = WorkflowNodeStatus.Active },
    new DecisionNode("decision1", "Approved?"),
    new EndNode("end", "Complete")
};

List<IWorkflowEdge> _edges = new()
{
    new WorkflowEdge("start", "task1"),
    new WorkflowEdge("task1", "decision1"),
    new WorkflowEdge("decision1", "end", "Yes")
};
```

