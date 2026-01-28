# BwCard

A versatile container for organizing and presenting related information. It can be used as a simple content box or
customized with headers, footers, and icons.

## Examples

### Basic Card

A standard card with a header containing a title and subtitle.

```razor
<BwCard Title="Standard Card" Subtitle="Description of the card content">
    <BwTypography Color="BwColor.Secondary">
        This is a standard card with a header containing a title and subtitle.
    </BwTypography>
</BwCard>
```

### Card with Icon

Use the `Icon` and `Color` parameters to quickly add a themed icon to the header.

```razor
<BwCard Title="Featured Item" 
        Icon="fa-solid fa-star" 
        Color="BwColor.Warning">
    <p>This card highlights a specific feature using themed colors.</p>
</BwCard>
```

### Custom Slots

For more control, use the `Header` and `Footer` render fragments.

```razor
<BwCard>
    <Header>
        <div class="flex justify-between items-center">
            <BwTypography Weight="BwFontWeight.Bold">Dynamic Title</BwTypography>
            <BwBadge>New</BwBadge>
        </div>
    </Header>
    <ChildContent>
        Primary card content area.
    </ChildContent>
    <Footer>
        <BwButton Text="Action" Size="BwSize.Small" />
    </Footer>
</BwCard>
```

## Specialized Variants

For more specific use cases, see these related components:

- [BwHero](BwHero.md): For page titles and introductions.
- [BwStatCard](BwStatCard.md): For dashboard statistics and metrics.
- [BwCardHeader](BwCardHeader.md): For standalone or highly customized cloud headers.
- [BwCardBody](BwCardBody.md): A padding wrapper for card content.

## API

| Parameter      | Type              | Default        | Description                                         |
|----------------|-------------------|----------------|-----------------------------------------------------|
| `Title`        | `string?`         | `null`         | The card's main title (used in default header).     |
| `Subtitle`     | `string?`         | `null`         | Descriptive text shown below the title.             |
| `Icon`         | `string?`         | `null`         | Icon class displayed in the default header.         |
| `Color`        | `BwColor`         | `Primary`      | Theme color for the default header icon.            |
| `Header`       | `RenderFragment?` | `null`         | Custom content for the card header.                 |
| `Footer`       | `RenderFragment?` | `null`         | Custom content for the card footer.                 |
| `ChildContent` | `RenderFragment?` | `null`         | The main content area of the card.                  |
| `BodyClass`    | `string`          | `"p-4 md:p-6"` | CSS classes for the card body wrapper.              |
| `HeaderClass`  | `string?`         | `null`         | Additional CSS classes for the header section.      |
| `FooterClass`  | `string?`         | `null`         | Additional CSS classes for the footer section.      |
| `Class`        | `string?`         | `null`         | Additional CSS classes for the main card container. |
