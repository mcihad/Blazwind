# TreeNode

Data model representing a node in the [Tree](Tree/Docs/BwTree.md) component.

## Properties

| Property      | Type                    | Description                                                                      |
|:--------------|:------------------------|:---------------------------------------------------------------------------------|
| `Id`          | `string`                | Unique identifier (optional but recommended for API/Lazy loading).               |
| `Title`       | `string`                | Display text of the node.                                                        |
| `Icon`        | `string`                | FontAwesome icon class (e.g. `fa-solid fa-folder`).                              |
| `IsExpanded`  | `bool`                  | Whether the node is currently open.                                              |
| `IsChecked`   | `bool`                  | Selection state (for Checkbox/Radio).                                            |
| `IsSelected`  | `bool`                  | Highlight state (for Selectable mode).                                           |
| `IsDisabled`  | `bool`                  | Disables interaction.                                                            |
| `IsLeaf`      | `bool`                  | If true, node cannot have children (removes expand icon).                        |
| `HasChildren` | `bool`                  | Used for lazy loading to show expand icon even if `Children` is empty initially. |
| `Data`        | `TItem`                 | Generic data object attached to this node.                                       |
| `Children`    | `List<TreeNode<TItem>>` | List of child nodes.                                                             |
