# BwGantt

A sophisticated project and task management component. It provides a visual timeline with support for sub-tasks, progress tracking, milestones, and real-time interactive editing.

## Features

- ✅ **Multiple View Modes:** Toggle between `Day`, `Week` (default), and `Month` views.
- ✅ **Progress Tracking:** Visual progress bars within task rows.
- ✅ **Milestones:** Mark critical project dates with diamond indicators.
- ✅ **Parent-Child Tasks:** Support for nested task structures and folder-style headers.
- ✅ **Interactive Editing:** Enable `Editable` mode to move tasks or resize durations directly on the timeline.
- ✅ **Theming:** Customize task colors and display assignee avatars.
- ✅ **Auto-Timeline:** Automatically calculates the start and end dates based on the task list if not explicitly provided.

## Usage

### Simple Project Plan
```razor
<BwGantt Tasks="_tasks" 
         Title="Initial Research"
         Height="300px"
         ViewMode="GanttViewMode.Week" />

@code {
    private List<GanttTask> _tasks = new()
    {
        new()
        {
            Title = "Market Analysis",
            StartDate = DateTime.Today,
            EndDate = DateTime.Today.AddDays(10),
            Progress = 40,
            Color = "#3b82f6"
        }
    };
}
```

### Interactive Editable Mode
```razor
<BwGantt Tasks="_tasks" 
         Editable="true"
         OnTaskDrag="HandleTaskDrag"
         OnTaskResize="HandleTaskResize" />

@code {
    private void HandleTaskDrag(GanttTaskDragEventArgs args)
    {
        Console.WriteLine($"{args.Task.Title} moved by {args.DaysMoved} days");
    }
}
```

### Persistent View Mode
Use `@bind-ViewMode` to persist the user's selected view mode. This is useful when multiple Gantt charts are on the same page and each should maintain its own view mode independently.

```razor
<BwGantt Tasks="_projectTasks" 
         @bind-ViewMode="_currentViewMode"
         Title="Project Timeline"
         Height="350px"
         Editable="true"
         OnTaskClick="HandleTaskClick" />

@code {
    private GanttViewMode _currentViewMode = GanttViewMode.Week;
    
    private async Task HandleTaskClick(GanttTask task)
    {
        Console.WriteLine($"{task.Title} selected");
        // View mode is automatically preserved when tasks are clicked
    }
}
```

The view mode will be preserved even when tasks are dragged, resized, or clicked. Each Gantt instance maintains its own state independently.

## API Reference

### BwGantt Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Tasks` | `List<GanttTask>` | - | The list of project tasks. |
| `Title` | `string` | `"Proje Planı"` | Header label for the component. |
| `Height` | `string` | `"400px"` | Vertical scroll height of the main content. |
| `ViewMode`| `GanttViewMode` | `Week` | Display scale (`Day`, `Week`, `Month`). Use `@bind-ViewMode` for two-way binding. |
| `ViewModeChanged`| `EventCallback<GanttViewMode>` | - | Triggered when the view mode is changed by the user. |
| `Editable`| `bool` | `false` | Enables drag-and-drop and resizing of task bars. |
| `StartDate`| `DateTime?` | `null` | Manual timeline start. If null, calculated from tasks. |
| `EndDate` | `DateTime?` | `null` | Manual timeline end. If null, calculated from tasks. |
| `OnTaskClick`| `EventCallback<GanttTask>`| - | Triggered when a task row or bar is clicked. |
| `OnTaskDrag` | `EventCallback<GanttTaskDragEventArgs>`| - | Triggered after moving a task bar. |
| `OnTaskResize`| `EventCallback<GanttTaskResizeEventArgs>`| - | Triggered after resizing a task bar. |

### Task List Panel Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `ShowTaskList` | `bool` | `true` | Show/hide the task list panel on the left. |
| `TaskListWidth` | `int` | `256` | Width of the task list panel in pixels. |
| `TaskListResizable` | `bool` | `true` | Allow resizing the task list panel by dragging. |
| `TaskItemTemplate` | `RenderFragment<GanttTask>?` | `null` | Custom template for task list items. |
| `ShowBarLabels` | `bool` | `false` | Show task titles on timeline bars. |
| `OnTaskListVisibilityChanged` | `EventCallback<bool>` | - | Fired when task list is toggled. |
| `OnTaskListWidthChanged` | `EventCallback<int>` | - | Fired after panel resize. |

### Example: Custom Task Template

```razor
<BwGantt Tasks="_tasks" ShowTaskList="true" TaskListResizable="true">
    <TaskItemTemplate>
        <div class="flex items-center gap-2">
            <span class="text-xs">@context.Title</span>
            <span class="badge">@context.Progress%</span>
        </div>
    </TaskItemTemplate>
</BwGantt>
```

### Example: Bar Labels

```razor
<BwGantt Tasks="_tasks" ShowBarLabels="true" />
```

## Data Models

### GanttTask Properties

| Property | Type | Description |
|----------|------|-------------|
| `Id` | `string` | Unique identifier (GUID by default). |
| `Title` | `string` | Task label shown in the list and tooltip. |
| `StartDate`| `DateTime` | Physical start of the task. |
| `EndDate` | `DateTime` | Physical end of the task. |
| `Progress` | `int` | Completion percentage (0-100). |
| `Status` | `GanttTaskStatus` | Workflow state (InProgress, Completed, etc.). |
| `ParentId` | `string?` | Used for grouping subtasks. |
| `AssigneeName`| `string?` | Name for the avatar tooltip. |
| `AssigneeAvatar`| `string?` | Image URL for the assignee avatar. |
| `Color` | `string?` | Custom Hex color for the task bar. |
| `IsMilestone`| `bool` | If true, renders as a diamond (single date). |
| `Children` | `List<GanttTask>` | Nested subtasks. |

## View & Status Values

### GanttViewMode
- `Day`: High-detail daily view.
- `Week`: Standard weekly summary.
- `Month`: High-level monthly overview.

### GanttTaskStatus
- `Pending`, `InProgress`, `Completed`, `Delayed`, `Cancelled`.

## Technical Details
- **Unified Scrolling:** The left task list and right timeline are synchronized vertically.
- **Auto-Flip Tooltips:** Task details appear on hover and adapt to available space.
- **JS Interop:** Real-time drag/resize handling uses a lightweight TypeScript bridge for performance.
