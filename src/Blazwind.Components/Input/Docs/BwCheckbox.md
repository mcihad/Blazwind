# Checkbox (Onay Kutusu)

İkili (boolean) durum seçimi için kullanılan bileşen.

## Özellikler

*   **Boyutlar:** Small, Medium, Large.
*   **Renk:** Primary, Success, Danger vb. renk desteği.
*   **Validasyon:** `For` ile boolean validasyon (örn: Kullanım şartlarını kabul).

## Kullanım

```razor
<BwCheckbox Label="Beni hatırla" @bind-Value="rememberMe" />
```

### Renkli ve Boyutlu

```razor
<BwCheckbox Label="Onaylıyorum" 
            Color="BwColor.Success" 
            Size="BwSize.Large" 
            @bind-Value="isApproved" />
```

### Validasyon

```razor
<BwCheckbox Label="Koşulları kabul ediyorum" 
            @bind-Value="model.AcceptTerms" 
            For="@(() => model.AcceptTerms)" />
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `bool` | `false` | Seçim durumu (Two-way binding). |
| `Label` | `string` | `null` | Kutunun yanındaki etiket metni. |
| `ChildContent` | `RenderFragment` | `null` | Etiket yerine geçebilecek özel içerik. |
| `Color` | `BwColor` | `Primary` | Aktif durumdaki renk. |
| `Size` | `BwSize` | `Medium` | Boyut (`Small`, `Medium`, `Large`). |
| `IsRequired` | `bool` | `false` | Zorunlu alan işaretini gösterir. |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |
| `HelperText` | `string` | `null` | Yardımcı metin. |
| `IsValid` | `bool` | `true` | Manuel validasyon durumu. |
| `ErrorMessage` | `string` | `null` | Manuel hata mesajı. |
| `For` | `Expression<Func<bool>>` | `null` | Otomatik validasyon için boolean alan referansı (örn: Sözleşme onayı). |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `bool` | Durum değiştiğinde tetiklenir (Two-way binding). |
| `IsCheckedChanged` | `bool` | `ValueChanged` ile aynı anda tetiklenir. |
| `OnChange` | `bool` | Değişiklik sonrası tetiklenir. |
