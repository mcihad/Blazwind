```mdc
# BwRangeBrush (Aralık Fırça Seçici)

Finansal grafiklerdeki gibi sürüklenebilir aralık seçimi bileşeni. Görsel olarak veri aralığı seçmeyi sağlar.

## Özellikler
*   **Sürüklenebilir Handles:** Sol ve sağ tutamaçlar ile aralık seçimi.
*   **Bölge Sürükleme:** Seçili alanın tamamını kaydırma.
*   **Yüzde Tabanlı:** Yüzde olarak pozisyon bildirimi.
*   **Klavye Desteği:** Ok tuşları ile ince ayar.

## Kullanım

### Temel Kullanım
```razor
<BwRangeBrush Start="0" 
              End="100" 
              OnBrushChanged="OnBrushChanged" />

@code {
    private void OnBrushChanged(BrushChangedEventArgs e)
    {
        Console.WriteLine($"Aralık: %{e.StartPercent:F1} - %{e.EndPercent:F1}");
    }
}
```

### Başlangıç Değerleri ile
```razor
<BwRangeBrush Start="10" 
              End="90" 
              StartPercent="20" 
              EndPercent="80" 
              OnBrushChanged="OnBrushChanged" />
```

### ChildContent ile Özelleştirilmiş
```razor
<BwRangeBrush Start="0" End="100" OnBrushChanged="OnBrushChanged">
    <div class="h-16 bg-gradient-to-r from-blue-200 to-blue-400 rounded"></div>
</BwRangeBrush>
```

> [!IMPORTANT]
> Bu bileşen interaktif fırçalama (brushing) ve sürükleme özellikleri için dahili bir JavaScript modülü kullanır.

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `StartPercent` | `double` | `0` | Başlangıç yüzdesi (0-100, Two-way binding). |
| `EndPercent` | `double` | `100` | Bitiş yüzdesi (0-100, Two-way binding). |
| `Start` | `double` | `0` | Minimum ham değer. |
| `End` | `double` | `100` | Maksimum ham değer. |
| `Color` | `BwColor` | `Primary` | Vurgu rengi. |
| `Label` | `string` | `null` | Alan etiketi. |
| `MinWidthPercent` | `double` | `5` | Seçili alanın minimum genişliği (%). |
| `ChildContent` | `RenderFragment` | `null` | Fırçalanacak görsel içerik (grafik vb.). |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `StartPercentChanged` | `double` | Başlangıç yüzdesi değiştiğinde tetiklenir. |
| `EndPercentChanged` | `double` | Bitiş yüzdesi değiştiğinde tetiklenir. |
| `OnBrushChanged` | `BrushChangedEventArgs` | Fırça alanı her değiştiğinde tetiklenir. |

## Yardımcı Sınıflar

```csharp
public class BrushChangedEventArgs : EventArgs
{
    public double StartPercent { get; set; }
    public double EndPercent { get; set; }
}
```

## Klavye Kısayolları
| Tuş | Açıklama |
| :--- | :--- |
| `←` | Sol handle'ı sola kaydır |
| `→` | Sağ handle'ı sağa kaydır |
| `Shift + ←` | Tüm aralığı sola kaydır |
| `Shift + →` | Tüm aralığı sağa kaydır |
```
