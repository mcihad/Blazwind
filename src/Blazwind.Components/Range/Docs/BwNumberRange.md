```mdc
# BwNumberRange (Sayı Aralığı Seçici)

İki sayı girişi ve opsiyonel slider ile sayı aralığı seçmeyi sağlayan bileşen.

## Özellikler
*   **Giriş:** İki adet sayı input alanı.
*   **Slider:** Opsiyonel görsel slider.
*   **Presets:** Hızlı seçim butonları.
*   **Özelleştirme:** Prefix/Suffix desteği.

## Kullanım

### Temel Kullanım
```razor
<BwNumberRange Min="0" Max="10000" Start="1000" End="5000" 
               Label="Fiyat Filtresi" 
               OnRangeChanged="OnChanged" />
```

### Slider ile
```razor
<BwNumberRange Min="0" Max="100" Start="18" End="65" 
               Label="Yaş Aralığı" 
               ShowSlider="true" />
```

### Preset'ler ile
```razor
<BwNumberRange Min="0" Max="10000" Start="0" End="2000" 
               Label="Bütçe" 
               Presets="presets" />

@code {
    private List<BwNumberRange.NumberRangePreset> presets = new()
    {
        new() { Label = "Düşük", Start = 0, End = 2000 },
        new() { Label = "Orta", Start = 2000, End = 5000 },
        new() { Label = "Yüksek", Start = 5000, End = 10000 }
    };
}
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Start` | `double` | `0` | Başlangıç değeri (Two-way binding). |
| `End` | `double` | `100` | Bitiş değeri (Two-way binding). |
| `Min` | `double` | `0` | Minimum değer. |
| `Max` | `double` | `1000` | Maksimum değer. |
| `Step` | `double` | `1` | Artış miktarı. |
| `Label` | `string` | `null` | Alan etiketi. |
| `Prefix` | `string` | `null` | Değer başındaki sembol (örn: `₺`). |
| `Suffix` | `string` | `null` | Değer sonundaki sembol (örn: `TL`). |
| `ShowSlider` | `bool` | `true` | İki sayı kutusu arasında slider gösterir. |
| `Color` | `BwColor` | `Primary` | Slider ve buton vurgu rengi. |
| `Presets` | `List<NumberRangePreset>` | `null` | Hızlı seçim seçenekleri. |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `StartChanged` | `double` | Başlangıç değeri değiştiğinde tetiklenir. |
| `EndChanged` | `double` | Bitiş değeri değiştiğinde tetiklenir. |
| `OnRangeChanged` | `RangeChangedEventArgs<double>` | Aralık değiştiğinde tetiklenir. |

## Yardımcı Sınıflar

```csharp
public class NumberRangePreset
{
    public string Label { get; set; } = "";
    public double Start { get; set; }
    public double End { get; set; }
}
```
```
