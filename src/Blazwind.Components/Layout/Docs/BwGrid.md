# Grid

A powerful CSS Grid-based layout component supporting XAML/MAUI style `RowDefs` and `ColumnDefs` for proportional or
fixed layouts.

## Features

- **XAML-Style Definitions**: Use `*`, `Auto`, and fixed units (px, %) to define your grid structure.
- **2D Control**: Precisely place items in specific rows and columns using `BwGridItem`.
- **Proportional Spacing**: Integrated `BwSpacing` enum support for gaps.
- **Auto-Fill Mode**: Easily create responsive grids without manual definitions using `MinItemWidth`.

## Usage

### Simple Proportional Grid (1:2:1)

```razor
@using Blazwind.Components.Layout

<BwGrid ColumnDefs="*,2*,*" Gap="BwSpacing.Md">
    <div class="bg-blue-100 p-4">Sidebar (*)</div>
    <div class="bg-blue-200 p-4">Main Content (2*)</div>
    <div class="bg-blue-100 p-4">Panel (*)</div>
</BwGrid>
```

### Definition Syntax Reference

| Syntax  | CSS Translation | Description                                 |
|:--------|:----------------|:--------------------------------------------|
| `*`     | `1fr`           | 1 unit of available flexible space.         |
| `2*`    | `2fr`           | 2 units of available flexible space.        |
| `Auto`  | `auto`          | Sized based on the content of the children. |
| `200px` | `200px`         | Fixed pixel width/height.                   |
| `10%`   | `10%`           | Percentage of the parent container.         |

### Advanced 2D Layout

Use `BwGridItem` to span multiple rows or columns.

```razor
<BwGrid RowDefs="Auto,*,Auto" ColumnDefs="*,3*,*" Gap="BwSpacing.Sm">
    @* Spans 3 columns in the first row *@
    <BwGridItem Row="0" Column="0" ColumnSpan="3">Header</BwGridItem>
    
    <BwGridItem Row="1" Column="0">Sidebar</BwGridItem>
    <BwGridItem Row="1" Column="1">Main Content</BwGridItem>
    <BwGridItem Row="1" Column="2">Right Menu</BwGridItem>
    
    @* Spans 3 columns in the last row *@
    <BwGridItem Row="2" Column="0" ColumnSpan="3">Footer</BwGridItem>
</BwGrid>
```

## Parameters

### BwGrid

| Parameter       | Type         | Default   | Description                                                             |
|:----------------|:-------------|:----------|:------------------------------------------------------------------------|
| `RowDefs`       | `string?`    | `null`    | Comma-separated row definitions (e.g., "Auto,*,Auto").                  |
| `ColumnDefs`    | `string?`    | `null`    | Comma-separated column definitions (e.g., "*,2*,100px").                |
| `Columns`       | `int?`       | `null`    | Shortcut for fixed equal-width columns. Ignored if `ColumnDefs` is set. |
| `MinItemWidth`  | `string`     | `"250px"` | Minimum width for auto-fill behavior when no definitions are provided.  |
| `Gap`           | `BwSpacing`  | `Md`      | Standard gap between items.                                             |
| `ColumnSpacing` | `BwSpacing?` | `null`    | Overrides horizontal gap (gap-x).                                       |
| `RowSpacing`    | `BwSpacing?` | `null`    | Overrides vertical gap (gap-y).                                         |
| `Class`         | `string?`    | `null`    | Custom CSS classes.                                                     |
| `Style`         | `string?`    | `null`    | Custom inline CSS styles.                                               |

### BwGridItem

| Parameter    | Type      | Default | Description                               |
|:-------------|:----------|:--------|:------------------------------------------|
| `Row`        | `int`     | `0`     | Starting row index (0-based).             |
| `Column`     | `int`     | `0`     | Starting column index (0-based).          |
| `RowSpan`    | `int`     | `1`     | Number of rows the item should bridge.    |
| `ColumnSpan` | `int`     | `1`     | Number of columns the item should bridge. |
| `Class`      | `string?` | `null`  | Custom CSS classes.                       |
| `Style`      | `string?` | `null`  | Custom inline CSS styles.                 |
