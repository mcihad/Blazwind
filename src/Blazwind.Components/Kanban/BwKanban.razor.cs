using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace Blazwind.Components.Kanban;

public partial class BwKanban : BwBase
{
    private KanbanItem? _draggedItem;
    private KanbanColumn? _sourceColumn;
    private KanbanItem? _targetItem;

    [Parameter]
    public List<KanbanColumn> Columns { get; set; } = new();

    [Parameter]
    public RenderFragment<KanbanItem>? ItemTemplate { get; set; }

    [Parameter]
    public bool ShowAddButton { get; set; } = true;

    [Parameter]
    public EventCallback<KanbanMoveEvent> OnItemMoved { get; set; }

    [Parameter]
    public EventCallback<KanbanItem> OnItemClick { get; set; }

    [Parameter]
    public EventCallback<KanbanColumn> OnAddClick { get; set; }

    private void HandleDragStart(KanbanItem item, KanbanColumn column)
    {
        _draggedItem = item;
        _sourceColumn = column;
        _targetItem = null;
    }

    private void HandleDragOverColumn(DragEventArgs e)
    {
        // Allow drop
    }

    private void HandleDragEnterItem(KanbanItem item)
    {
        if (_draggedItem != null && _draggedItem != item) _targetItem = item;
    }

    private async Task HandleDrop(KanbanColumn targetColumn)
    {
        if (_draggedItem != null && _sourceColumn != null)
        {
            var movedItem = _draggedItem;
            var sourceCol = _sourceColumn;

            // Should not drop if reordering in same column and target is null (dropped on container but not item)
            // But if targetColumn != sourceColumn, we append.

            if (targetColumn == _sourceColumn && _targetItem == null)
            {
                // Dropped on same column without specific target -> do nothing (already there)
                // or append to end if it was somehow moved?
                _draggedItem = null;
                _sourceColumn = null;
                _targetItem = null;
                return;
            }

            _sourceColumn.Items?.Remove(_draggedItem);
            targetColumn.Items ??= new List<KanbanItem>();

            var newIndex = 0;
            if (_targetItem != null && targetColumn.Items.Contains(_targetItem))
            {
                newIndex = targetColumn.Items.IndexOf(_targetItem);
                targetColumn.Items.Insert(newIndex, _draggedItem);
            }
            else
            {
                targetColumn.Items.Add(_draggedItem);
                newIndex = targetColumn.Items.Count - 1;
            }

            // Update indices for all items in the target column
            for (var i = 0; i < targetColumn.Items.Count; i++) targetColumn.Items[i].OrderIndex = i;

            // Also update indices in source column if different
            if (sourceCol != targetColumn && sourceCol.Items != null)
                for (var i = 0; i < sourceCol.Items.Count; i++)
                    sourceCol.Items[i].OrderIndex = i;

            _draggedItem = null;
            _sourceColumn = null;
            _targetItem = null;

            StateHasChanged();

            await OnItemMoved.InvokeAsync(new KanbanMoveEvent
            {
                Item = movedItem,
                SourceColumn = sourceCol,
                TargetColumn = targetColumn,
                NewIndex = newIndex
            });
        }
        else
        {
            _draggedItem = null;
            _sourceColumn = null;
            _targetItem = null;
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