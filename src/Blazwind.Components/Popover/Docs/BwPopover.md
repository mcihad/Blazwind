# Popover

A rich version of a Tooltip that can contain HTML content, headers, and footers. Ideal for displaying detailed
information or small interactive forms on demand.

## Examples

### Basic Usage

```razor
<BwPopover Title="Information" Content="This is a simple popover with a title and text content.">
    <BwButton Variant="BwVariant.Outline" Text="Click Me" />
</BwPopover>
```

### Rich Content

Using slots for complex layouts.

```razor
<BwPopover Closable="true">
    <ChildContent>
        <BwButton Text="User Details" />
    </ChildContent>
    <HeaderContent>
        <span class="font-bold">User Information</span>
    </HeaderContent>
    <BodyContent>
        <div class="flex items-center gap-3">
            <BwAvatar Src="user.jpg" />
            <div>
                <p class="font-medium">John Doe</p>
                <p class="text-xs text-gray-500">john@example.com</p>
            </div>
        </div>
    </BodyContent>
    <FooterContent>
        <BwButton Text="View Profile" Size="BwSize.Small" />
    </FooterContent>
</BwPopover>
```

## API - BwPopover

### Parameters

| Parameter   | Type          | Default  | Description                                                      |
|:------------|:--------------|:---------|:-----------------------------------------------------------------|
| `Title`     | `string?`     | `null`   | Primary header text.                                             |
| `Content`   | `string?`     | `null`   | Plain text content for the body.                                 |
| `Placement` | `BwPlacement` | `Bottom` | Position relative to trigger (`Top`, `Bottom`, `Left`, `Right`). |
| `Trigger`   | `BwTrigger`   | `Click`  | Interaction that opens the popover (`Click`, `Hover`, `Focus`).  |
| `ShowArrow` | `bool`        | `true`   | Show a pointer arrow directed at the trigger.                    |
| `Closable`  | `bool`        | `false`  | Show a close (X) button in the header.                           |
| `IsOpen`    | `bool`        | `false`  | Bound state of the popover (Two-way).                            |
| `Class`     | `string?`     | `null`   | Additional CSS class for the wrapper.                            |

### Render Fragments (Slots)

| Slot            | Description                                             |
|:----------------|:--------------------------------------------------------|
| `ChildContent`  | The trigger element (e.g., a button or link).           |
| `HeaderContent` | Custom content for the header area (Overrides `Title`). |
| `BodyContent`   | Custom content for the body area (Overrides `Content`). |
| `FooterContent` | Content area at the bottom of the popover.              |

### Events

| Event           | Argument Type | Description                             |
|:----------------|:--------------|:----------------------------------------|
| `IsOpenChanged` | `bool`        | Fired when the popover opens or closes. |

## Features

- ✅ **Rich Slots**: Dedicated areas for header, body, and footer.
- ✅ **Multiple Triggers**: Support for click, hover, and focus.
- ✅ **Dynamic Placement**: Smart alignment to four cardinal directions.
- ✅ **Tailwind Animated**: Smooth fade and zoom entry animations.
- ✅ **Closable Header**: Optional close button for manual dismiss.
