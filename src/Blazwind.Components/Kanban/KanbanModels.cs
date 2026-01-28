using Blazwind.Components.Shared;
using Microsoft.AspNetCore.Components;

namespace Blazwind.Components.Kanban;

public class KanbanColumn
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string? Title { get; set; }
    public string? Icon { get; set; }
    public BwColor? Color { get; set; }
    public List<KanbanItem>? Items { get; set; }
    public RenderFragment? HeaderExtra { get; set; }

    /// <summary>
    ///     Max number of items allowed in column. If exceeded, visual warning is shown.
    /// </summary>
    public int? MaxItems { get; set; }

    /// <summary>
    ///     Whether the column is currently collapsed.
    /// </summary>
    public bool IsCollapsed { get; set; }
}

public class KanbanItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string? Title { get; set; }
    public string? Description { get; set; }
    public List<string>? Tags { get; set; }
    public KanbanAssignee? Assignee { get; set; }
    public DateTime? DueDate { get; set; }
    public int OrderIndex { get; set; }
    public object? Data { get; set; }
}

public class KanbanAssignee
{
    public string? Name { get; set; }
    public string? Avatar { get; set; }
}

public class KanbanMoveEvent
{
    public KanbanItem? Item { get; set; }
    public KanbanColumn? SourceColumn { get; set; }
    public KanbanColumn? TargetColumn { get; set; }
    public int NewIndex { get; set; }
}