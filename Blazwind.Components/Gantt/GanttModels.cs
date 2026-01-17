namespace Blazwind.Components.Gantt;

/// <summary>
/// Gantt task status
/// </summary>
public enum GanttTaskStatus
{
    Pending,
    InProgress,
    Completed,
    Delayed,
    Cancelled
}

/// <summary>
/// Gantt view mode
/// </summary>
public enum GanttViewMode
{
    Day,
    Week,
    Month
}

/// <summary>
/// Represents a Gantt task
/// </summary>
public class GanttTask
{
    /// <summary>
    /// Unique identifier
    /// </summary>
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// Task title
    /// </summary>
    public string Title { get; set; } = "";

    /// <summary>
    /// Task description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Start date
    /// </summary>
    public DateTime StartDate { get; set; }

    /// <summary>
    /// End date
    /// </summary>
    public DateTime EndDate { get; set; }

    /// <summary>
    /// Progress percentage (0-100)
    /// </summary>
    public int Progress { get; set; }

    /// <summary>
    /// Task status
    /// </summary>
    public GanttTaskStatus Status { get; set; } = GanttTaskStatus.Pending;

    /// <summary>
    /// Parent task ID for subtasks
    /// </summary>
    public string? ParentId { get; set; }

    /// <summary>
    /// Task dependencies (IDs of tasks that must complete first)
    /// </summary>
    public List<string> Dependencies { get; set; } = new();

    /// <summary>
    /// Assigned person name
    /// </summary>
    public string? AssigneeName { get; set; }

    /// <summary>
    /// Assigned person avatar
    /// </summary>
    public string? AssigneeAvatar { get; set; }

    /// <summary>
    /// Task color (hex)
    /// </summary>
    public string? Color { get; set; }

    /// <summary>
    /// Whether this is a milestone (single date)
    /// </summary>
    public bool IsMilestone { get; set; }

    /// <summary>
    /// Child tasks
    /// </summary>
    public List<GanttTask> Children { get; set; } = new();

    /// <summary>
    /// Duration in days
    /// </summary>
    public int DurationDays => (EndDate - StartDate).Days + 1;
}

/// <summary>
/// Event arguments for task resize
/// </summary>
public class GanttTaskResizeEventArgs
{
    public GanttTask Task { get; set; } = null!;
    public DateTime OldStartDate { get; set; }
    public DateTime OldEndDate { get; set; }
    public DateTime NewStartDate { get; set; }
    public DateTime NewEndDate { get; set; }
}

/// <summary>
/// Event arguments for task drag (move)
/// </summary>
public class GanttTaskDragEventArgs
{
    public GanttTask Task { get; set; } = null!;
    public DateTime OldStartDate { get; set; }
    public DateTime OldEndDate { get; set; }
    public DateTime NewStartDate { get; set; }
    public DateTime NewEndDate { get; set; }
    public int DaysMoved { get; set; }
}