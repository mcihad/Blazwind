# TimePicker (Saat Seçici)

Saat seçimi için kullanılan bileşen.

## Özellikler

*   **Format:** Saat ve dakika seçimi (24 saat formatı).
*   **Validasyon:** Standart validasyon desteği.

## Kullanım

```razor
<BwTimePicker Label="Başlangıç Saati" @bind-Value="startTime" />
```

### Validasyon

```razor
<BwTimePicker @bind-Value="model.Time" 
              For="@(() => model.Time)" 
              Label="Randevu Saati" />
```

> [!NOTE]
> Bu bileşen tarayıcının yerel saat seçicisini (`input type="time"`) kullanır. Görünüm kullanıcının tarayıcı ayarlarına bağlıdır, ancak `Value` her zaman `TimeSpan?` olarak iletilir.

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `TimeSpan?` | `null` | Seçili saat (Two-way binding). |
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
| `ValueChanged` | `TimeSpan?` | Saat değiştiğinde tetiklenir (Two-way binding). |
| `OnChange` | `TimeSpan?` | Değişiklik sonrası tetiklenir. |
| `OnFocus` | `FocusEventArgs` | Alan odaklandığında tetiklenir. |
| `OnBlur` | `FocusEventArgs` | Odak ayrıldığında tetiklenir. |
