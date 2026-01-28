# Timeline

A component for visualizing a sequence of events or milestones in chronological order.

## Examples

### Basic Usage

```razor
<BwTimeline>
    <BwTimelineItem Title="Order Placed" Subtitle="Jan 1, 2024">
        Your order has been received.
    </BwTimelineItem>
    <BwTimelineItem Title="Processing" Subtitle="Jan 2, 2024" IsActive="true">
        Packet is being prepared.
    </BwTimelineItem>
    <BwTimelineItem Title="Delivered" Subtitle="Estimated Jan 5, 2024" Icon="fa-solid fa-truck">
        In transit.
    </BwTimelineItem>
</BwTimeline>
```

### Layouts

Customize the layout with `Alternate`, `Horizontal`, or `Reverse` parameters.

```razor
<BwTimeline Alternate="true">
    <!-- Items appear on left and right -->
</BwTimeline>
```

### Variants

Use `Variant` to change the visual style: `Filled` (default), `Ghost` (Minimal), `Outline` (Card style).

### Colors

Timeline items support standard colors via the `Color` parameter: `Success`, `Warning`, `Danger`, etc.

## API

### BwTimeline Parameters

| Parameter        | Type        | Default   | Description                                                 |
|:-----------------|:------------|:----------|:------------------------------------------------------------|
| `Variant`        | `BwVariant` | `Filled`  | Visual style: `Filled`, `Ghost`, `Outline`.                 |
| `Alternate`      | `bool`      | `false`   | Distributes items on alternating sides (Vertical only).     |
| `Horizontal`     | `bool`      | `false`   | Displays items horizontally.                                |
| `Reverse`        | `bool`      | `false`   | Reverses the direction of items.                            |
| `Size`           | `BwSize`    | `Medium`  | Size of the timeline dots.                                  |
| `ConnectorStyle` | `string`    | `"solid"` | Style of the connecting lines: `solid`, `dashed`, `dotted`. |

### BwTimelineItem Parameters

| Parameter         | Type             | Default   | Description                                                    |
|:------------------|:-----------------|:----------|:---------------------------------------------------------------|
| `Title`           | `string`         | `null`    | Main header text.                                              |
| `Subtitle`        | `string`         | `null`    | Sub-header or date text.                                       |
| `Icon`            | `string`         | `null`    | Custom icon class.                                             |
| `IconContent`     | `RenderFragment` | `null`    | Custom content for the marker dot.                             |
| `Color`           | `BwColor`        | `Primary` | Color theme for the item marker.                               |
| `IsCompleted`     | `bool`           | `false`   | Marks item as complete (usually shows a checkmark).            |
| `IsActive`        | `bool`           | `false`   | Highlights the item as currently active.                       |
| `OppositeContent` | `RenderFragment` | `null`    | Content to display on the opposite side (Alternate mode only). |
