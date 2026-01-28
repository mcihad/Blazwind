# BwChart

A powerful data visualization component that integrates **Apache ECharts** into Blazor. It supports a wide range of
chart types, from simple line and bar charts to complex radar, gauge, and calendar visualizations.

## Features

- ✅ **Rich Chart Types:** Line, Bar, Pie, Scatter, Radar, Gauge, Funnel, Heatmap, and more.
- ✅ **High Performance:** Smooth rendering and transitions even with large datasets.
- ✅ **Interactivity:** Built-in support for tooltips, zooming, and click events.
- ✅ **Theming:** Full support for custom theme colors and Light/Dark modes.
- ✅ **Flexibility:** Configure using typed `ChartOptions` or anonymous `object` for full ECharts access.
- ✅ **Dynamic Updates:** Real-time data streaming and auto-resize support.

## Usage

### Simple Configuration (Typed)

Use the `ChartOptions` class for a structured, type-safe API for common chart types.

```razor
<BwChart Options="_lineOptions" Height="350px" />

@code {
    private ChartOptions _lineOptions = new() {
        Title = new ChartTitle { Text = "Sales Over Time" },
        XAxis = new ChartAxis { 
            Type = ChartAxisType.Category, 
            Data = new List<string> { "Mon", "Tue", "Wed", "Thu", "Fri" } 
        },
        YAxis = new ChartAxis { Type = ChartAxisType.Value },
        Series = new List<ChartSeries> {
            new() { Type = ChartSeriesType.Line, Data = new List<int> { 120, 200, 150, 80, 70 }, Smooth = true }
        }
    };
}
```

### Advanced Configuration (Anonymous Object)

For complex ECharts features not yet covered by `ChartOptions`, use an anonymous `object`. This provides 100% access to
the ECharts API.

```razor
<BwChart Options="_gaugeOptions" Height="300px" />

@code {
    private object _gaugeOptions = new {
        series = new[] {
            new {
                type = "gauge",
                detail = new { formatter = "{value}%" },
                data = new[] { new { value = 75, name = "CPU Usage" } }
            }
        }
    };
}
```

## Supported Chart Types

| Type        | Description                                                                                   |
|-------------|-----------------------------------------------------------------------------------------------|
| **Line**    | Perfect for time series and trend analysis. Supports smooth, step, and stacked lines.         |
| **Bar**     | Ideal for categorical comparisons. Supports horizontal, grouped, stacked, and waterfall bars. |
| **Pie**     | Visualizes proportional distributions. Supports Donut, Nightingale Rose, and Nested charts.   |
| **Radar**   | Excellent for multi-dimensional comparisons (e.g., personnel skills).                         |
| **Gauge**   | Best for KPIs and performance metrics resembling speedometers or status bars.                 |
| **Mixed**   | Combine multiple types (e.g., Line + Bar) on the same axes.                                   |
| **Heatmap** | visualize density or activity, including GitHub-style **Calendar Heatmaps**.                  |

## API Reference

### Parameters

| Parameter     | Type                                 | Default   | Description                                    |
|---------------|--------------------------------------|-----------|------------------------------------------------|
| `Options`     | `object?`                            | `null`    | The configuration object (ECharts format).     |
| `Width`       | `string`                             | `"100%"`  | Container width (e.g., "600px").               |
| `Height`      | `string`                             | `"400px"` | Container height.                              |
| `Theme`       | `ChartTheme`                         | `Default` | Visual theme (`Default`, `Dark`, etc.).        |
| `ShowLoading` | `bool`                               | `false`   | Whether to show a loading indicator initially. |
| `OnClick`     | `EventCallback<ChartClickEventArgs>` | `null`    | Fired when a chart element is clicked.         |
| `Class`       | `string?`                            | `null`    | Additional CSS classes.                        |
| `Style`       | `string?`                            | `null`    | Inline CSS styles.                             |

### Public Methods

- `SetOptionAsync(object options, bool notMerge = false)`: Manually update the chart configuration.
- `ResizeAsync()`: Recalculate dimensions (use when the container size changes).
- `ShowLoadingAsync(string text = "Loading...") / HideLoadingAsync()`: Control the loading overlay.
- `GetDataUrlAsync(string type = "png")`: Export the current chart as a base64 image string.
- `ClearAsync()`: Remove all components and data from the chart.

## Interactivity

Handle user clicks to build drill-down dashboards:

```razor
<BwChart Options="_options" OnClick="@HandleChartClick" />

@code {
    private void HandleChartClick(ChartClickEventArgs e) {
        Console.WriteLine($"Clicked on {e.Name} in {e.SeriesName}: {e.Value}");
    }
}
```
