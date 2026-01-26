# Input Bileşenleri - Ortak Özellikler

Tüm Blazwind input bileşenlerinde bulunan ortak parametreler ve form entegrasyonu özellikleri.

## For Parametresi (Otomatik Validasyon)

Tüm input bileşenlerinde `For` parametresi ile EditContext'e bağlanarak otomatik validation mesajı gösterimi sağlanır.

```razor
<BwForm Model="@_model" OnValidSubmit="HandleSubmit">
    <BwInput @bind-Value="_model.Email" 
             For="@(() => _model.Email)"
             Label="E-posta" />
</BwForm>
```

### Nasıl Çalışır?

1. `For` parametresi `Expression<Func<TValue>>` tipindedir
2. `BwForm` içindeki `EditContext` cascade olarak iletilir
3. Validation değişikliklerinde input otomatik güncellenir
4. Hata mesajları input altında gösterilir



### Desteklenen Bileşenler

Aşağıdaki tablo, ortak özelliklerin hangi bileşenlerde tam olarak desteklendiğini gösterir.

| Bileşen | `For` (Validasyon) | `LabelPosition` | `Density` |
|---------|------------------|-----------------|-----------|
| BwInput | ✓ | ✓ (Top/Left/Floating/Hidden) | ✓ |
| BwSelect | ✓ | ✓ (Top/Left/Hidden) | ✓ |
| BwTextarea | ✓ | ✓ (Top/Left/Hidden) | ✓ |
| BwDatePicker | ✓ | ✓ (Top/Left/Floating/Hidden) | ✓ |
| BwMaskedInput | ✓ | ✓ (Top/Left/Floating/Hidden) | ✓ |
| BwSlider | ✓ | ✓ (Inline) | ✓ |
| BwCheckbox | ✓ | - | ✓ |
| BwSwitch | ✓ | - | ✓ |
| BwRating | ✓ | - | - |
| BwRadioGroup<T> | ✓ | - | - |
| BwColorPicker | ✓ | - | - |
| BwTagInput | ✓ | - | - |
| BwAutocomplete<T> | `For` / `ForMultiple` | - | - |
| BwTransfer<T> | ✓ | - | - |
| BwTimePicker | ✓ | - | - |
| BwFileUpload | - | - | - |

---

## LabelPosition (5 bileşende)

Label pozisyonunu kontrol eder. `BwForm`'dan cascade edilir veya bileşende override edilebilir.

```razor
<!-- Form'dan cascade -->
<BwForm Model="@_model" LabelPosition="BwLabelPosition.Left">
    <BwInput @bind-Value="_model.Name" Label="Ad" />
</BwForm>

<!-- Bileşende override -->
<BwInput @bind-Value="_model.Name" 
         Label="Ad" 
         LabelPosition="BwLabelPosition.Top" />
```

### Değerler

| Değer | Açıklama |
|-------|----------|
| `Top` | Label üstte (varsayılan) |
| `Left` | Label solda, `LabelWidth` ile genişlik |
| `Floating` | Material-style floating label |
| `Hidden` | Label gizli, aria-label kullanılır |

---

## Density (5 bileşende)

Form spacing'ini kontrol eder. `BwForm`'dan cascade edilir.

```razor
<BwForm Model="@_model" Density="BwFormDensity.Compact">
    <BwInput @bind-Value="_model.Field1" Label="Alan 1" />
    <BwInput @bind-Value="_model.Field2" Label="Alan 2" />
</BwForm>
```

### Değerler

| Değer | Margin | Kullanım |
|-------|--------|----------|
| `Compact` | `mb-2` | Yoğun formlar (50+ alan) |
| `Normal` | `mb-4` | Standart formlar |
| `Relaxed` | `mb-6` | Geniş, rahat spacing |

---

## Ortak Parametreler

Tüm input bileşenlerinde bulunan standart parametreler:

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| `Label` | `string?` | Alan etiketi |
| `HelperText` | `string?` | Yardımcı metin |
| `Error` | `string?` | Manuel hata mesajı |
| `IsDisabled` | `bool` | Disabled durumu |
| `IsRequired` | `bool` | Zorunlu göstergesi (*) |
| `Size` | `BwSize` | Small / Medium / Large |
| `Class` | `string?` | Ek CSS sınıfları |

---

## Güvenlik ve Veri Doğrulama

`BwBaseInput` bileşenleri HTML encode veya sanitizasyon uygulamaz. Bu nedenle:

- Sunucu tarafında doğrulama/sanitizasyon uygulayın.
- Kullanıcı girdisini HTML olarak render edecekseniz güvenli encode edin.
- Blazor varsayılan olarak metinleri HTML-encode eder; `MarkupString` kullanıyorsanız güvenlik sorumluluğu sizdedir.

## Cascading Parameters

`BwForm` aşağıdaki parametreleri cascade eder:

```csharp
[CascadingParameter] EditContext? CascadedEditContext
[CascadingParameter] BwLabelPosition? CascadedLabelPosition
[CascadingParameter] BwFormDensity? CascadedDensity
```

Input bileşenlerinde öncelik sırası:
1. Bileşen parametresi (override)
2. Cascade value (BwForm'dan)
3. Varsayılan değer

---

## Örnek: Tam Form

```razor
@code {
    private UserModel _model = new();
    
    public class UserModel
    {
        [Required(ErrorMessage = "Ad zorunlu")]
        public string? Name { get; set; }
        
        [EmailAddress(ErrorMessage = "Geçerli e-posta girin")]
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
                 Label="Ad" 
                 IsRequired="true" />
                 
        <BwInput @bind-Value="_model.Email" 
                 For="@(() => _model.Email)"
                 Label="E-posta" 
                 Type="email" />
    </BwFormGrid>
    
    <BwFormActions>
        <BwButton Text="Kaydet" HtmlType="submit" Color="BwColor.Primary" />
    </BwFormActions>
</BwForm>
```
