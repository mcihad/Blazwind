# Bottom Navigation

A mobile-focused navigation bar fixed at the bottom of the screen. Ideal for handheld devices and PWA experiences.

## Examples

### Basic Setup

A standard bottom navigation with 4-5 key destinations.

```razor
<BwBottomNav>
    <BwBottomNavItem Label="Home" Icon="fa-solid fa-home" Href="/" />
    <BwBottomNavItem Label="Explore" Icon="fa-solid fa-compass" Href="/explore" />
    <BwBottomNavItem Label="Orders" Icon="fa-solid fa-bag-shopping" BadgeCount="3" Href="/orders" />
    <BwBottomNavItem Label="Profile" Icon="fa-solid fa-user" ShowDot="true" Href="/profile" />
</BwBottomNav>
```

## API - BwBottomNav

### Parameters

| Parameter      | Type              | Default | Description                               |
|:---------------|:------------------|:--------|:------------------------------------------|
| `ChildContent` | `RenderFragment?` | `null`  | List of `BwBottomNavItem` components.     |
| `Class`        | `string?`         | `null`  | Additional CSS classes for the container. |

## API - BwBottomNavItem

### Parameters

| Parameter    | Type            | Default            | Description                                |
|:-------------|:----------------|:-------------------|:-------------------------------------------|
| `Label`      | `string?`       | `null`             | Text label displayed below the icon.       |
| `Icon`       | `string`        | `fa-solid fa-home` | FontAwesome icon class.                    |
| `Href`       | `string?`       | `null`             | Target URL for navigation.                 |
| `BadgeCount` | `int`           | `0`                | Number to display in a circular red badge. |
| `ShowDot`    | `bool`          | `false`            | If true, shows a small red dot indicator.  |
| `IsDisabled` | `bool`          | `false`            | If true, the item is not clickable.        |
| `OnClick`    | `EventCallback` | -                  | Fired when the item is clicked.            |

## Features

- ✅ iOS Safe Area support
- ✅ Badge display
- ✅ Dot indicator
- ✅ Active state indicator
- ✅ Responsive design
