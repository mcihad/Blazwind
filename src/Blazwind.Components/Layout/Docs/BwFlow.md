# Flow

A flexbox-based flow layout component that supports wrapping, scrolling, responsive item counts, and arrow-based
navigation.

## Usage

### Wrapped Flow

Items will automatically flow to the next line when space is insufficient.

```razor
@using Blazwind.Components.Layout

<BwFlow Wrap="true" Gap="BwSpacing.Sm">
    @for (int i = 1; i <= 10; i++)
    {
        <div class="p-4 bg-blue-100">Item @i</div>
    }
</BwFlow>
```

### Proportional Grid

Specify how many items should appear per row.

```razor
<BwFlow ItemsPerRow="4" Gap="BwSpacing.Md">
    <BwFlowItem>Quarter 1</BwFlowItem>
    <BwFlowItem>Quarter 2</BwFlowItem>
    <BwFlowItem>Quarter 3</BwFlowItem>
    <BwFlowItem>Quarter 4</BwFlowItem>
</BwFlow>
```

### Horizontal Carousel

Disable wrapping and enable arrows for a scrollable horizontal flow.

```razor
<BwFlow Wrap="false" ShowArrows="true" Overflow="BwOverflow.ScrollX">
    <BwFlowItem Width="300px">Wide Item 1</BwFlowItem>
    <BwFlowItem Width="300px">Wide Item 2</BwFlowItem>
    <BwFlowItem Width="300px">Wide Item 3</BwFlowItem>
</BwFlow>
```

## Parameters

### BwFlow

| Parameter            | Type                   | Default   | Description                                                               |
|:---------------------|:-----------------------|:----------|:--------------------------------------------------------------------------|
| `Direction`          | `BwFlexDirection`      | `Row`     | Flow direction (`Row`, `RowReverse`, `Column`, `ColumnReverse`).          |
| `Wrap`               | `bool`                 | `true`    | Whether items should wrap to the next line.                               |
| `WrapReverse`        | `bool`                 | `false`   | Reverse the wrap direction.                                               |
| `Overflow`           | `BwOverflow`           | `ScrollX` | Behavior when `Wrap` is false (`Hidden`, `Scroll`, `ScrollX`, `ScrollY`). |
| `ShowArrows`         | `bool`                 | `false`   | Displays navigation buttons for horizontal scrolling.                     |
| `ItemsPerRow`        | `int?`                 | `null`    | Base number of items per row (mobile).                                    |
| `ItemsPerRowSm`      | `int?`                 | `null`    | Items per row for `sm` breakpoint.                                        |
| `ItemsPerRowMd`      | `int?`                 | `null`    | Items per row for `md` breakpoint.                                        |
| `ItemsPerRowLg`      | `int?`                 | `null`    | Items per row for `lg` breakpoint.                                        |
| `ItemWidth`          | `string?`              | `null`    | Fixed width for all items (e.g., `"120px"`). Overrides `ItemsPerRow`.     |
| `MaxHeight`          | `string?`              | `null`    | Useful for vertical scroll areas (e.g., `"400px"`).                       |
| `Gap`                | `BwSpacing`            | `Md`      | Spacing between items.                                                    |
| `MainAxisAlignment`  | `BwMainAxisAlignment`  | `Start`   | Horizontal alignment of items.                                            |
| `CrossAxisAlignment` | `BwCrossAxisAlignment` | `Stretch` | Vertical alignment of items.                                              |

### BwFlowItem

| Parameter | Type            | Default | Description                      |
|:----------|:----------------|:--------|:---------------------------------|
| `Width`   | `string?`       | `null`  | Individual item width override.  |
| `Height`  | `string?`       | `null`  | Individual item height override. |
| `Grow`    | `int`           | `0`     | Flex grow factor.                |
| `Shrink`  | `int`           | `0`     | Flex shrink factor.              |
| `OnClick` | `EventCallback` | -       | Fired when the item is clicked.  |
