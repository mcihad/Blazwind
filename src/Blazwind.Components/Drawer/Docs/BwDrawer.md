# BwDrawer

A sliding side panel component that can emerge from any of the four sides of the viewport. It is ideal for navigation
menus, advanced filters, and detailed record forms.

## Features

- ✅ **4-Way Positioning**: Opens from `Left`, `Right`, `Top`, or `Bottom`.
- ✅ **Service-Driven**: Open drawers programmatically from C# using `DrawerService`.
- ✅ **Resizable**: Support for dragging edges to adjust panel width/height.
- ✅ **Preset & Custom Sizes**: Choose from standard sizes (`Small` to `Full`) or provide specific pixel values.
- ✅ **Data Exchange**: Return results from within a drawer to the originating component.

## Setup

The `DrawerService` is included automatically when registering Blazwind:

```csharp
builder.Services.AddBlazwind();
```

Ensure the container is present in your `MainLayout.razor`:

```razor
<BwDrawerContainer />
```

## Usage

### Programmatic Navigation Menu

```csharp
@inject DrawerService DrawerService

private async Task OpenNav()
{
    var options = new DrawerOptions { Position = BwDirection.Left, Size = BwSize.Small };
    await DrawerService.ShowAsync<MyNavMenu>("Main Menu", null, options);
}
```

### Form with Data Result

```csharp
private async Task OpenFilter()
{
    var options = new DrawerOptions { Position = BwDirection.Right, Resizable = true };
    var result = await DrawerService.ShowAsync<FilterComponent>("View Filters", null, options);

    if (!result.Canceled && result.Data is MyFilterData filters)
    {
        // Apply filters
    }
}
```

## API Reference

### DrawerOptions

| Property              | Type          | Default     | Description                                                     |
|-----------------------|---------------|-------------|-----------------------------------------------------------------|
| `Position`            | `BwDirection` | `Right`     | `Left`, `Right`, `Top`, or `Bottom`.                            |
| `Size`                | `BwSize`      | `Medium`    | Preset size (`Small`, `Medium`, `Large`, `ExtraLarge`, `Full`). |
| `Width`               | `string?`     | `null`      | Specific CSS width (Left/Right only).                           |
| `Height`              | `string?`     | `null`      | Specific CSS height (Top/Bottom only).                          |
| `Resizable`           | `bool`        | `false`     | Enables edge-dragging to resize.                                |
| `MinSize`             | `string?`     | `null`      | Minimum size limit for resizing (e.g., `"200px"`).              |
| `MaxSize`             | `string?`     | `null`      | Maximum size limit for resizing.                                |
| `ShowOverlay`         | `bool`        | `true`      | Dims the background content.                                    |
| `CloseOnOverlayClick` | `bool`        | `true`      | Closes when the dimmed area is clicked.                         |
| `ShowClose`           | `bool`        | `true`      | Displays the 'X' button in the header.                          |
| `Color`               | `BwColor`     | `Secondary` | Theme base for the header and borders.                          |

## Controlling from Inside

Inside the rendered component, you can access the drawer instance via a `CascadingParameter`:

```razor
@code {
    [CascadingParameter] DrawerInstance Drawer { get; set; }
    [Inject] DrawerService DrawerService { get; set; }

    void Submit() => DrawerService.Close(Drawer, DrawerResult.Ok(formData));
}
```
