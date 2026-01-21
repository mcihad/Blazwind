using Blazwind.Components.Shared;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace Blazwind.Components.Kanban;

public partial class BwKanban : BwBase
{
    [Parameter] public List<KanbanColumn> Columns { get; set; } = new();
    [Parameter] public RenderFragment<KanbanItem>? ItemTemplate { get; set; }
    [Parameter] public bool ShowAddButton { get; set; } = true;

    [Parameter] public EventCallback<KanbanMoveEvent> OnItemMoved { get; set; }
    [Parameter] public EventCallback<KanbanItem> OnItemClick { get; set; }
    [Parameter] public EventCallback<KanbanColumn> OnAddClick { get; set; }

    private KanbanItem? _draggedItem;
    private KanbanColumn? _sourceColumn;

    private void HandleDragStart(KanbanItem item, KanbanColumn column)
    {
        _draggedItem = item;
        _sourceColumn = column;
    }

    private void HandleDragOverColumn(DragEventArgs e)
    {
        // Allow drop - this enables dropping anywhere in the column
    }

    private async Task HandleDrop(KanbanColumn targetColumn)
    {
        if (_draggedItem != null && _sourceColumn != null && _sourceColumn != targetColumn)
        {
            var movedItem = _draggedItem;
            var sourceCol = _sourceColumn;

            _sourceColumn.Items?.Remove(_draggedItem);
            targetColumn.Items ??= new List<KanbanItem>();
            targetColumn.Items.Add(_draggedItem);

            _draggedItem = null;
            _sourceColumn = null;

            StateHasChanged();

            await OnItemMoved.InvokeAsync(new KanbanMoveEvent
            {
                Item = movedItem,
                SourceColumn = sourceCol,
                TargetColumn = targetColumn
            });
        }
        else
        {
            _draggedItem = null;
            _sourceColumn = null;
        }
    }

    private async Task HandleItemClick(KanbanItem item)
    {
        await OnItemClick.InvokeAsync(item);
    }

    private async Task HandleAddClick(KanbanColumn column)
    {
        await OnAddClick.InvokeAsync(column);
    }
}
