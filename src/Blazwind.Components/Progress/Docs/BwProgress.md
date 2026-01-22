# Progress

A visual indicator used to show the completion status of a task or a process. Supports multiple colors, sizes, and interactive styling like stripes and animations.

## Examples

### Basic Usage
```razor
<BwProgress Value="45" Max="100" Color="BwColor.Primary" />
```

### Variants and Effects
```razor
<BwProgress Value="75" 
            Color="BwColor.Success" 
            Striped="true" 
            Animated="true" 
            ShowLabel="true" 
            Size="BwSize.Large" />
```

### Custom Label Format
```razor
<BwProgress Value="85" 
            ShowLabel="true" 
            LabelFormat="{0} / 100 Completed" 
            Color="BwColor.Info" />
```

## API - BwProgress

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Value` | `double` | `0` | Current progress value. |
| `Max` | `double` | `100` | Maximum value representing 100% completion. |
| `Color` | `BwColor` | `Primary` | Theme color (`Primary`, `Success`, `Warning`, `Danger`, `Info`, `Gray`). |
| `Size` | `BwSize` | `Medium` | Height of the bar (`Small`: 8px, `Medium`: 16px, `Large`: 24px). |
| `ShowLabel` | `bool` | `false` | Whether to show progress text inside the bar. |
| `LabelFormat` | `string?` | `null` | Custom string format for labels (e.g., `"{0}% done"`). `{0}` is replaced by the percentage. |
| `Striped` | `bool` | `false` | Applies a diagonal striped pattern to the bar. |
| `Animated` | `bool` | `false` | Animates the stripes from right to left (Requires `Striped`). |
| `Class` | `string?` | `null` | Additional CSS class for the container. |
| `Style` | `string?` | `null` | Additional CSS styles for the container. |

## Features

- ✅ **Responsive**: Automatically fills the width of its container.
- ✅ **Accessible**: Includes standard ARIA attributes (`progressbar`, `aria-valuenow`, etc.).
- ✅ **Dynamic Colors**: Integrated with Blazwind's design system colors.
- ✅ **Smooth Transitions**: Value changes are animated with CSS transitions.
