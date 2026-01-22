# Tree

A tree view component for hierarchical data structures with unlimited depth.

## Usage

```razor
<BwTree TItem="string" Nodes="@nodes" />

@code {
    private List<TreeNode<string>> nodes = new()
    {
        new TreeNode<string>
        {
            Title = "Documents",
            IsExpanded = true,
            Children = new()
            {
                new TreeNode<string> { Title = "Report.pdf" },
                new TreeNode<string> { Title = "Preso.pptx" }
            }
        }
    };
}
```

## Features

### Search
```razor
<BwTree TItem="string" Nodes="@nodes" ShowSearch="true" ShowToolbar="true" />
```

### Selection Modes
```razor
@* Checkbox (Multiple) *@
<BwTree TItem="string" Nodes="@nodes" SelectionMode="BwSelectionMode.Multiple" @bind-SelectedNodes="selected" />

@* Radio (Single) *@
<BwTree TItem="string" Nodes="@nodes" SelectionMode="BwSelectionMode.Single" @bind-SelectedNodes="selected" />

@* Cascade Selection (Parent -> Children) *@
<BwTree TItem="string" Nodes="@nodes" SelectionMode="BwSelectionMode.Multiple" CascadeSelection="true" />
```

### Row Selection (Selectable)
```razor
<BwTree TItem="string" Nodes="@nodes" Selectable="true" @bind-ClickedNode="clickedNode" />
```

### Table Mode
```razor
<BwTree TItem="FileItem" Nodes="@nodes" ShowTableMode="true">
    <ColumnsTemplate>
        <span>@context.Data?.Size</span>
        <span>@context.Data?.Modified</span>
    </ColumnsTemplate>
</BwTree>
```

### Lazy Loading
```razor
<BwTree TItem="string" 
        Nodes="@lazyNodes" 
        OnLoadChildren="LoadChildrenAsync" />

@code {
    private List<TreeNode<string>> lazyNodes = new()
    {
        new TreeNode<string> { Id = "dept-1", Title = "IT Dept", HasChildren = true },
        new TreeNode<string> { Id = "dept-2", Title = "HR Dept", HasChildren = true }
    };

    async Task<List<TreeNode<string>>> LoadChildrenAsync(TreeNode<string> parent)
    {
        var children = await _api.GetChildrenAsync(parent.Id);
        return children;
    }
}
```

### Show Child Count
```razor
<BwTree TItem="string" Nodes="@nodes" ShowChildCount="true" />
```
Shows the number of children in parentheses next to each node: `(3)`

## Parameters

| Parameter | Type | Default | Description |
|:---|:---|:---|:---|
| `Nodes` | `List<TreeNode<TItem>>` | `[]` | List of root nodes. |
| `SelectionMode` | `BwSelectionMode` | `None` | Selection mode (`None`, `Single`, `Multiple`). |
| `Selectable` | `bool` | `false` | Enables row clicking/selection. |
| `CascadeSelection` | `bool` | `false` | Selecting parent selects all children. |
| `Draggable` | `bool` | `false` | Enables drag-and-drop. |
| `ShowSearch` | `bool` | `false` | Shows the search bar. |
| `ShowToolbar` | `bool` | `false` | Shows toolbar (Expand/Collapse All). |
| `ShowTableMode` | `bool` | `false` | Enables table-like display mode. |
| `ShowChildCount` | `bool` | `false` | Shows child count next to node. |
| `OnLoadChildren` | `Func` | `null` | Callback for lazy loading. |
| `NodeTemplate` | `RenderFragment` | `null` | Custom template for nodes. |
| `ColumnsTemplate` | `RenderFragment` | `null` | Template for additional columns (Table mode). |

## Events

| Event | Description |
|:---|:---|
| `OnNodeClick` | Triggered when a node is clicked. |
| `OnNodeExpand` | Triggered when a node is expanded (used for lazy loading). |
| `SelectedNodesChanged` | Triggered when selection changes. |
| `ClickedNodeChanged` | Triggered when the clicked node changes (Selectable mode). |
