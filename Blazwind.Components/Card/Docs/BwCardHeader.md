# BwCardHeader

A layout component for the top section of a card, supporting titles, subtitles, and icons.

## Examples

### Basic Header
Standard title and subtitle with an icon.

```razor
<BwCardHeader Title="System Status" 
              SubTitle="Current operational metrics" 
              Icon="fa-solid fa-server" />
```

### Custom Content
Use `ChildContent` for complex layouts like adding buttons or badges.

```razor
<BwCardHeader>
    <div class="flex justify-between items-center w-full">
        <h3 class="font-bold">Project Details</h3>
        <BwBadge Color="BwColor.Primary">Active</BwBadge>
    </div>
</BwCardHeader>
```

## API

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Title` | `string?` | `null` | Main header text. |
| `SubTitle` | `string?` | `null` | Secondary descriptive text. |
| `Icon` | `string?` | `null` | Icon class (e.g., "fa-solid fa-star"). |
| `IconBgClass`| `string` | `"bg-blue-100 dark:bg-blue-900/30"` | CSS class for icon background. |
| `IconClass` | `string` | `"text-blue-600 dark:text-blue-400"` | CSS class for icon itself. |
| `ChildContent`| `RenderFragment?`| `null` | Custom content inside the header. |
| `Class` | `string?` | `null` | Additional CSS classes for the container. |
