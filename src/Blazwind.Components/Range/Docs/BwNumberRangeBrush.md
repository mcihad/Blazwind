```mdc
# BwNumberRangeBrush (Histogram Aralık Seçici)

Histogram görselleştirmesi üzerinde aralık seçimi yapan bileşen. Sayısal veri dağılımını görsel olarak gösterir.

## Özellikler
*   **Histogram:** Veri dağılımını bar grafik olarak gösterir.
*   **Sürüklenebilir Seçim:** Görsel üzerinde aralık seçimi.
*   **Seçili Vurgulama:** Seçilen aralıktaki barlar vurgulanır.
*   **İstatistikler:** Min, max, ortalama bilgileri.

## Kullanım

### Temel Kullanım
```razor
<BwNumberRangeBrush Data="salesData" 
                    Label="Satış Aralığı" 
                    OnBrushChanged="OnBrushChanged" />

@code {
    private List<double> salesData = new() { 150, 280, 310, 420, 380, 290, 350, 480, 520, 410 };
    
    private void OnBrushChanged(BrushChangedEventArgs e)
    {
        Console.WriteLine($"Aralık: %{e.StartPercent:F1} - %{e.EndPercent:F1}");
    }
}
```

### Özelleştirilmiş Görünüm

```razor
<BwNumberRangeBrush Data="priceData" 
                    Label="Fiyat Dağılımı" 
                    Color="BwColor.Success"
                    BinCount="20"
                    Height="120"
                    OnBrushChanged="OnBrushChanged" />
```

### İstatistikler ile

```razor
<BwNumberRangeBrush Data="data" 
                    Label="Performans"
                    ShowStats="true"
                    ShowMinMax="true" />
```

## Parametreler

| Parametre    | Tip                   | Varsayılan | Açıklama               |
|:-------------|:----------------------|:-----------|:-----------------------|
| `Data`       | `IEnumerable<double>` | `null`     | Histogram verisi.      |
| `Label`      | `string?`             | `null`     | Etiket.                |
| `BinCount`   | `int`                 | `10`       | Bar sayısı.            |
| `Height`     | `int`                 | `80`       | Yükseklik (px).        |
| `Color`      | `BwColor`             | `Primary`  | Renk.                  |
| `ShowStats`  | `bool`                | `false`    | İstatistikleri göster. |
| `ShowMinMax` | `bool`                | `true`     | Min/Max göster.        |

## Olaylar

| Olay             | Tip                                    | Açıklama                        |
|:-----------------|:---------------------------------------|:--------------------------------|
| `OnBrushChanged` | `EventCallback<BrushChangedEventArgs>` | Aralık değiştiğinde tetiklenir. |

## Histogram Hesaplama

Bileşen, verilen veri setinden otomatik olarak histogram oluşturur:

1. Verinin min/max değerlerini bulur
2. BinCount kadar eşit aralığa böler
3. Her aralıktaki veri sayısını hesaplar
4. Bar yüksekliklerini normalize eder

```
