# Slider (Kaydırıcı)

Sayısal değerleri kaydırarak seçmek için kullanılan bileşen.

## Özellikler

*   **Aralık:** `Min`, `Max` ve `Step` ayarları.
*   **Değer Gösterimi:** `ShowValue` ile anlık değer gösterimi.
*   **Format:** `ValueFormat` ile sayı formatı (örn: C2, N0).

## Kullanım

```razor
<BwSlider Label="Ses Seviyesi" @bind-Value="volume" Min="0" Max="100" />
```

### Adımlı ve Değer Gösterimli

```razor
<BwSlider Label="Fiyat" 
          Min="0" Max="1000" Step="50" 
          ShowValue="true" 
          ValueFormat="C0" 
          @bind-Value="price" />
```

### Validasyon

```razor
<BwSlider @bind-Value="model.Age" 
          For="@(() => model.Age)" 
          Label="Yaş" 
          Min="18" Max="99" />
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `double` | `0` | Mevcut değer (Two-way binding). |
| `Min` | `double` | `0` | Minimum değer. |
| `Max` | `double` | `100` | Maksimum değer. |
| `Step` | `double` | `1` | Artış adımı. |
| `ShowValue` | `bool` | `true` | Güncel değeri etiket yanında gösterir. |
| `ValueFormat` | `string` | `"0"` | Değer gösterim formatı (C# format string). |
| `ShowMarks` | `bool` | `false` | Grafik altında değer işaretçilerini gösterir. |
| `Marks` | `double[]` | `null` | Gösterilecek özel değer işaretleri listesi. |
| `Color` | `BwColor` | `Primary` | Dolgu rengi. |
| `Size` | `BwSize` | `Medium` | Kaydırıcı ve tutamak boyutu. |
| `Label` | `string` | `null` | Alan etiketi. |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |
| `For` | `Expression` | `null` | Validasyon için alan referansı. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `double` | Değer her değiştiğinde tetiklenir (Two-way binding). |
| `OnChange` | `double` | Değişim bittiğinde tetiklenir. |
