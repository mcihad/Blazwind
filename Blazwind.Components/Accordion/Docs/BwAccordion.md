# BwAccordion

A collapsible panel component used for organizing content and saving vertical space.

## Features

- Single or multiple expanded panel modes.
- Different size and color options.
- Various appearance variants (Outline, Ghost, Filled).
- Customizable header and content.
- Support for icons and badges in headers.
- Smooth transition animations.

## Usage

```razor
<BwAccordion>
    <BwAccordionItem Title="Section 1">
        Content for the first section.
    </BwAccordionItem>
    <BwAccordionItem Title="Section 2">
        Content for the second section.
    </BwAccordionItem>
</BwAccordion>
```

## Parameters

### BwAccordion

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `ChildContent` | `RenderFragment` | - | The content of the accordion (a list of `BwAccordionItem` components). |
| `AllowMultiple` | `bool` | `false` | If `true`, multiple panels can stay open simultaneously. |
| `DefaultOpenIndex` | `int?` | `null` | The 0-based index of the panel to be open by default. |
| `Variant` | `BwVariant` | `BwVariant.Outline` | The visual style. Options: `Outline`, `Ghost`, `Filled`. |
| `Color` | `BwColor` | `BwColor.Primary` | The color theme of the active (expanded) panel header. |
| `Size` | `BwSize` | `BwSize.Medium` | The overall size of the component. Options: `ExtraSmall`, `Small`, `Medium`, `Large`, `ExtraLarge`. |

### BwAccordionItem

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `Title` | `string` | - | The title text of the panel. |
| `TitleTemplate` | `RenderFragment` | - | A custom template for the header title (overrides `Title`). |
| `Icon` | `string` | - | CSS class for an icon to be displayed to the left of the title. |
| `Badge` | `RenderFragment` | - | A fragment to be displayed as a badge to the right of the title. |
| `IsDisabled` | `bool` | `false` | If `true`, the panel cannot be expanded or collapsed. |
| `ChildContent` | `RenderFragment` | - | The content to be displayed when the panel is expanded. |

## Examples

### Variants

```razor
@* Outlined (Default) *@
<BwAccordion Variant="BwVariant.Outline">
    <BwAccordionItem Title="Outline Item">Content...</BwAccordionItem>
</BwAccordion>

@* Ghost / Flush *@
<BwAccordion Variant="BwVariant.Ghost">
    <BwAccordionItem Title="Ghost Item">Content...</BwAccordionItem>
</BwAccordion>

@* Filled *@
<BwAccordion Variant="BwVariant.Filled">
    <BwAccordionItem Title="Filled Item">Content...</BwAccordionItem>
</BwAccordion>
```

### Colors and Sizes

```razor
<BwAccordion Color="BwColor.Danger" Size="BwSize.Large" AllowMultiple="true">
    <BwAccordionItem Title="Large Danger Item" Icon="fa-solid fa-triangle-exclamation">
        This is a large, danger-colored accordion item.
    </BwAccordionItem>
    <BwAccordionItem Title="Another Item">
        Multiple items can be open in this mode.
    </BwAccordionItem>
</BwAccordion>
```
