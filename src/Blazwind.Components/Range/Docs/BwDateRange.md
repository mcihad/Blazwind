```mdc
# BwDateRange (Tarih Aralığı Seçici)

İki tarih input alanı ile tarih aralığı seçmeyi sağlayan bileşen.

## Özellikler
*   **Tarih Seçimi:** Başlangıç ve bitiş tarihi.
*   **Süre:** Seçilen aralığın süresini gösterme.
*   **Presets:** Bugün, Bu Hafta, Bu Ay gibi hızlı seçimler.
*   **Kısıtlamalar:** Min/Max tarih sınırları.

## Kullanım

### Temel Kullanım
```razor
<BwDateRange Start="DateTime.Today.AddDays(-7)" 
             End="DateTime.Today" 
             Label="Rapor Dönemi" 
             OnRangeChanged="OnChanged" />
```

### Süre Gösterimi ile

```razor
<BwDateRange Start="DateTime.Today.AddMonths(-1)" 
             End="DateTime.Today" 
             Label="Analiz Dönemi" 
             ShowDuration="true" />
```

### Preset'ler ile

```razor
<BwDateRange Label="Dönem Seçimi" 
             ShowPresets="true" 
             Color="BwColor.Success" />
```

## Yerleşik Preset'ler

- **Bugün:** Bugünün tarihi
- **Dün:** Dünün tarihi
- **Bu Hafta:** Pazartesiden bugüne
- **Bu Ay:** Ayın başından bugüne
- **Bu Çeyrek:** Çeyreğin başından bugüne
- **Bu Yıl:** Yılın başından bugüne
- **Son 7 Gün:** Son 7 gün
- **Son 30 Gün:** Son 30 gün

## Parametreler

| Parametre      | Tip                     | Varsayılan | Açıklama                                |
|:---------------|:------------------------|:-----------|:----------------------------------------|
| `Start`        | `DateTime?`             | `null`     | Başlangıç tarihi (Two-way binding).     |
| `End`          | `DateTime?`             | `null`     | Bitiş tarihi (Two-way binding).         |
| `Min`          | `DateTime?`             | `null`     | Seçilebilecek en eski tarih.            |
| `Max`          | `DateTime?`             | `null`     | Seçilebilecek en yeni tarih.            |
| `ShowDuration` | `bool`                  | `false`    | Seçilen aralığın gün sayısını gösterir. |
| `ShowPresets`  | `bool`                  | `false`    | Hızlı seçim butonlarını gösterir.       |
| `Presets`      | `List<DateRangePreset>` | `null`     | Özelleştirilebilir hızlı seçim listesi. |
| `Color`        | `BwColor`               | `Primary`  | Vurgu rengi.                            |
| `Label`        | `string`                | `null`     | Grup etiketi.                           |
| `IsDisabled`   | `bool`                  | `false`    | Devre dışı bırakır.                     |

## Olaylar (Events)

| Olay             | Paylaşım (Payload)                 | Açıklama                                                    |
|:-----------------|:-----------------------------------|:------------------------------------------------------------|
| `StartChanged`   | `DateTime?`                        | Başlangıç tarihi değiştiğinde tetiklenir.                   |
| `EndChanged`     | `DateTime?`                        | Bitiş tarihi değiştiğinde tetiklenir.                       |
| `OnRangeChanged` | `RangeChangedEventArgs<DateTime?>` | Aralık değiştiğinde tetiklenir (Start ve End ile birlikte). |

## Yardımcı Sınıflar

```csharp
public record DateRangePreset(string Label, DateTime Start, DateTime End);

public class RangeChangedEventArgs<T>
{
    public T Start { get; set; }
    public T End { get; set; }
}
```

```
