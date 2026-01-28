# Form System

The Blazwind Form system is a comprehensive suite of components designed to manage complex input layouts, validation
states, and consistent styling across your application.

## Core Components

- **`BwForm`**: The master container. It manages the `EditContext`, coordinates validation, and cascades global settings
  like density and label positioning.
- **`BwFormField`**: A wrapper for individual inputs. Handles labels, help text (inline or popup), error messages, and
  required indicators.
- **`BwFormGrid`**: A responsive grid system specifically optimized for high-density forms.
- **`BwFormRow`**: A flexible flex-row container for horizontal field groupings.
- **`BwFormActions`**: A standardized layout for form buttons (Submit, Cancel, etc.) with configurable alignment.

## Global Cascading Settings

One of the most powerful features of `BwForm` is its ability to cascade settings to all child fields automatically:

| Setting         | Type              | Description                                                          |
|-----------------|-------------------|----------------------------------------------------------------------|
| `Density`       | `BwFormDensity`   | Spacing scale: `Compact`, `Normal`, `Relaxed`.                       |
| `LabelPosition` | `BwLabelPosition` | Position: `Top`, `Left`, `Floating`, `Hidden`.                       |
| `HelpTextMode`  | `BwHelpTextMode`  | Helper text style: `Inline` (below field) or `Popup` (tooltip icon). |

## Basic Usage

```razor
<BwForm Model="@_userModel" OnValidSubmit="HandleSubmit">
    <BwFormGrid Columns="2">
        <BwFormField Label="First Name" IsRequired="true">
            <BwInput @bind-Value="_userModel.FirstName" />
        </BwFormField>
        
        <BwFormField Label="Email" HelperText="We'll use this for notifications.">
            <BwInput @bind-Value="_userModel.Email" Type="email" />
        </BwFormField>
    </BwFormGrid>

    <BwFormActions>
        <BwButton Text="Save Changes" HtmlType="submit" Color="BwColor.Primary" />
    </BwFormActions>
</BwForm>
```

## API Referansı

### BwForm Parametreleri

| Parametre         | Tip                          | Varsayılan | Açıklama                                                                         |
|:------------------|:-----------------------------|:-----------|:---------------------------------------------------------------------------------|
| `Model`           | `object`                     | `null`     | Formun bağlı olduğu veri nesnesi.                                                |
| `EditContext`     | `EditContext`                | `null`     | Mevcut bir `EditContext` nesnesi (Model yerine kullanılabilir).                  |
| `Density`         | `BwFormDensity`              | `Normal`   | Tüm alanlar için varsayılan dikey yoğunluk (`Compact`, `Normal`, `Relaxed`).     |
| `LabelPosition`   | `BwLabelPosition`            | `Top`      | Tüm alanlar için varsayılan etiket konumu (`Top`, `Left`, `Floating`, `Hidden`). |
| `HelpTextMode`    | `BwHelpTextMode`             | `Inline`   | Yardımcı metinlerin varsayılan gösterim şekli (`Inline`, `Popup`).               |
| `ChildContent`    | `RenderFragment`             | `null`     | Form içeriği (alanlar, butonlar vb.).                                            |
| `OnValidSubmit`   | `EventCallback<EditContext>` | -          | Başarılı validasyon sonrası form gönderildiğinde tetiklenir.                     |
| `OnInvalidSubmit` | `EventCallback<EditContext>` | -          | Validasyon başarısız olduğunda form gönderilmeye çalışılırsa tetiklenir.         |

### BwFormField Parametreleri

| Parametre       | Tip                | Varsayılan | Açıklama                                             |
|:----------------|:-------------------|:-----------|:-----------------------------------------------------|
| `Label`         | `string`           | `null`     | Alan etiketi.                                        |
| `HelperText`    | `string`           | `null`     | Açıklayıcı yardımcı metin.                           |
| `IsRequired`    | `bool`             | `false`    | Zorunlu alan işareti gösterir.                       |
| `LabelWidth`    | `string`           | `"120px"`  | `LabelPosition="Left"` durumunda etiketin genişliği. |
| `LabelPosition` | `BwLabelPosition?` | `null`     | Formun global ayarını bu alan için ezer.             |
| `HelpTextMode`  | `BwHelpTextMode?`  | `null`     | Formun global ayarını bu alan için ezer.             |
| `ChildContent`  | `RenderFragment`   | `null`     | Input bileşeni.                                      |
| `Class`         | `string`           | `null`     | Ek CSS sınıfları.                                    |

## Manual Validation Management

The `BwForm` component provides public methods for manual validation control:

- `AddError(fieldName, message)`: Inject a custom error message.
- `ClearErrors(fieldName?)`: Clear errors for one field or the entire form.
- `Validate()`: Manually trigger the validation cycle.
- `Reset()`: Clear all errors and marks the model as unmodified.

## Form Grid Layout

Use `BwFormGrid` to create uniform layouts. It supports `Columns` (1-12) and adapts responsively to screen size.

```razor
<BwFormGrid Columns="3">
    <!-- Fields will automatically arrange in 3 columns -->
</BwFormGrid>
```
