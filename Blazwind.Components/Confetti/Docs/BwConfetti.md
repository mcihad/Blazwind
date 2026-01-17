# BwConfetti 🎊

A canvas-based celebration animation component. Perfect for celebrating successful form submissions, achievements, or milestones with a burst of customizable particles.

## Features

- ✅ **High Performance**: Canvas-based rendering that doesn't bloat the DOM.
- ✅ **Customizable Particles**: Control count, gravity, spread, and colors.
- ✅ **Programmatic Trigger**: Launch the animation via C# methods.
- ✅ **Auto-launch Support**: Trigger the effect automatically on page load.
- ✅ **Localized Source**: Ability to launch confetti from a specific HTML element.

## Usage

### Simple Trigger
```razor
<BwConfetti @ref="_confetti" />

<BwButton OnClick="Celebrate">Celebrate! 🎊</BwButton>

@code {
    private BwConfetti? _confetti;
    
    private async Task Celebrate()
    {
        await _confetti?.Launch()!;
    }
}
```

### Auto-launch on Success
```razor
@if (_showSuccess)
{
    <BwConfetti AutoLaunch="true" ParticleCount="150" />
    <BwAlert Color="BwColor.Success">Process Completed!</BwAlert>
}
```

## API Reference

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `ParticleCount` | `int` | `100` | The number of confetti pieces to launch. |
| `Duration` | `int` | `3000` | How long the animation lasts in milliseconds. |
| `Gravity` | `double` | `0.3` | How quickly the particles fall. |
| `Spread` | `int` | `70` | The angle of the confetti burst. |
| `Colors` | `string[]?` | `null` | Array of hex color strings for custom themes. |
| `AutoLaunch` | `bool` | `false` | If true, launches immediately after rendering. |
| `TriggerElementId` | `string?` | `null` | The ID of an HTML element to use as the burst origin. |

### Public Methods

- `Launch()`: Triggers the confetti animation.
- `Stop()`: Immediately clears all active confetti from the screen.

## Examples

### Level-Up / Achievement Style
```razor
<BwConfetti @ref="_trophyConfetti" 
            ParticleCount="250" 
            Duration="5000"
            Colors="@(new[] { "#FFD700", "#FFA500" })" /> 
```

### Localized Burst (From a Button)
```razor
<BwButton Id="my-btn" OnClick="LaunchFromMe">Launch Here</BwButton>
<BwConfetti @ref="_localized" TriggerElementId="my-btn" />

@code {
    private async Task LaunchFromMe() => await _localized.Launch();
}
```
