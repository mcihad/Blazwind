# SidePanel

A drawer-style container that slides out from the edge of the screen. Perfect for settings, detailed views, navigation
menus, or mobile-first overlays.

## Examples

### Basic Right Drawer

```razor
<BwSidePanel @bind-IsOpen="_isOpen" Title="Settings" Icon="fa-solid fa-gear">
    <p>Context-aware configuration options...</p>
</BwSidePanel>

<BwButton Text="Open Settings" OnClick="() => _isOpen = true" />

@code {
    private bool _isOpen;
}
```

### Full Configuration (Left Side)

```razor
<BwSidePanel @bind-IsOpen="_showMenu" 
             Position="BwPosition.Left" 
             Size="BwSize.Small"
             Color="BwColor.Success"
             ShowBackdrop="true"
             Closable="true">
    <ChildContent>
        <BwNavMenu ... />
    </ChildContent>
    <FooterContent>
        <BwButton Text="Logout" Color="BwColor.Danger" />
    </FooterContent>
</BwSidePanel>
```

## API - BwSidePanel

### Parameters

| Parameter              | Type         | Default   | Description                                                            |
|:-----------------------|:-------------|:----------|:-----------------------------------------------------------------------|
| `IsOpen`               | `bool`       | `false`   | Visibility state of the panel (Two-way binding).                       |
| `Title`                | `string?`    | `null`    | Header title text.                                                     |
| `Subtitle`             | `string?`    | `null`    | Small text below the title.                                            |
| `Icon`                 | `string?`    | `null`    | FontAwesome icon class for the header.                                 |
| `Position`             | `BwPosition` | `Right`   | `Left`, `Right`, `Top`, `Bottom`.                                      |
| `Size`                 | `BwSize`     | `Medium`  | `Small`, `Medium`, `Large`. Impacts width or height based on position. |
| `Color`                | `BwColor`    | `Primary` | Theme color used for the icon background.                              |
| `ShowHeader`           | `bool`       | `true`    | Whether to display the header section.                                 |
| `ShowBackdrop`         | `bool`       | `true`    | Show a dimmed overlay behind the panel.                                |
| `Closable`             | `bool`       | `true`    | Show a close (X) button in the header.                                 |
| `CloseOnBackdropClick` | `bool`       | `true`    | Close the panel when clicking the overlay.                             |
| `BodyClass`            | `string?`    | `null`    | CSS class for the content body.                                        |

### Render Fragments (Slots)

| Slot            | Description                                  |
|:----------------|:---------------------------------------------|
| `ChildContent`  | The main content of the side panel.          |
| `FooterContent` | Fixed area at the bottom for action buttons. |

### Events

| Event           | Argument Type   | Description                                   |
|:----------------|:----------------|:----------------------------------------------|
| `IsOpenChanged` | `bool`          | Fired when the panel opens or closes.         |
| `OnClose`       | `EventCallback` | Fired specifically when the panel is closing. |

## Methods

| Method   | Signature       | Description               |
|:---------|:----------------|:--------------------------|
| `Open`   | `Task Open()`   | Opens the panel.          |
| `Close`  | `Task Close()`  | Closes the panel.         |
| `Toggle` | `Task Toggle()` | Toggles visibility state. |

## Features

- ✅ **Multiple Positions**: Support for all four edges of the viewport.
- ✅ **Smooth Animations**: Tailwind-powered CSS transitions for entry/exit.
- ✅ **Responsive**: Handles overflow and mobile viewports gracefully.
- ✅ **Backdrop Control**: Optional dimming and dismissal via backdrop.
