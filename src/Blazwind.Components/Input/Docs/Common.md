# Input Components – Common Features

Common parameters and form integration features available in all Blazwind input components.

## For Parameter (Automatic Validation)

In all input components, the `For` parameter binds to the `EditContext` to enable automatic validation message display.

```razor
<BwForm Model="@_model" OnValidSubmit="HandleSubmit">
    <BwInput @bind-Value="_model.Email" 
             For="@(() => _model.Email)"
             Label="Email" />
</BwForm>
```

### How It Works

1. The `For` parameter is of type `Expression<Func<TValue>>`
2. The `EditContext` inside `BwForm` is provided via cascading
3. Inputs automatically update on validation changes
4. Error messages are displayed under the input

### Supported Components

The table below shows which components fully support the common features.

| Component         | `For` (Validation)    | `LabelPosition`              | `Density` |
| ----------------- | --------------------- | ---------------------------- | --------- |
| BwInput           | ✓                     | ✓ (Top/Left/Floating/Hidden) | ✓         |
| BwSelect          | ✓                     | ✓ (Top/Left/Hidden)          | ✓         |
| BwTextarea        | ✓                     | ✓ (Top/Left/Hidden)          | ✓         |
| BwDatePicker      | ✓                     | ✓ (Top/Left/Floating/Hidden) | ✓         |
| BwMaskedInput     | ✓                     | ✓ (Top/Left/Floating/Hidden) | ✓         |
| BwSlider          | ✓                     | ✓ (Inline)                   | ✓         |
| BwCheckbox        | ✓                     | -                            | ✓         |
| BwSwitch          | ✓                     | -                            | ✓         |
| BwRating          | ✓                     | -                            | -         |
| BwRadioGroup<T>   | ✓                     | -                            | -         |
| BwColorPicker     | ✓                     | -                            | -         |
| BwTagInput        | ✓                     | -                            | -         |
| BwAutocomplete<T> | `For` / `ForMultiple` | -                            | -         |
| BwTransfer<T>     | ✓                     | -                            | -         |
| BwTimePicker      | ✓                     | -                            | -         |
| BwFileUpload      | -                     | -                            | -         |

---

## LabelPosition (5 components)

Controls label position. Cascaded from `BwForm` or overridden on the component.

```razor
<!-- Cascaded from form -->
<BwForm Model="@_model" LabelPosition="BwLabelPosition.Left">
    <BwInput @bind-Value="_model.Name" Label="Name" />
</BwForm>

<!-- Overridden on component -->
<BwInput @bind-Value="_model.Name" 
         Label="Name" 
         LabelPosition="BwLabelPosition.Top" />
```

### Values

| Value      | Description                                         |
| ---------- | --------------------------------------------------- |
| `Top`      | Label on top (default)                              |
| `Left`     | Label on the left, width controlled by `LabelWidth` |
| `Floating` | Material-style floating label                       |
| `Hidden`   | Label hidden, uses aria-label                       |

---

## Density (5 components)

Controls form spacing. Cascaded from `BwForm`.

```razor
<BwForm Model="@_model" Density="BwFormDensity.Compact">
    <BwInput @bind-Value="_model.Field1" Label="Field 1" />
    <BwInput @bind-Value="_model.Field2" Label="Field 2" />
</BwForm>
```

### Values

| Value     | Margin | Usage                     |
| --------- | ------ | ------------------------- |
| `Compact` | `mb-2` | Dense forms (50+ fields)  |
| `Normal`  | `mb-4` | Standard forms            |
| `Relaxed` | `mb-6` | Spacious, relaxed spacing |

---

## Common Parameters

Standard parameters available in all input components:

| Parameter    | Type      | Description            |
| ------------ | --------- | ---------------------- |
| `Label`      | `string?` | Field label            |
| `HelperText` | `string?` | Helper text            |
| `Error`      | `string?` | Manual error message   |
| `IsDisabled` | `bool`    | Disabled state         |
| `IsRequired` | `bool`    | Required indicator (*) |
| `Size`       | `BwSize`  | Small / Medium / Large |
| `Class`      | `string?` | Additional CSS classes |

---

## Cascading Parameters

`BwForm` cascades the following parameters:

```csharp
[CascadingParameter] EditContext? CascadedEditContext
[CascadingParameter] BwLabelPosition? CascadedLabelPosition
[CascadingParameter] BwFormDensity? CascadedDensity
```

Input component precedence order:

1. Component parameter (override)
2. Cascaded value (from `BwForm`)
3. Default value

---

## Example: Full Form

```razor
@code {
    private UserModel _model = new();
    
    public class UserModel
    {
        [Required(ErrorMessage = "Name is required")]
        public string? Name { get; set; }
        
        [EmailAddress(ErrorMessage = "Enter a valid email")]
        public string? Email { get; set; }
        
        [Range(18, 120)]
        public int Age { get; set; }
    }
}

<BwForm Model="@_model" 
        OnValidSubmit="HandleSubmit"
        LabelPosition="BwLabelPosition.Top"
        Density="BwFormDensity.Normal">
        
    <BwFormGrid Columns="2">
        <BwInput @bind-Value="_model.Name" 
                 For="@(() => _model.Name)"
                 Label="Name" 
                 IsRequired="true" />
                 
        <BwInput @bind-Value="_model.Email" 
                 For="@(() => _model.Email)"
                 Label="Email" 
                 Type="email" />
    </BwFormGrid>
    
    <BwFormActions>
        <BwButton Text="Save" HtmlType="submit" Color="BwColor.Primary" />
    </BwFormActions>
</BwForm>
```