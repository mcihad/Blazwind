# ColorPicker (Renk Seçici)

Renk seçimi için palet ve HEX girişi sunan bileşen.

## Kullanım

```razor
<BwColorPicker Label="Tema Rengi" @bind-Value="themeColor" />
<BwColorPicker Label="Sadece Palet" ShowInput="false" />
```

> [!NOTE]
> Bu bileşen tarayıcının yerel renk seçicisini (`input type="color"`) kullanır. Bazı tarayıcılar `PresetColors` parametresini farklı şekillerde (datalist olarak) destekleyebilir.

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `string` | `"#3B82F6"` | Seçili renk (HEX formatında, Two-way binding). |
| `Label` | `string` | `null` | Alan etiketi. |
| `ShowInput` | `bool` | `false` | Renk seçiminin yanında HEX değerini gösteren bir metin kutusu açar. |
| `PresetColors` | `string[]` | `null` | Hızlı seçim için ön tanımlı renk listesi (HEX). |
| `Size` | `BwSize` | `Medium` | Boyut. |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |
| `IsValid` | `bool` | `true` | Manuel validasyon durumu. |
| `ErrorMessage` | `string` | `null` | Manuel hata mesajı. |
| `For` | `Expression` | `null` | Validasyon için alan referansı. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `string` | Renk değiştiğinde tetiklenir (Two-way binding). |
| `OnChange` | `string` | Değişiklik sonrası tetiklenir. |
