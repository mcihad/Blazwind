# BwEmptyState

A specialized component used to inform users when a list is empty, search results are not found, or content hasn't been created yet. It provides a clean, centered interface with optional illustrations and actions.

## Features

- ✅ **Visual Flexibility:** Support for default SVG illustrations, custom FontAwesome icons, or custom `RenderFragment` images.
- ✅ **Clear Communication:** Fields for both prominent titles and detailed descriptions.
- ✅ **Call to Action:** Includes a `ChildContent` area specifically for guide buttons (e.g., "Add New Record").

## Usage

### Simple Empty State
By default, it shows a clean box illustration.
```razor
<BwEmptyState Description="No records have been added yet." />
```

### Search Results Not Found
Using a custom icon and title.
```razor
<BwEmptyState Title="No Results Found" 
              Description="Try adjusting your search filters." 
              Icon="fa-solid fa-magnifying-glass" />
```

### With Action Button
Encourage users to take the next step.
```razor
<BwEmptyState Title="No Projects" Description="Get started by creating your first project now.">
    <BwButton Variant="BwVariant.Solid" Color="BwColor.Primary" Icon="fa-solid fa-plus">
        New Project
    </BwButton>
</BwEmptyState>
```

## API Reference

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Title` | `string` | `"No Data Found"` | The main heading of the empty state. |
| `Description` | `string` | `null` | Supporting text providing context or instructions. |
| `Icon` | `string` | `null` | FontAwesome class for a centered icon. |
| `Image` | `RenderFragment` | `null` | Replaces the icon area with custom SVG or image content. |
| `ChildContent` | `RenderFragment` | `null` | Area for action elements like buttons or links. |
| `Class` | `string` | `null` | Additional CSS classes for the container. |
