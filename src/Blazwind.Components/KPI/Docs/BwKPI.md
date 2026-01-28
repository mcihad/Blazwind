# KPI

A versatile Key Performance Indicator (KPI) card component for displaying metrics, trends, and progress with high visual
impact.

## Features

- **Smart Formatting**: Built-in support for Number, Currency, Percent, and Decimal formats.
- **Trend Analysis**: Displays positive/negative trends with customizable indicators and semantic coloring.
- **Progress Tracking**: Integrated progress bar to visualize goal completion.
- **Visual Context**: Support for FontAwesome icons with theme-based background highlights.
- **Interactive States**: Supports hover effects and click events for drill-down functionality.

## Usage

```razor
@using Blazwind.Components.KPI

<BwKPI Title="Total Revenue" 
       Value="125000" 
       Format="KpiFormat.Currency"
       TrendValue="12.5"
       Icon="fa-solid fa-coins"
       Color="BwColor.Success" />
```

## Parameters

| Parameter             | Type        | Default           | Description                                                           |
|:----------------------|:------------|:------------------|:----------------------------------------------------------------------|
| `Title`               | `string`    | `"KPI"`           | The label or title of the metric.                                     |
| `Subtitle`            | `string?`   | `null`            | Optional secondary text below the title.                              |
| `Value`               | `double`    | `0`               | The main numeric value to display.                                    |
| `Format`              | `KpiFormat` | `Number`          | The format of the value (`Number`, `Currency`, `Percent`, `Decimal`). |
| `Prefix`              | `string?`   | `null`            | Text to display before the value.                                     |
| `Suffix`              | `string?`   | `null`            | Text to display after the value.                                      |
| `TrendValue`          | `double?`   | `null`            | The percentage change to display.                                     |
| `ShowTrend`           | `bool`      | `true`            | Whether to show the trend indicator.                                  |
| `TrendLabel`          | `string?`   | `"vs last month"` | Context text for the trend.                                           |
| `TrendPositiveIsGood` | `bool`      | `true`            | If true, positive trends are green (Success); if false, red (Danger). |
| `ShowProgress`        | `bool`      | `false`           | Whether to show the progress bar.                                     |
| `Progress`            | `double?`   | `null`            | The progress value (0-100).                                           |
| `Color`               | `BwColor`   | `Primary`         | The visual color theme of the icon and progress bar.                  |
| `Size`                | `BwSize`    | `Medium`          | The width scale of the card (`Small`, `Medium`, `Large`).             |
| `Icon`                | `string?`   | `null`            | FontAwesome icon class (e.g., "fa-solid fa-users").                   |
| `Clickable`           | `bool`      | `false`           | Whether the card shows a pointer cursor and emits clicks.             |

## Data Models

#### KpiFormat

| Value      | Description                           |
|:-----------|:--------------------------------------|
| `Number`   | Default numeric format (N0).          |
| `Currency` | Formats as currency (N0).             |
| `Percent`  | Appends % and formats as (N1).        |
| `Decimal`  | Formats with two decimal places (N2). |

## Events

| Event     | Payload | Description                                                  |
|:----------|:--------|:-------------------------------------------------------------|
| `OnClick` | `null`  | Triggered when the card is clicked (if `Clickable` is true). |

## Examples

### Progress Visualization

```razor
<BwKPI Title="Q4 Goal" 
       Value="75" 
       Suffix="%"
       ShowProgress="true" 
       Progress="75" 
       Color="BwColor.Info" />
```

### Inverted Trend Logic

Useful for metrics where "less is better" (e.g., server latency or bounce rate).

```razor
<BwKPI Title="Server Latency" 
       Value="45" 
       Suffix="ms"
       TrendValue="15.2" 
       TrendPositiveIsGood="false" 
       Color="BwColor.Danger" />
```
