# Marquee

A continuous scrolling/sliding content component ideal for logo tickers, news feeds, and testimonial sliders.

## Features

- **Directional Scroll**: Supports both `Horizontal` and `Vertical` sliding.
- **Speed Control**: Configurable cycle `Duration` in seconds.
- **Pause on Hover**: Interactivity that stops the animation when the user points to the content.
- **Seamless Looping**: Automatic content cloning for an infinite scrolling effect.
- **Modern Performance**: Uses CSS hardware-accelerated animations for smooth motion.

## Usage

```razor
@using Blazwind.Components.Marquee

<BwMarquee Duration="30" PauseOnHover="true">
    <div class="flex items-center gap-12">
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
        <span>Item 4</span>
    </div>
</BwMarquee>
```

## Parameters

| Parameter      | Type             | Default      | Description                                                             |
|:---------------|:-----------------|:-------------|:------------------------------------------------------------------------|
| `Duration`     | `int`            | `20`         | Animation cycle duration in seconds. Lower values increase speed.       |
| `Direction`    | `BwDirection`    | `Horizontal` | Scrolling orientation: `Horizontal` or `Vertical`.                      |
| `Reverse`      | `bool`           | `false`      | If true, flips the scrolling direction.                                 |
| `PauseOnHover` | `bool`           | `true`       | Stops the animation when the mouse hovers over any part of the marquee. |
| `Clone`        | `bool`           | `true`       | Duplicates content to ensure a seamless infinite loop.                  |
| `ChildContent` | `RenderFragment` | `null`       | The content to be scrolled.                                             |

## Examples

### Logo Slider

Perfect for displaying partner or technology logos.

```razor
<BwMarquee Duration="40" PauseOnHover="true">
    <div class="flex items-center gap-16 px-8">
        <img src="logo1.png" class="h-12" />
        <img src="logo2.png" class="h-12" />
        <img src="logo3.png" class="h-12" />
        <img src="logo4.png" class="h-12" />
    </div>
</BwMarquee>
```

### Fast Ticker (Reverse)

A quick-moving ticker moving from left to right.

```razor
<BwMarquee Duration="10" Reverse="true">
    <div class="flex items-center gap-8 text-blue-600 font-bold">
        <span>🚀 NEW FEATURE RELEASED</span>
        <span>✨ 50+ COMPONENTS ADDED</span>
        <span>⚡ PERFORMANCE BOOST</span>
    </div>
</BwMarquee>
```

### Vertical Testimonials

Scroll reviews or comments from bottom to top.

```razor
<div class="h-64 border rounded p-4">
    <BwMarquee Direction="BwDirection.Vertical" Duration="15">
        <div class="space-y-6">
            <BwCard Title="User A">Great library!</BwCard>
            <BwCard Title="User B">Extremely fast to build.</BwCard>
            <BwCard Title="User C">Tailwind support is a game changer.</BwCard>
        </div>
    </BwMarquee>
</div>
```
