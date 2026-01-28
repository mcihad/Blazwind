# BwNotFound

A highly aesthetic, general-purpose 404 Not Found page component designed for modern web applications.

## Usage

### Basic Usage

The component comes with sensible defaults. Just drop it into your page or layout.

```razor
<BwNotFound />
```

### Localization & Customization

You can easily translate or customize all text elements.

```razor
<BwNotFound Title="Sayfa Bulunamadı" 
            Description="Aradığınız sayfa mevcut değil veya taşınmış olabilir." 
            ActionText="Ana Sayfaya Dön" 
            ActionHref="/" />
```

### Custom Actions

If you need more than a simple link button (e.g., a "Go Back" button using navigation manager history), use the
`CustomAction` fragment.

```razor
<BwNotFound>
    <CustomAction>
        <BwButton Variant="BwVariant.Outline" OnClick="GoBack">Geri Dön</BwButton>
        <BwButton Variant="BwVariant.Filled" Color="BwColor.Primary" Href="/">Ana Sayfa</BwButton>
    </CustomAction>
</BwNotFound>
```

### Custom Content

You can replace the description with custom code blocks, search inputs, or suggestions.

```razor
<BwNotFound>
    <CustomContent>
         <p class="mb-4">We couldn't find that page. Try searching:</p>
         <BwInput Placeholder="Search documentation..." IconLeft="fa-solid fa-search" />
    </CustomContent>
</BwNotFound>
```

## API

| Parameter     | Type              | Default            | Description                                            |
|---------------|-------------------|--------------------|--------------------------------------------------------|
| Title         | `string`          | `"Page Not Found"` | The main heading text.                                 |
| Description   | `string`          | `"Sorry..."`       | The descriptive text below the heading.                |
| ActionText    | `string`          | `"Go Back Home"`   | The text for the default action button.                |
| ActionHref    | `string`          | `"/"`              | The URL for the default action button.                 |
| CustomContent | `RenderFragment?` | `null`             | Optional content to replace the description.           |
| CustomAction  | `RenderFragment?` | `null`             | Optional content to replace the default action button. |
| Class         | `string?`         | `null`             | Custom CSS classes.                                    |
| Style         | `string?`         | `null`             | Custom inline styles.                                  |
