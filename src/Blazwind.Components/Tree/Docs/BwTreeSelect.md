# TreeSelect

A dropdown component that displays a hierarchical tree structure for selection.

## Usage

```razor
<BwTreeSelect TItem="string" 
              Nodes="@nodes" 
              @bind-Value="selectedValue"
              Placeholder="Select a folder..." />
```

## Features

- **Searchable**: Includes built-in search.
- **Clearable**: Allows clearing the selection.
- **Multiple Selection**: Supports selecting multiple items (via `Multiple` param).
- **Checkbox Support**: Can use checkboxes for selection within the dropdown.

## API

### Parameters

| Parameter | Type | Default | Description |
|:---|:---|:---|:---|
| `Nodes` | `List<TreeNode<TItem>>` | `[]` | Tree data structure. |
| `Value` | `TItem` | `default` | Selected value (Single mode). |
| `SelectedValues` | `IEnumerable<TItem>` | `[]` | Selected values (Multiple mode). |
| `Multiple` | `bool` | `false` | Enables multiple selection. |
| `ShowCheckbox` | `bool` | `false` | Shows checkboxes in the tree. |
| `Placeholder` | `string` | `"Select..."` | Input placeholder text. |
| `Searchable` | `bool` | `true` | Enables search filtering. |
| `Clearable` | `bool` | `true` | Shows clear (X) button. |
| `DisplayProperty` | `Func<TItem, string>` | `null` | Function to get display text from custom data object. |
