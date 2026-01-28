# OrgChart

An organization chart visualization component, designed for hierarchical structures like corporate organization or
departmental trees.

## Examples

### Basic Usage

```razor
<BwOrgChart Data="_orgData" Height="500px" OnNodeClick="HandleClick" />

@code {
    private OrgChartNode _orgData = new()
    {
        Id = "ceo",
        Name = "John Doe",
        Title = "CEO",
        Children = new List<OrgChartNode>
        {
            new() { Id = "cfo", Name = "Jane Smith", Title = "CFO" },
            new() { Id = "cto", Name = "Bob Wilson", Title = "CTO" }
        }
    };
}
```

## API - BwOrgChart

### Parameters

| Parameter           | Type            | Default | Description                                   |
|:--------------------|:----------------|:--------|:----------------------------------------------|
| `Data`              | `OrgChartNode?` | `null`  | Root node of the hierarchy.                   |
| `Height`            | `string`        | `500px` | CSS height for the chart container.           |
| `NodeWidth`         | `int`           | `180`   | Width of each node in pixels.                 |
| `NodeHeight`        | `int`           | `80`    | Height of each node in pixels.                |
| `HorizontalSpacing` | `int`           | `20`    | Spacing between peer nodes.                   |
| `VerticalSpacing`   | `int`           | `40`    | Spacing between hierarchy levels.             |
| `Expandable`        | `bool`          | `true`  | Enables collapse/expand interaction on nodes. |
| `Class`             | `string?`       | `null`  | Additional CSS class for container.           |
| `Style`             | `string?`       | `null`  | Additional CSS styles for container.          |

### Events

| Event         | Argument Type  | Description                   |
|:--------------|:---------------|:------------------------------|
| `OnNodeClick` | `OrgChartNode` | Fired when a node is clicked. |

### Methods

| Method               | Signature                           | Description                                               |
|:---------------------|:------------------------------------|:----------------------------------------------------------|
| `ExpandAllAsync`     | `Task ExpandAllAsync()`             | Expands every node in the tree.                           |
| `CollapseAllAsync`   | `Task CollapseAllAsync()`           | Collapses every node in the tree.                         |
| `ExpandNodeAsync`    | `Task ExpandNodeAsync(string id)`   | Expands a specific node by ID.                            |
| `CollapseNodeAsync`  | `Task CollapseNodeAsync(string id)` | Collapses a specific node by ID.                          |
| `UpdateOptionsAsync` | `Task UpdateOptionsAsync()`         | Pushes spacing/sizing parameter changes to the JS engine. |

## OrgChartNode Model

| Property      | Type                          | Description                             |
|:--------------|:------------------------------|:----------------------------------------|
| `Id`          | `string`                      | Unique identifier.                      |
| `Name`        | `string`                      | Display name (bold).                    |
| `Title`       | `string?`                     | Job title or role.                      |
| `Avatar`      | `string?`                     | URL for the user avatar image.          |
| `Department`  | `string?`                     | Department text.                        |
| `Email`       | `string?`                     | Email address.                          |
| `Phone`       | `string?`                     | Phone number.                           |
| `Color`       | `string?`                     | Hex color code for the node background. |
| `BorderColor` | `string?`                     | Hex color code for the node border.     |
| `Children`    | `List<OrgChartNode>?`         | Child nodes.                            |
| `Metadata`    | `Dictionary<string, object>?` | Additional custom data.                 |
