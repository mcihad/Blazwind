# Rating

Star-based rating component.

## Features

* **Half Star:** Half-step rating with `AllowHalf`.
* **Icons:** Customizable icons via `FilledIcon` and `EmptyIcon` (heart, circle, etc.).
* **Read-Only Mode:** Display-only mode with `IsReadOnly`.

## Usage

### Basic Usage

```razor
<BwRating Label="Product Rating" @bind-Value="rating" />
```

### Half Star and Display

```razor
<BwRating Value="3.5" AllowHalf="true" ShowValue="true" IsReadOnly="true" />
```

### Custom Icon

```razor
<BwRating FilledIcon="fa-solid fa-heart" 
          EmptyIcon="fa-regular fa-heart" 
          Color="BwColor.Danger" />
```

## Parameters

| Parameter    | Type      | Default                | Description                                                |
| :----------- | :-------- | :--------------------- | :--------------------------------------------------------- |
| `Value`      | `double`  | `0`                    | Current rating (two-way binding).                          |
| `MaxValue`   | `int`     | `5`                    | Maximum number of stars (or icons).                        |
| `AllowHalf`  | `bool`    | `false`                | Allows half-step selection.                                |
| `ShowValue`  | `bool`    | `false`                | Displays the selected value numerically next to the icons. |
| `FilledIcon` | `string`  | `"fa-solid fa-star"`   | Filled icon class.                                         |
| `EmptyIcon`  | `string`  | `"fa-regular fa-star"` | Empty icon class.                                          |
| `Color`      | `BwColor` | `Warning`              | Icon color.                                                |
| `Size`       | `BwSize`  | `Medium`               | Icon size (`Small`, `Medium`, `Large`).                    |
| `Label`      | `string`  | `null`                 | Top label text.                                            |
| `HelperText` | `string`  | `null`                 | Helper text below.                                         |
| `IsReadOnly` | `bool`    | `false`                | Read-only mode (hover and click disabled).                 |
| `IsDisabled` | `bool`    | `false`                | Disables the component.                                    |

## Events

| Event          | Payload  | Description                                          |
| :------------- | :------- | :--------------------------------------------------- |
| `ValueChanged` | `double` | Triggered when the rating changes (two-way binding). |
