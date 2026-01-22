# Tour Service

`TourService` is a fully TypeScript-based service for creating step-by-step guided tours to introduce features of your application to users.
It replaces the component-based (`<BwTour>`) structure and works independently of the page structure.

## Usage

### 1. Inject the Service
Inject `TourService` into your page or component.

```razor
@inject TourService Tour
```

### 2. Define Steps and Start
Start the tour by calling the `StartTour` method. Specify target elements using `TargetSelector` (ID or Class).

```csharp
private async Task StartTour()
{
    var steps = new List<TourStep>
    {
        new() 
        { 
            TargetSelector = "#header-logo", 
            Title = "Welcome", 
            Content = "Welcome to Blazwind. Your logo is located here.", 
            Placement = "bottom" 
        },
        new() 
        { 
            TargetSelector = "#main-menu", 
            Title = "Navigation", 
            Content = "Use the menus to navigate between pages.", 
            Placement = "right" 
        },
        new() 
        { 
            TargetSelector = "#action-btn", 
            Title = "Take Action", 
            Content = "Click this button to complete the operation.", 
            Placement = "top" 
        }
    };

    await Tour.StartTour(steps, new TourOptions { SmoothScroll = true });
}
```

## API Reference

### TourStep
| Property | Type | Description |
|---|---|---|
| `TargetSelector` | `string` | **Required.** CSS selector of the target element (e.g. `#my-button`, `.card-header`). |
| `Title` | `string` | Step title (Optional). |
| `Content` | `string` | **Required.** Step description. |
| `Placement` | `string` | Tooltip placement: `top`, `bottom`, `left`, `right`. Default: `bottom`. |

### TourOptions
| Property | Type | Default | Description |
|---|---|---|---|
| `SmoothScroll` | `bool` | `true` | Whether to automatically scroll to the target. |
| `OverlayColor` | `string` | `rgba(0,0,0,0.5)` | Background dimming color. |
| `AllowInteraction` | `bool` | `true` | Whether the target (inside the spotlight) is clickable. |

## Methods

- `StartTour(List<TourStep> steps, TourOptions options)`: Starts the tour.
- `Next()`: Moves to the next step. (Usually invoked by UI buttons, but can be called programmatically).
- `Prev()`: Returns to the previous step.
- `End()`: Ends and clears the tour.
