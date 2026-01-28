# BwCountdown

A versatile countdown timer component that displays the time remaining until a target date or for a specified duration.
It supports labels, custom sizes, and various visual variants including gradients.

## Usage

### Count down to a Target Date

```razor
<BwCountdown TargetDate="@(new DateTime(2026, 1, 1))" ShowLabels="true" />
```

### Count down for a Specific Duration

```razor
<BwCountdown Duration="TimeSpan.FromMinutes(30)" OnComplete="HandleComplete" />
```

## API Reference

### Parameters

| Parameter          | Type        | Default   | Description                                                                            |
|--------------------|-------------|-----------|----------------------------------------------------------------------------------------|
| `TargetDate`       | `DateTime`  | `default` | The specific date and time to count down to.                                           |
| `Duration`         | `TimeSpan?` | `null`    | A relative duration to count down from (calculated from the moment of initialization). |
| `Size`             | `BwSize`    | `Medium`  | The visual scale of the component (`Small`, `Medium`, `Large`, `ExtraLarge`).          |
| `Color`            | `BwColor`   | `Primary` | The color theme applied to the timer boxes.                                            |
| `Variant`          | `BwVariant` | `Ghost`   | The visual style (`Filled`, `Outline`, `Soft`, `Ghost`).                               |
| `ShowDays`         | `bool`      | `true`    | Whether to display the days unit.                                                      |
| `ShowHours`        | `bool`      | `true`    | Whether to display the hours unit.                                                     |
| `ShowMinutes`      | `bool`      | `true`    | Whether to display the minutes unit.                                                   |
| `ShowSeconds`      | `bool`      | `true`    | Whether to display the seconds unit.                                                   |
| `ShowMilliseconds` | `bool`      | `false`   | Whether to display high-precision milliseconds (increases render frequency).           |
| `ShowLabels`       | `bool`      | `false`   | Whether to show descriptive labels below the numbers (e.g., "DAYS").                   |
| `DayLabel`         | `string`    | `"gün"`   | Custom label for days (default is Turkish).                                            |
| `HourLabel`        | `string`    | `"saat"`  | Custom label for hours.                                                                |
| `MinuteLabel`      | `string`    | `"dk"`    | Custom label for minutes.                                                              |
| `SecondLabel`      | `string`    | `"sn"`    | Custom label for seconds.                                                              |

### Event Callbacks

| Event        | Description                                         |
|--------------|-----------------------------------------------------|
| `OnComplete` | Triggered exactly once when the timer reaches zero. |

## Visual Styles

### Variants

The `Filled` variant uses premium background gradients:

- **Primary:** Blue gradient
- **Success:** Emerald gradient
- **Danger:** Red gradient
- **Warning:** Amber gradient

### Sizes

- `Small`: Compact view for sidebars.
- `Medium`: Default balanced view.
- `Large`: Prominent display for landing pages.
- `ExtraLarge`: Hero-style giant counter.

## Examples

### Precision Stopwatch Style

```razor
<BwCountdown Duration="TimeSpan.FromMinutes(5)" 
             ShowDays="false" 
             ShowHours="false" 
             ShowMilliseconds="true" 
             Color="BwColor.Danger" 
             Variant="BwVariant.Filled" />
```
