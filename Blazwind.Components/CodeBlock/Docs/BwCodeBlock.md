# BwCodeBlock

A specialized component for displaying code snippets with optional line numbering, syntax labels, and one-click copy functionality.

## Features

- ✅ **Line Numbers**: Optional gutter for easier code reference.
- ✅ **Copy to Clipboard**: Built-in button with visual "Copied" feedback.
- ✅ **Header & Labels**: customizable header with filename and language tag.
- ✅ **Line Highlighting**: Emphasize specific lines of code.
- ✅ **Theming**: Supports `dark` (default) and `light` themes.
- ✅ **Visual Polish**: Code-window dots (red, yellow, green) for a modern terminal look.

## Usage

### Basic Usage
```razor
<BwCodeBlock Language="csharp" 
             FileName="Program.cs" 
             Code="@_myCode" />

@code {
    private string _myCode = "Console.WriteLine(\"Hello Blazwind!\");";
}
```

### Line Highlighting & Theming
```razor
<BwCodeBlock Code="@_jsCode" 
             Language="JavaScript" 
             Theme="light" 
             HighlightLines="@(new[] { 2 })" />
```

## API Reference

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Code` | `string` | `""` | The code content to be displayed. |
| `Language` | `string?` | `null` | Programming language label (shown in header). |
| `FileName` | `string?` | `null` | Filename to display in the header. |
| `Theme` | `string` | `"dark"` | Visual theme: `"dark"` or `"light"`. |
| `ShowHeader` | `bool` | `true` | Whether to show the top header bar. |
| `ShowLineNumbers`| `bool` | `true` | Whether to show line numbers in the gutter. |
| `ShowCopyButton` | `bool` | `true` | Whether to show the copy-to-clipboard button. |
| `ShowDots` | `bool` | `true` | Whether to show the terminal-style window decorations. |
| `HighlightLines` | `int[]?` | `null` | Array of line numbers to visually emphasize. |

## Examples

### Terminal / Bash Style
Useful for installation commands where headers and line numbers might be redundant.

```razor
<BwCodeBlock Code="dotnet add package Blazwind.Components" 
             Language="bash" 
             ShowLineNumbers="false" 
             ShowDots="false" />
```

### Specific Line Highlighting
```razor
<BwCodeBlock Code="@_code" 
             HighlightLines="@(new[] { 3, 4 })" />
```
