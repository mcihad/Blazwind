# Switch (Anahtar)

On/Off durum değiştirmek için kullanılan anahtar bileşeni.

## Özellikler

*   **Görünüm:** Modern toggle switch tasarımı.
*   **Boyutlar:** Small, Medium, Large.
*   **Renk:** Aktif durum için renk seçeneği.

## Kullanım

```razor
<BwSwitch Label="Bildirimleri Aç" @bind-Value="notificationsEnabled" />
```

### Renkli

```razor
<BwSwitch Label="Karanlık Mod" Color="BwColor.Dark" @bind-Value="isDarkMode" />
```

### Validasyon

```razor
<BwSwitch @bind-Value="model.IsActive" 
          For="@(() => model.IsActive)" 
          Label="Hesap Aktif" />
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `bool` | `false` | Anahtar durumu (Two-way binding). |
| `Label` | `string` | `null` | Kutunun yanındaki etiket metni. |
| `ChildContent` | `RenderFragment` | `null` | Etiket yerine geçebilecek özel içerik. |
| `Color` | `BwColor` | `Primary` | Aktif (On) durumdaki renk. |
| `Size` | `BwSize` | `Medium` | Boyut (`Small`, `Medium`, `Large`). |
| `IsRequired` | `bool` | `false` | Zorunlu alan işaretini gösterir. |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |
| `HelperText` | `string` | `null` | Yardımcı metin. |
| `IsValid` | `bool` | `true` | Manuel validasyon durumu. |
| `ErrorMessage` | `string` | `null` | Manuel hata mesajı. |
| `For` | `Expression<Func<bool>>` | `null` | Otomatik validasyon için boolean alan referansı. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `bool` | Durum değiştiğinde tetiklenir (Two-way binding). |
| `IsCheckedChanged` | `bool` | `ValueChanged` ile aynı anda tetiklenir. |
| `OnChange` | `bool` | Değişiklik sonrası tetiklenir. |
