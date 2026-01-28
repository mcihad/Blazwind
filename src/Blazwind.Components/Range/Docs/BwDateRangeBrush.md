```mdc
# BwDateRangeBrush (Zaman Serisi Aralık Seçici)

Zaman serisi verisi üzerinde tarih aralığı seçimi yapan bileşen. Finansal grafikler, analitik dashboardlar için ideal.

## Özellikler
*   **Zaman Serisi:** Tarihli veriyi alan grafik olarak gösterir.
*   **Sürüklenebilir Seçim:** Grafik üzerinde tarih aralığı seçimi.
*   **Seçili Vurgulama:** Seçilen aralık vurgulanır.
*   **Tarih Etiketleri:** Seçilen tarih aralığını gösterir.

## Kullanım

### Temel Kullanım

```razor
<BwDateRangeBrush Data="salesByDate" 
                  Label="Satış Analizi" 
                  OnBrushChanged="OnBrushChanged" />

@code {
    private List<BwDateRangeBrush.TimeSeriesPoint> salesByDate = new()
    {
        new() { Date = DateTime.Today.AddDays(-6), Value = 150 },
        new() { Date = DateTime.Today.AddDays(-5), Value = 280 },
        new() { Date = DateTime.Today.AddDays(-4), Value = 310 }
    };
    
    private void OnBrushChanged(BrushChangedEventArgs<DateTime> e)
    {
        Console.WriteLine($"Aralık: {e.Start} - {e.End}");
    }
}
```

### Özelleştirilmiş Görünüm

```razor
<BwDateRangeBrush Data="stockPrices" 
                  Label="Hisse Fiyatları"
                  Color="BwColor.Success"
                  Height="100"
                  ShowDateLabels="true"
                  OnBrushChanged="OnBrushChanged" />
```

### Finansal Dashboard

```razor
<BwDateRangeBrush Data="revenueData" 
                  Label="Gelir Trendi"
                  FillArea="true"
                  ShowGrid="true" />
```

> [!IMPORTANT]
> Bu bileşen interaktif fırçalama (brushing) ve sürükleme özellikleri için dahili bir JavaScript modülü kullanır.

## Parametreler

| Parametre           | Tip                     | Varsayılan | Açıklama                                                    |
|:--------------------|:------------------------|:-----------|:------------------------------------------------------------|
| `Data`              | `List<TimeSeriesPoint>` | `null`     | Zaman serisi veri noktaları.                                |
| `MinDate`           | `DateTime`              | `-3 ay`    | Zaman çizelgesinin başlangıç tarihi.                        |
| `MaxDate`           | `DateTime`              | `Bugün`    | Zaman çizelgesinin bitiş tarihi.                            |
| `StartDate`         | `DateTime`              | `-1 ay`    | Başlangıç seçili tarih.                                     |
| `EndDate`           | `DateTime`              | `Bugün`    | Bitiş seçili tarih.                                         |
| `StepUnit`          | `DateStepUnit`          | `Day`      | Seçim adım birimi (`Hour`, `Day`, `Week`, `Month`, `Year`). |
| `StepValue`         | `int`                   | `1`        | Adım değeri.                                                |
| `Color`             | `BwColor`               | `Primary`  | Fırça ve grafik vurgu rengi.                                |
| `Height`            | `int`                   | `80`       | Bileşen yüksekliği (px).                                    |
| `ShowTimeline`      | `bool`                  | `true`     | Mini grafik önizlemesini gösterir.                          |
| `ShowDateMarkers`   | `bool`                  | `true`     | Alt kısımdaki tarih işaretçilerini gösterir.                |
| `ShowSelectedRange` | `bool`                  | `true`     | Seçili aralık özetini gösterir.                             |
| `Label`             | `string`                | `null`     | Alan etiketi.                                               |
| `Presets`           | `List<DateBrushPreset>` | `null`     | Hızlı seçim seçenekleri.                                    |

## Olaylar (Events)

| Olay             | Paylaşım (Payload)                | Açıklama                                 |
|:-----------------|:----------------------------------|:-----------------------------------------|
| `OnBrushChanged` | `BrushChangedEventArgs<DateTime>` | Fırça alanı her değiştiğinde tetiklenir. |

## Yardımcı Sınıflar

```csharp
public class TimeSeriesPoint
{
    public DateTime Date { get; set; }
    public double Value { get; set; }
}

public class DateBrushPreset
{
    public string Label { get; set; } = "";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
```

## Kullanım Senaryoları

- **Finansal Grafikler:** Hisse senedi, kripto para grafikleri
- **Analitik Dashboard:** Web sitesi trafiği, satış analizi
- **Raporlama:** Dönemsel raporlar için tarih seçimi
- **Trend Analizi:** Uzun vadeli trend inceleme

```
