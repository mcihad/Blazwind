# BwStatCard

A specialized card component for dashboards and data visualization, used to display key statistics, metrics, and trends.

## Features

- ✅ Theme-colored icon highlights.
- ✅ Trend indicator (Up, Down, Neutral).
- ✅ Detailed trend descriptions.
- ✅ Support for custom footer or detailed content.

## Examples

### Sales Stat

A standard metric with a positive trend.

```razor
<BwStatCard Title="Monthly Sales" 
            Value="$45,230" 
            Icon="fa-solid fa-chart-line" 
            Trend="BwTrend.Up" 
            TrendValue="+12.5%" 
            TrendDescription="since last month" />
```

### User Feedback

Metric with a negative trend using the `Danger` color.

```razor
<BwStatCard Title="Bounce Rate" 
            Value="24%" 
            Icon="fa-solid fa-arrow-up-right-from-square" 
            Color="BwColor.Danger" 
            Trend="BwTrend.Down" 
            TrendValue="-3.2%" />
```

## API

| Parameter          | Type              | Default   | Description                                           |
|--------------------|-------------------|-----------|-------------------------------------------------------|
| `Title`            | `string`          | `""`      | The metric label.                                     |
| `Value`            | `string`          | `""`      | The primary metric value.                             |
| `Icon`             | `string?`         | `null`    | Icon displayed prominently.                           |
| `Color`            | `BwColor`         | `Primary` | Theme color for the icon background.                  |
| `Trend`            | `BwTrend`         | `Neutral` | Trend direction (`Up`, `Down`, `Neutral`).            |
| `TrendValue`       | `string?`         | `null`    | Text for the trend percentage or value.               |
| `TrendDescription` | `string?`         | `null`    | Supporting text for the trend (e.g., "vs last week"). |
| `ChildContent`     | `RenderFragment?` | `null`    | Content for the bottom section of the card.           |
| `Class`            | `string?`         | `null`    | Additional CSS classes.                               |
