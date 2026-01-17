# Textarea (Çok Satırlı Giriş)

Uzun metin girişleri için kullanılan bileşendir. `BwBaseInput` özelliklerini taşır ve otomatik validasyon destekler.

## Özellikler

*   **Otomatik Boyutlandırma:** `AutoResize` özelliği ile içerik girildikçe yükseklik artar.
*   **Sayaç:** `MaxLength` belirlendiğinde karakter sayacı gösterir.
*   **Satır Kontrolü:** `Rows`, `MinRows`, `MaxRows` ile satır sayısı yönetimi.

## Kullanım

### Temel Kullanım

```razor
<BwTextarea Label="Açıklama" Placeholder="Detayları buraya yazınız..." Rows="4" />
```

### Otomatik Boyutlandırma (AutoResize)

```razor
<BwTextarea Label="Yorum" AutoResize="true" MinRows="2" MaxRows="5" />
```

### Karakter Sınırlaması

```razor
<BwTextarea Label="Kısa Özgeçmiş" MaxLength="200" ShowCounter="true" />
```

### Otomatik Validasyon

```razor
<BwTextarea @bind-Value="form.Description" For="@(() => form.Description)" Label="Açıklama" />
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `string` | `null` | Metin değeri (Two-way binding). |
| `Label` | `string` | `null` | Alan etiketi. |
| `Placeholder` | `string` | `null` | Yer tutucu metin. |
| `Rows` | `int` | `3` | Görünür satır sayısı. |
| `AutoResize` | `bool` | `false` | İçeriğe göre otomatik yükseklik ayarı. |
| `MinRows` | `int` | `2` | AutoResize için minimum satır sayısı. |
| `MaxRows` | `int` | `10` | AutoResize için maksimum satır sayısı. |
| `MaxLength` | `int?` | `null` | Maksimum karakter sayısı. |
| `ShowCounter` | `bool` | `true` | Karakter sayacı gösterimi (`MaxLength` varsa). |
| `LabelPosition` | `BwLabelPosition` | `Top` | Etiket konumu (`Top`, `Left`, `Hidden`). |
| `HelpTextMode` | `BwHelpTextMode` | `Inline` | Yardım metni konumu (`Inline`, `Popup`). |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |
| `IsReadOnly` | `bool` | `false` | Sadece okunabilir yapar. |
| `IsRequired` | `bool` | `false` | Zorunlu işaretini (*) gösterir. |
| `IsValid` | `bool` | `true` | Manuel validasyon durumu. |
| `ErrorMessage` | `string` | `null` | Manuel hata mesajı. |
| `For` | `Expression<Func<string>>` | `null` | Otomatik validasyon için alan referansı. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `string` | Değer her değiştiğinde tetiklenir. |
| `OnChange` | `string` | Değer değiştiğinde veya alan blur olduğunda tetiklenir. |
| `OnInput` | `ChangeEventArgs` | Her tuş vuruşunda tetiklenir. |
