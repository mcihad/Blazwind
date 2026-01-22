```mdc
# BwRange (Çift Thumb Aralık Seçici)

İki thumb ile başlangıç ve bitiş değeri seçmeyi sağlayan slider bileşeni.

## Özellikler
*   **Aralık:** `Min`, `Max`, `Step` ile aralık belirleme.
*   **Değer:** `Start` ve `End` ile başlangıç/bitiş değerleri.
*   **Görsellik:** Renk seçenekleri, tooltip ve seçim gösterimi.
*   **Olay:** `OnRangeChanged` ile değişiklik bildirimi.

## Kullanım

### Temel Kullanım
```razor
<BwRange Min="0" Max="100" Start="20" End="80" 
         Label="Fiyat Aralığı" 
         OnRangeChanged="OnRangeChanged" />
```

### Step Değeri ile
```razor
<BwRange Min="0" Max="1000" Start="100" End="500" Step="50" 
         Label="Bütçe (TL)" Color="BwColor.Success" />
```

### Tooltip ile
```razor
<BwRange Min="0" Max="100" Start="30" End="70" 
         ShowTooltip="true" Color="BwColor.Info" />
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Start` | `double` | `0` | Başlangıç thumb değeri (Two-way binding). |
| `End` | `double` | `100` | Bitiş thumb değeri (Two-way binding). |
| `Min` | `double` | `0` | Seçilebilecek minimum değer. |
| `Max` | `double` | `100` | Seçilebilecek maksimum değer. |
| `Step` | `double` | `1` | Artış adımı. |
| `ShowValues` | `bool` | `true` | Alt kısımda mevcut değerleri gösterir. |
| `ShowTooltip` | `bool` | `true` | Sürükleme sırasında değer baloncuğunu gösterir. |
| `Format` | `string` | `"0"` | Değer gösterim formatı. |
| `Color` | `BwColor` | `Primary` | Seçili alan ve thumb rengi. |
| `Label` | `string` | `null` | Alan etiketi. |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `StartChanged` | `double` | Başlangıç değeri değiştiğinde tetiklenir. |
| `EndChanged` | `double` | Bitiş değeri değiştiğinde tetiklenir. |
| `OnRangeChanged` | `RangeChangedEventArgs<double>` | Herhangi bir thumb değiştiğinde tetiklenir. |

## Yardımcı Sınıflar

```csharp
public class RangeChangedEventArgs<T>
{
    public T Start { get; set; }
    public T End { get; set; }
    public T Min { get; set; }
    public T Max { get; set; }
}
```
```
