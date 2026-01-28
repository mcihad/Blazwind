# Tabs

A component that organizes content into separate views where only one view is visible at a time.

## Examples

### Basic Usage

```razor
<BwTabs>
    <BwTabItem Title="Account">
        <p class="text-gray-600">Account settings and preferences.</p>
    </BwTabItem>
    <BwTabItem Title="Password">
        <p class="text-gray-600">Change your password here.</p>
    </BwTabItem>
    <BwTabItem Title="Notifications">
        <p class="text-gray-600">Manage email and push notifications.</p>
    </BwTabItem>
</BwTabs>
```

### Variants

Use the `Variant` parameter to change the visual style: `Ghost` (Default), `Soft` (Pills), `Outline` (Card/Boxed),
`Filled`.

```razor
<BwTabs Variant="BwVariant.Soft">
    <!-- Tabs -->
</BwTabs>
```

### Vertical Tabs

Set `Vertical="true"` to display tabs as a sidebar list.

```razor
<BwTabs Vertical="true">
    <BwTabItem Title="Profile" Icon="fa-solid fa-user">
        <!-- Content -->
    </BwTabItem>
    <BwTabItem Title="Security" Icon="fa-solid fa-lock">
        <!-- Content -->
    </BwTabItem>
</BwTabs>
```

### Closable Tabs

Set `Closable="true"` on `BwTabItem` to show a close button.

```razor
<BwTabs>
    <BwTabItem Title="Dynamic Tab" Closable="true" OnClose="@HandleClose">
        Content...
    </BwTabItem>
</BwTabs>
```

## API

### BwTabs Parameters

| Parameter            | Type        | Default | Description                                          |
|:---------------------|:------------|:--------|:-----------------------------------------------------|
| `ActiveIndex`        | `int`       | `0`     | Index of the currently active tab.                   |
| `Variant`            | `BwVariant` | `Ghost` | Style variant: `Ghost`, `Soft`, `Filled`, `Outline`. |
| `Vertical`           | `bool`      | `false` | If true, tabs are displayed vertically.              |
| `Justified`          | `bool`      | `false` | If true, tabs fill the available width evenly.       |
| `Scrollable`         | `bool`      | `false` | Enables scrolling if tabs exceed container width.    |
| `ShowScrollControls` | `bool`      | `false` | Shows arrow buttons for scrolling.                   |
| `MaxTabs`            | `int?`      | `null`  | Limits the maximum number of tabs.                   |

### BwTabItem Parameters

| Parameter       | Type             | Default | Description                                      |
|:----------------|:-----------------|:--------|:-------------------------------------------------|
| `Title`         | `string`         | `null`  | Tab header text.                                 |
| `Icon`          | `string`         | `null`  | Icon class for the header.                       |
| `Badge`         | `RenderFragment` | `null`  | Content to display as a badge next to the title. |
| `IsDisabled`    | `bool`           | `false` | Disables the tab (cannot be clicked).            |
| `Closable`      | `bool`           | `false` | Shows a close button on the tab.                 |
| `ConfirmClose`  | `bool`           | `false` | Asks for confirmation before closing.            |
| `TitleTemplate` | `RenderFragment` | `null`  | Custom template for the tab header.              |
