# Sidebar

A navigation drawer component that provides the main menu structure for the application shell.

## Usage

```razor
@using Blazwind.Components.Layout

<BwSidebar Width="w-64" Color="BwColor.Dark" Position="BwDirection.Left">
    <BwPadding All="BwSpacing.Md">
        <h3 class="text-white font-bold mb-4">Navigation</h3>
        @* Nav items go here *@
    </BwPadding>
</BwSidebar>
```

## Parameters

| Parameter  | Type          | Default  | Description                                   |
|:-----------|:--------------|:---------|:----------------------------------------------|
| `Width`    | `string`      | `"w-64"` | Tailwind width class for the sidebar.         |
| `Position` | `BwDirection` | `Left`   | Anchors the sidebar to the `Left` or `Right`. |
| `Color`    | `BwColor`     | `Light`  | Theme style (`Light`, `Dark`, `Primary`).     |
| `Class`    | `string?`     | `null`   | Custom CSS classes.                           |

## JS Interop

The sidebar visibility on mobile is managed via JavaScript:

- `Blazwind.Sidebar.toggle()`: Toggles the visibility.
- `Blazwind.Sidebar.close()`: Forces the sidebar to close (e.g., after a navigation event).
