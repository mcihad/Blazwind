# Pagination

A component used to navigate through large datasets by dividing them into manageable pages.

## Examples

### Basic Usage

```razor
<BwPagination TotalItems="150" 
              PageSize="10" 
              @bind-CurrentPage="_currentPage" />

@code {
    private int _currentPage = 1;
}
```

### Advanced Features

Includes page size selector and item information.

```razor
<BwPagination TotalItems="500" 
              ShowPageSizeSelector="true" 
              ShowInfo="true"
              Size="BwSize.Small"
              @bind-CurrentPage="_currentPage"
              @bind-PageSize="_pageSize" />

@code {
    private int _currentPage = 1;
    private int _pageSize = 25;
}
```

### Mobile / Compact Mode

To use the input-based compact mode (which is active by default on mobile via `Responsive="true"`), you can also force
it:

```razor
<BwPagination TotalItems="100" Compact="true" />
```

## API - BwPagination

### Parameters

| Parameter              | Type      | Default             | Description                                                                |
|:-----------------------|:----------|:--------------------|:---------------------------------------------------------------------------|
| `TotalItems`           | `int`     | -                   | Total number of items in the dataset.                                      |
| `PageSize`             | `int`     | `10`                | Number of items to display per page (Supports two-way binding).            |
| `CurrentPage`          | `int`     | `1`                 | The currently active page (Supports two-way binding).                      |
| `MaxVisiblePages`      | `int`     | `5`                 | Maximum number of page buttons to show (excluding ellipses).               |
| `ShowFirstLast`        | `bool`    | `true`              | Show 'First' and 'Last' navigation buttons.                                |
| `ShowPageSizeSelector` | `bool`    | `false`             | Show a dropdown to change items per page.                                  |
| `PageSizeOptions`      | `int[]`   | `[10, 25, 50, 100]` | Options available in the page size selector.                               |
| `ShowInfo`             | `bool`    | `true`              | Show item range information (e.g., "1 - 10 / 150").                        |
| `Size`                 | `BwSize`  | `Medium`            | Size of the pagination buttons (`Small`, `Medium`, `Large`).               |
| `Compact`              | `bool`    | `false`             | Enables compact mode (Input box style instead of list). Useful for mobile. |
| `Responsive`           | `bool`    | `true`              | Automatically switches to Compact mode on mobile screens.                  |
| `Class`                | `string?` | `null`              | Additional CSS class for the container.                                    |

### Events

| Event                | Argument Type | Description                                       |
|:---------------------|:--------------|:--------------------------------------------------|
| `CurrentPageChanged` | `int`         | Fired when the active page changes.               |
| `PageSizeChanged`    | `int`         | Fired when the items per page setting is changed. |

## Features

- ✅ Responsive design with built-in Tailwind classes.
- ✅ Two-way binding support for page and size.
- ✅ Smart ellipsis handling for many pages.
- ✅ Dark mode compatibility.
