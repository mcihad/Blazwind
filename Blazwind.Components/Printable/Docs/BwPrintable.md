# Printable

A component wrapper designed for preparing and printing document-style content. It handles page sizes, orientations, and provides a built-in print preview experience.

## Examples

### Basic Report
```razor
<BwPrintable Title="Sales Report" ShowBorder="true">
    <div class="p-4">
        <h2>Quarterly Results</h2>
        <p>Report data goes here...</p>
    </div>
</BwPrintable>
```

### Institutional Letter
Using header and footer templates.

```razor
<BwPrintable Title="Official Letter" PageSize="PrintPageSize.A4">
    <HeaderTemplate>
        <div class="flex justify-between border-b pb-4">
            <span class="font-bold">Company Name</span>
            <span>Date: @DateTime.Now.ToShortDateString()</span>
        </div>
    </HeaderTemplate>
    <ChildContent>
        <p>Main document body...</p>
    </ChildContent>
    <FooterTemplate>
        <div class="text-center text-xs text-gray-400 pt-4 border-t">
            Address information and page numbers.
        </div>
    </FooterTemplate>
</BwPrintable>
```

## API - BwPrintable

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Title` | `string?` | `null` | Document title (used as file name in some browsers). |
| `PageSize` | `PrintPageSize` | `A4` | Standards: `A4`, `A5`, `Letter`, `Legal`. |
| `Orientation` | `PrintOrientation`| `Portrait` | Direction: `Portrait` (vertical) or `Landscape` (horizontal). |
| `Margin` | `string` | `20mm` | CSS margin for the print area. |
| `ShowToolbar` | `bool` | `true` | Show the print action bar above the content. |
| `PrintButtonText`| `string` | `Yazdır` | Label for the default print button. |
| `ShowBorder` | `bool` | `false` | Show a dashed border on screen to indicate the print area. |
| `ShowPageNumbers`| `bool` | `false` | Enable browser-level page numbering. |
| `PrintAreaClass` | `string?` | `null` | CSS class for the inner print area. |
| `CustomStyles` | `string?` | `null` | Custom CSS injected specifically for printing. |

### Render Fragments (Slots)

| Slot | Description |
| :--- | :--- |
| `ChildContent` | The main content to be printed. |
| `HeaderTemplate`| Content displayed at the top of every printed page. |
| `FooterTemplate`| Content displayed at the bottom of every printed page. |
| `ToolbarContent`| Additional buttons or controls for the print toolbar. |

### Methods

| Method | Signature | Description |
| :--- | :--- | :--- |
| `PrintAsync` | `Task PrintAsync()` | Programmatically triggers the print dialog. |
| `GetHtmlAsync` | `Task<string> GetHtmlAsync()`| Returns the HTML content of the print area. |

## Print Helper CSS Classes

The following classes can be used within your content to control print behavior:

- `.no-print`: Hide element during printing (e.g., action buttons).
- `.page-break`: Force a page break before this element.
- `.page-break-after`: Force a page break after this element.
- `.avoid-break`: Prevent this element from being split across two pages.

## Enums

### PrintPageSize
`A4`, `A5`, `Letter`, `Legal`

### PrintOrientation
`Portrait` (Default), `Landscape`
