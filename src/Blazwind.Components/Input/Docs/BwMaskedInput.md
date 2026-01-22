# MaskedInput (Maskeli Giriş)

Telefon, Tarih, Kredi Kartı gibi formatlı veri girişi sağlayan bileşen. `BwBaseInput` özelliklerini taşır.

## Özellikler
*   **Hazır Maskeler:** `BwMaskPreset` ile yaygın formatlar (Phone, Date, CreditCard, IBAN).
*   **Özel Maske:** `#` (sayı), `A` (harf), `*` (hepsi) karakterleri ile özel maske tanımlama.

## Kullanım

### Hazır Maske (Telefon)
```razor
<BwMaskedInput Label="Telefon" Preset="BwMaskPreset.Phone" @bind-Value="phone" />
```

### Özel Maske (Plaka)
```razor
<BwMaskedInput Label="Plaka" Mask="## AA ####" Placeholder="34 AB 1234" />
```

### Otomatik Validasyon
```razor
<BwMaskedInput @bind-Value="form.Phone" 
               For="@(() => form.Phone)"
               Label="Telefon"
               Preset="BwMaskPreset.Phone" />
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `string` | `null` | Giriş değeri (Two-way binding). |
| `Mask` | `string` | `""` | Maske şablonu (örn: `(###) ### ## ##`). |
| `Preset` | `BwMaskPreset?` | `null` | Ön tanımlı maskeler (`Phone`, `CreditCard`, `Date`, `Time`, `Iban`). |
| `MaskChar` | `char` | `'_'` | Boş kutular için gösterilecek karakter. |
| `UnmaskValue` | `bool` | `true` | `true` ise `Value` sadece ham karakterleri döner; `false` ise maske sabitlerini de içerir. |
| `Placeholder` | `string` | `null` | Yer tutucu (belirtilmezse maskeden üretilir). |
| `Label` | `string` | `null` | Alan etiketi. |
| `Size` | `BwSize` | `Medium` | Boyut. |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |
| `For` | `Expression` | `null` | Validasyon için alan referansı. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `string` | Değer her değiştiğinde tetiklenir (Two-way binding). |
| `OnChange` | `string` | Değişiklik sonrası tetiklenir. |
| `OnEnter` | `null` | Enter tuşuna basıldığında tetiklenir. |

## Maske Karakterleri

| Karakter | Açıklama |
| :--- | :--- |
| `#` | Sadece rakam (0-9) |
| `A` | Sadece harf (a-z, A-Z) |
| `*` | Harf veya rakam |
| Diğer | Sabit literatür karakterleri (boşluk, tire, parantez vb.) |
