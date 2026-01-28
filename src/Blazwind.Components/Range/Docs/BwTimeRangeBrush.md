```mdc
# BwTimeRangeBrush (Günlük Aktivite Aralık Seçici)

Günlük aktivite verisi üzerinde saat aralığı seçimi yapan bileşen. 24 saatlik aktivite görselleştirmesi.

## Özellikler
*   **24 Saat Görünüm:** Günün tüm saatlerini bar olarak gösterir.
*   **Aktivite Yoğunluğu:** Saatlik aktivite yoğunluğunu gösterir.
*   **Sürüklenebilir Seçim:** Saat aralığı seçimi.
*   **Saat Etiketleri:** Seçilen saat aralığını gösterir.

## Kullanım

### Temel Kullanım
```razor
<BwTimeRangeBrush Data="hourlyActivity" 
                  Label="Günlük Aktivite" 
                  OnBrushChanged="OnBrushChanged" />

@code {
    private List<BwTimeRangeBrush.TimeActivityPoint> hourlyActivity = Enumerable.Range(0, 24)
        .Select(h => new BwTimeRangeBrush.TimeActivityPoint { 
            Time = TimeSpan.FromHours(h), 
            Value = GetActivityLevel(h) 
        })
        .ToList();
    
    private static double GetActivityLevel(int hour) => hour switch
    {
        >= 9 and <= 17 => Random.Shared.Next(60, 100),  // Mesai saatleri
        >= 6 and <= 8 => Random.Shared.Next(30, 60),    // Sabah
        >= 18 and <= 22 => Random.Shared.Next(20, 50),  // Akşam
        _ => Random.Shared.Next(0, 20)                   // Gece
    };
    
    private void OnBrushChanged(BrushChangedEventArgs<TimeSpan> e)
    {
        Console.WriteLine($"Aralık: {e.Start} - {e.End}");
    }
}
```

### Özelleştirilmiş Görünüm

```razor
<BwTimeRangeBrush Data="serverLoad" 
                  Label="Sunucu Yükü"
                  Color="BwColor.Warning"
                  Height="100"
                  ShowTimeLabels="true"
                  OnBrushChanged="OnBrushChanged" />
```

### Karşılaştırma Görünümü

```razor
<div class="space-y-4">
    <BwTimeRangeBrush Data="weekdayActivity" Label="Hafta İçi" Color="BwColor.Primary" />
    <BwTimeRangeBrush Data="weekendActivity" Label="Hafta Sonu" Color="BwColor.Success" />
</div>
```

> [!IMPORTANT]
> Bu bileşen interaktif fırçalama (brushing) ve sürükleme özellikleri için dahili bir JavaScript modülü kullanır.

## Parametreler

| Parametre           | Tip                       | Varsayılan | Açıklama                                    |
|:--------------------|:--------------------------|:-----------|:--------------------------------------------|
| `Data`              | `List<TimeActivityPoint>` | `null`     | Zaman bazlı aktivite veri noktaları.        |
| `MinTime`           | `TimeSpan`                | `00:00`    | Zaman çizelgesinin başlangıç saati.         |
| `MaxTime`           | `TimeSpan`                | `24:00`    | Zaman çizelgesinin bitiş saati.             |
| `StartTime`         | `TimeSpan`                | `09:00`    | Başlangıç seçili saat.                      |
| `EndTime`           | `TimeSpan`                | `17:00`    | Bitiş seçili saat.                          |
| `Step`              | `TimeSpan`                | `15 dk`    | Seçim adım hassasiyeti.                     |
| `Color`             | `BwColor`                 | `Primary`  | Fırça ve grafik vurgu rengi.                |
| `Height`            | `int`                     | `60`       | Bileşen yüksekliği (px).                    |
| `ShowActivityChart` | `bool`                    | `true`     | Aktivite grafik önizlemesini gösterir.      |
| `ShowTimeScale`     | `bool`                    | `true`     | Alt kısımdaki saat işaretçilerini gösterir. |
| `ShowQuarterMarks`  | `bool`                    | `true`     | Çeyrek saat işaretçilerini gösterir.        |
| `ShowSelectedRange` | `bool`                    | `true`     | Seçili aralık özetini gösterir.             |
| `Label`             | `string`                  | `null`     | Alan etiketi.                               |
| `Presets`           | `List<TimeBrushPreset>`   | `null`     | Hızlı seçim seçenekleri.                    |

## Olaylar (Events)

| Olay             | Paylaşım (Payload)                | Açıklama                                 |
|:-----------------|:----------------------------------|:-----------------------------------------|
| `OnBrushChanged` | `BrushChangedEventArgs<TimeSpan>` | Fırça alanı her değiştiğinde tetiklenir. |

## Yardımcı Sınıflar

```csharp
public class TimeActivityPoint
{
    public TimeSpan Time { get; set; }
    public double Value { get; set; }
}

public class TimeBrushPreset
{
    public string Label { get; set; } = "";
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}
```

## Kullanım Senaryoları

- **Sunucu İzleme:** CPU, bellek kullanımı saatlik görünümü
- **Web Analitiği:** Ziyaretçi yoğunluğu saatlik dağılımı
- **Çalışan Aktivitesi:** Mesai saatleri analizi
- **Müşteri Hizmetleri:** Çağrı yoğunluğu analizi

```
