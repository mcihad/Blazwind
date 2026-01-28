# BwHero

A high-impact header component designed for page titles, introductions, or featured sections, featuring a modern
gradient background.

## Examples

### Standard Hero

Standard title and description with an icon.

```razor
<BwHero Title="Welcome to Blazwind" 
        Description="A modern UI library for Blazor developers." 
        Icon="fa-solid fa-rocket" />
```

### Color Variants

Use different theme colors for the gradient effect.

```razor
<BwHero Title="Security Alert" 
        Description="Critical system updates required." 
        Icon="fa-solid fa-shield-halved" 
        Color="BwColor.Danger" />
```

## API

| Parameter      | Type              | Default   | Description                              |
|----------------|-------------------|-----------|------------------------------------------|
| `Title`        | `string`          | `""`      | The primary headline.                    |
| `Description`  | `string?`         | `null`    | Supporting descriptive text.             |
| `Icon`         | `string?`         | `null`    | Large icon displayed next to the title.  |
| `Color`        | `BwColor`         | `Primary` | Theme color for the background gradient. |
| `ChildContent` | `RenderFragment?` | `null`    | Custom content below the description.    |
| `Class`        | `string?`         | `null`    | Additional CSS classes.                  |
