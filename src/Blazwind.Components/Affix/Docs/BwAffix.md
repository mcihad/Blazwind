# BwAffix

A component used to pin content to a specific position during scrolling.

## Features

- Supports top or bottom pinning.
- Configurable offset values.
- Automatically activates based on scroll position.
- Smooth fixed position transition.

## Usage

```razor
<BwAffix OffsetTop="80">
    <BwButton Text="Pinned Button" />
</BwAffix>
```

## Parameters

| Name           | Type                  | Default | Description                                               |
|----------------|-----------------------|---------|-----------------------------------------------------------|
| `OffsetTop`    | `int`                 | `0`     | Distance from the top to pin the content (px).            |
| `OffsetBottom` | `int`                 | `0`     | Distance from the bottom to pin the content (px).         |
| `UseBottom`    | `bool`                | `false` | If `true`, pins to the bottom; otherwise pins to the top. |
| `Target`       | `string?`             | `null`  | Selector for the scroll target (optional).                |
| `OnChange`     | `EventCallback<bool>` | -       | Callback triggered when the affix state changes.          |
| `ChildContent` | `RenderFragment`      | -       | The content to be pinned.                                 |

## Examples

### Top Pinning

```razor
<BwAffix OffsetTop="100">
    <div class="bg-white shadow p-4">
        Pins 100px from the top of the page.
    </div>
</BwAffix>
```

### Bottom Pinning

```razor
<BwAffix UseBottom="true" OffsetBottom="50">
    <BwButton Text="Bottom Pinned Button" Color="BwColor.Primary" />
</BwAffix>
```

### Navigation Menu Pinning

```razor
<BwAffix OffsetTop="0">
    <nav class="w-full bg-white border-b p-4">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
    </nav>
</BwAffix>
```

### Sidebar Pinning

```razor
<div class="flex">
    <main class="flex-1">
        @* Long content *@
    </main>
    <aside class="w-64">
        <BwAffix OffsetTop="20">
            <div class="bg-gray-100 p-4 rounded">
                Pinned Sidebar Content
            </div>
        </BwAffix>
    </aside>
</div>
```
