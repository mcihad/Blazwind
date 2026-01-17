# BwCarousel

A component for scrolling through images or complex content with support for auto-play, custom templates, and smooth transitions.

## Features

- ✅ **Auto-play:** Configurable slide intervals.
- ✅ **Navigation:** Both arrow and indicator (dot) navigation.
- ✅ **Transitions:** Choose between standard slide or smooth fade effects.
- ✅ **Customization:** Full control over slide content via templates.
- ✅ **Interaction:** Pause on hover and endless loop options.

## Usage

### Simple Image Gallery (Default Model)
If items are strings, they are automatically rendered as images.

```razor
<BwCarousel Items="_images" AutoPlay="true" Interval="3000" />

@code {
    private List<object> _images = new() { "/img1.jpg", "/img2.jpg" };
}
```

### Custom Content Template
Use `ItemTemplate` to render any object type with custom styling.

```razor
<BwCarousel Items="_promotions">
    <ItemTemplate Context="promo">
        @{ var item = (Promotion)promo; }
        <div class="h-64 flex items-center justify-center bg-blue-600 text-white">
            <h2 class="text-3xl font-bold">@item.Title</h2>
        </div>
    </ItemTemplate>
</BwCarousel>
```

## API

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Items` | `List<object>` | `new()` | The list of items to display in the carousel. |
| `ItemTemplate` | `RenderFragment<object>?` | `null` | Custom template for rendering each item. |
| `AutoPlay` | `bool` | `false` | Automatically advance slides. |
| `Interval` | `int` | `5000` | Time between slides in milliseconds. |
| `Fade` | `bool` | `true` | Use fade transition instead of sliding animation. |
| `Loop` | `bool` | `true` | Return to the first slide after reaching the end. |
| `ShowArrows` | `bool` | `true` | Display next/previous navigation buttons. |
| `ShowIndicators`| `bool` | `true` | Display navigation dots at the bottom. |
| `PauseOnHover` | `bool` | `true` | Stop auto-play when the mouse is over the carousel. |
| `OnSlideChange`| `EventCallback<int>` | - | Triggered when the current slide index changes. |
| `Class` | `string?` | `null` | Additional CSS classes for the main container. |
| `Style` | `string?` | `null` | Inline CSS styles. |

## Methods

| Method | Description |
|--------|-------------|
| `Next()` | Advance to the next slide. |
| `Previous()`| Go back to the previous slide. |
| `GoTo(int index)`| Navigate to a specific slide index. |
| `Pause()` | Manually stop auto-play. |
| `Resume()` | Manually restart auto-play. |
