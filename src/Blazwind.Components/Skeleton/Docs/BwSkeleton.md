# Skeleton

A placeholder component used to represent the layout of content while it's still loading. It helps reduce perceived
loading time by providing immediate visual feedback.

## Examples

### Basic Shapes

```razor
<!-- Circle (for avatars) -->
<BwSkeleton Shape="BwSkeletonShape.Circle" Width="50px" Height="50px" />

<!-- Rectangle (for images/cards) -->
<BwSkeleton Shape="BwSkeletonShape.Rectangle" Width="200px" Height="100px" />
```

### Text and Paragraphs

```razor
<!-- Single text line -->
<BwSkeleton Shape="BwSkeletonShape.Text" Width="80%" />

<!-- Multiple lines (paragraph simulation) -->
<BwSkeleton Lines="3" />
```

### Card Layout Example

```razor
<div class="border p-4 rounded-lg flex items-center gap-4">
    <BwSkeleton Shape="BwSkeletonShape.Circle" Width="48px" Height="48px" />
    <div class="flex-1">
        <BwSkeleton Shape="BwSkeletonShape.Text" Width="50%" Class="mb-2" />
        <BwSkeleton Shape="BwSkeletonShape.Text" Width="30%" />
    </div>
</div>
```

## API - BwSkeleton

### Parameters

| Parameter | Type              | Default     | Description                                                                          |
|:----------|:------------------|:------------|:-------------------------------------------------------------------------------------|
| `Shape`   | `BwSkeletonShape` | `Rectangle` | The geometric shape of the skeleton (`Rectangle`, `Circle`, `Text`).                 |
| `Width`   | `string?`         | `"100%"`    | CSS width of the skeleton (e.g., `200px`, `50%`).                                    |
| `Height`  | `string?`         | -           | CSS height of the skeleton. Defaults to `100px` for rectangles or `1rem` for text.   |
| `Lines`   | `int`             | `1`         | Number of text lines to generate. If > 1, it automatically creates a stacked layout. |
| `Class`   | `string?`         | `null`      | Additional CSS class for the skeleton element.                                       |

## Enums

### BwSkeletonShape

`Rectangle`, `Circle`, `Text`

## Features

- ✅ **Animated**: Includes a subtle pulse animation to indicate activity.
- ✅ **Themed**: Adapts to light and dark theme colors.
- ✅ **Flexible**: Can be combined to create complex page structures.
- ✅ **Responsive**: Supports percentage widths for fluid layouts.
