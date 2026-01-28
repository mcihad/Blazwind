# BwHelpTooltip

A popover component that displays contextual help or information when clicking a trigger icon.

## Overview

`BwHelpTooltip` provides a clean way to show additional details without cluttering the UI. It renders a clickable icon (
default: question mark) which opens a popover containing title, text, or custom content.

## Usage

```razor
@using Blazwind.Components.HelpTooltip

<label>Email Address</label>
<BwHelpTooltip Content="We'll never share your email with anyone else." />
```

## Features

- **Popover:** Opens on click, closes on click-outside or close button.
- **Positioning:** Supports `Top`, `Bottom`, `Left`, `Right` placement.
- **Custom Content:** Accepts simple strings or `RenderFragment` for complex HTML within the tooltip.
- **External Links:** Optional "Learn more" link support.

## Parametreler

| Parametre      | Tip                   | Default                         | Description                                                          |
|:---------------|:----------------------|:--------------------------------|:---------------------------------------------------------------------|
| `Content`      | `string`              | `null`                          | Tooltip içerisinde gösterilecek düz metin.                           |
| `Title`        | `string`              | `null`                          | Tooltip başlığı (isteğe bağlı).                                      |
| `ChildContent` | `RenderFragment`      | `null`                          | `Content` yerine karmaşık HTML içeriği yerleştirmek için kullanılır. |
| `Icon`         | `string`              | `"fa-solid fa-circle-question"` | Tetikleyici ikon sınıfı.                                             |
| `Color`        | `BwColor`             | `Info`                          | İkonun rengi.                                                        |
| `Size`         | `BwSize`              | `Medium`                        | İkonun boyutu ve tooltip genişliği.                                  |
| `Position`     | `HelpTooltipPosition` | `Top`                           | Tooltip'in ikona göre konumu (`Top`, `Bottom`, `Left`, `Right`).     |
| `Closable`     | `bool`                | `true`                          | Kapatma butonunu ("X") gösterir.                                     |
| `LinkText`     | `string`              | `null`                          | Alt kısımda gösterilecek bağlantı metni.                             |
| `LinkHref`     | `string`              | `null`                          | Bağlantı adresi (URL).                                               |

## Olaylar (Events)

| Olay      | Paylaşım (Payload) | Açıklama                           |
|:----------|:-------------------|:-----------------------------------|
| `OnOpen`  | `null`             | Tooltip açıldığında tetiklenir.    |
| `OnClose` | `null`             | Tooltip kapatıldığında tetiklenir. |

## Examples

### With Title and Link

```razor
<BwHelpTooltip Title="Secure Connection" 
               Content="Your data is encrypted using 256-bit SSL."
               LinkText="Read Security Policy"
               LinkHref="/privacy"
               Color="BwColor.Success" />
```

### Custom Content

```razor
<BwHelpTooltip Position="HelpTooltipPosition.Right">
    <div class="flex items-center gap-2">
        <img src="avatar.png" class="w-8 h-8 rounded-full" />
        <span>Assigned to <strong>John Doe</strong></span>
    </div>
</BwHelpTooltip>
```
