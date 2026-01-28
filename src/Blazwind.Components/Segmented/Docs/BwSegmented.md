# BwSegmented

Radio butonların daha modern bir alternatifi olan segmented kontrol bileşeni.

## Özellikler

- Tek seçimli segment grubu
- İkon desteği
- Devre dışı bırakılabilir seçenekler
- Boyut ve renk varyantları
- Animasyonlu geçiş efekti

## Kullanım

```razor
<BwSegmented @bind-Value="_selected" Options="_options" />

@code {
    private string _selected = "daily";
    
    private List<SegmentedOption> _options = new()
    {
        new() { Label = "Günlük", Value = "daily" },
        new() { Label = "Haftalık", Value = "weekly" },
        new() { Label = "Aylık", Value = "monthly" }
    };
}
```

## Parametreler

### BwSegmented

| Parametre    | Tip                     | Varsayılan | Açıklama                                         |
|:-------------|:------------------------|:-----------|:-------------------------------------------------|
| `Value`      | `object`                | -          | Seçili seçenek değeri (Two-way binding).         |
| `Options`    | `List<SegmentedOption>` | `new()`    | Seçenek listesi.                                 |
| `Color`      | `BwColor`               | `Primary`  | Seçili durumdaki renk.                           |
| `Size`       | `BwSize`                | `Medium`   | Boyut (`Small`, `Medium`, `Large`).              |
| `Variant`    | `BwVariant`             | `Filled`   | Görünüm varyantı (`Filled`, `Outline`, `Ghost`). |
| `IsDisabled` | `bool`                  | `false`    | Tüm bileşeni devre dışı bırakır.                 |
| `Class`      | `string`                | `null`     | Ek CSS sınıfları.                                |

### SegmentedOption

| Özellik      | Tip      | Açıklama                                    |
|:-------------|:---------|:--------------------------------------------|
| `Label`      | `string` | Buton metni.                                |
| `Value`      | `object` | Seçildiğinde atanacak değer.                |
| `Icon`       | `string` | Metnin yanındaki ikon (isteğe bağlı).       |
| `IsDisabled` | `bool`   | Seçeneği devre dışı bırakır (isteğe bağlı). |

## Olaylar (Events)

| Olay           | Paylaşım (Payload) | Açıklama                                         |
|:---------------|:-------------------|:-------------------------------------------------|
| `ValueChanged` | `object`           | Seçim değiştiğinde tetiklenir (Two-way binding). |
| `OnChange`     | `SegmentedOption`  | Seçim sonrası seçilen öğe nesnesiyle tetiklenir. |

## Örnekler

### Temel Kullanım

```razor
<BwSegmented @bind-Value="_view" Options="_viewOptions" />

@code {
    private string _view = "list";
    
    private List<SegmentedOption> _viewOptions = new()
    {
        new() { Label = "Liste", Value = "list" },
        new() { Label = "Izgara", Value = "grid" },
        new() { Label = "Tablo", Value = "table" }
    };
}
```

### İkon ile Kullanım

```razor
<BwSegmented @bind-Value="_mode" Options="_modeOptions" />

@code {
    private string _mode = "light";
    
    private List<SegmentedOption> _modeOptions = new()
    {
        new() { Label = "Açık", Value = "light", Icon = "fa-solid fa-sun" },
        new() { Label = "Koyu", Value = "dark", Icon = "fa-solid fa-moon" },
        new() { Label = "Sistem", Value = "system", Icon = "fa-solid fa-desktop" }
    };
}
```

### Devre Dışı Seçenek

```razor
<BwSegmented @bind-Value="_plan" Options="_planOptions" />

@code {
    private List<SegmentedOption> _planOptions = new()
    {
        new() { Label = "Ücretsiz", Value = "free" },
        new() { Label = "Pro", Value = "pro" },
        new() { Label = "Kurumsal", Value = "enterprise", IsDisabled = true }
    };
}
```
