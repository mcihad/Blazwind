# DatePicker (Tarih Seçici)

Tarih seçimi için kullanılan bileşen. Varsayılan olarak Türkçe (tr-TR) kültürünü kullanır.

## Özellikler

*   **Format:** Otomatik tarih formatlama.
*   **Aralık:** `Min` ve `Max` tarih kısıtlaması.
*   **Modlar:** Sadece tarih seçimi (Şimdilik).

## Kullanım

```razor
<BwDatePicker Label="Doğum Tarihi" @bind-Value="birthDate" />
```

### Aralık Kısıtlama

```razor
<BwDatePicker Label="Randevu Tarihi" 
              Min="@DateTime.Now" 
              Max="@DateTime.Now.AddDays(30)" />
```

### Validasyon

```razor
<BwDatePicker @bind-Value="model.Date" 
              For="@(() => model.Date)" 
              Label="İşlem Tarihi" />
```

> [!NOTE]
> Bu bileşen tarayıcının yerel tarih seçicisini (`input type="date"`) kullanır. Görünüm (takvim dili, tarih formatı) kullanıcının tarayıcı ayarlarına bağlıdır, ancak `Value` her zaman standart `DateTime` olarak iletilir.

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `DateTime?` | `null` | Seçili tarih (Two-way binding). |
| `Min` | `DateTime?` | `null` | Seçilebilecek en eski tarih. |
| `Max` | `DateTime?` | `null` | Seçilebilecek en yeni tarih. |
| `Label` | `string` | `null` | Alan etiketi. |
| `LabelPosition` | `BwLabelPosition` | `Top` | Etiket konumu (`Top`, `Left`, `Floating`, `Hidden`). |
| `Size` | `BwSize` | `Medium` | Boyut. |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |
| `IsReadOnly` | `bool` | `false` | Sadece okunabilir yapar. |
| `IsValid` | `bool` | `true` | Manuel validasyon durumu. |
| `ErrorMessage` | `string` | `null` | Manuel hata mesajı. |
| `For` | `Expression` | `null` | Validasyon için alan referansı. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `DateTime?` | Tarih değiştiğinde tetiklenir (Two-way binding). |
| `OnChange` | `DateTime?` | Değişiklik sonrası tetiklenir. |
| `OnFocus` | `FocusEventArgs` | Alan odaklandığında tetiklenir. |
| `OnBlur` | `FocusEventArgs` | Odak ayrıldığında tetiklenir.
