```mdc
# BwTimeRange (Saat Aralığı Seçici)

İki zaman input alanı ile saat aralığı seçmeyi sağlayan bileşen.

## Özellikler
*   **Saat Seçimi:** Başlangıç ve bitiş saati.
*   **Süre:** Seçilen aralığın süresini gösterme.
*   **Presets:** Sabah, Öğle, Akşam gibi hızlı seçimler.
*   **Kısıtlamalar:** Min/Max saat sınırları.

## Kullanım

### Temel Kullanım
```razor
<BwTimeRange Start="@(new TimeOnly(9, 0))" 
             End="@(new TimeOnly(17, 0))" 
             Label="Çalışma Saatleri" 
             OnRangeChanged="OnChanged" />
```

### Süre Gösterimi ile

```razor
<BwTimeRange Start="@(new TimeOnly(8, 30))" 
             End="@(new TimeOnly(12, 30))" 
             Label="Toplantı Süresi" 
             ShowDuration="true" />
```

### Preset'ler ile

```razor
<BwTimeRange Label="Mesai Seçimi" 
             ShowPresets="true" 
             Color="BwColor.Info" />
```

## Yerleşik Preset'ler

- **Sabah (08:00 - 12:00):** Sabah saatleri
- **Öğle (12:00 - 14:00):** Öğle arası
- **Öğleden Sonra (14:00 - 18:00):** Öğleden sonra
- **Akşam (18:00 - 22:00):** Akşam saatleri
- **Tam Gün (09:00 - 18:00):** Standart mesai
- **Yarım Gün (09:00 - 13:00):** Yarım gün mesai
- **Gece Vardiyası (22:00 - 06:00):** Gece vardiyası

## Parametreler

| Parametre      | Tip                     | Varsayılan | Açıklama                                |
|:---------------|:------------------------|:-----------|:----------------------------------------|
| `Start`        | `TimeSpan?`             | `null`     | Başlangıç saati (Two-way binding).      |
| `End`          | `TimeSpan?`             | `null`     | Bitiş saati (Two-way binding).          |
| `Min`          | `TimeSpan?`             | `null`     | Seçilebilecek en erken saat.            |
| `Max`          | `TimeSpan?`             | `null`     | Seçilebilecek en geç saat.              |
| `Step`         | `string`                | `"60"`     | Saat seçicinin adım aralığı (saniye).   |
| `ShowDuration` | `bool`                  | `false`    | Seçilen aralığın süresini gösterir.     |
| `ShowPresets`  | `bool`                  | `false`    | Hızlı seçim butonlarını gösterir.       |
| `Presets`      | `List<TimeRangePreset>` | `null`     | Özelleştirilebilir hızlı seçim listesi. |
| `Color`        | `BwColor`               | `Primary`  | Vurgu rengi.                            |
| `Label`        | `string`                | `null`     | Grup etiketi.                           |
| `IsDisabled`   | `bool`                  | `false`    | Devre dışı bırakır.                     |

## Olaylar (Events)

| Olay             | Paylaşım (Payload)                 | Açıklama                                                    |
|:-----------------|:-----------------------------------|:------------------------------------------------------------|
| `StartChanged`   | `TimeSpan?`                        | Başlangıç saati değiştiğinde tetiklenir.                    |
| `EndChanged`     | `TimeSpan?`                        | Bitiş saati değiştiğinde tetiklenir.                        |
| `OnRangeChanged` | `RangeChangedEventArgs<TimeSpan?>` | Aralık değiştiğinde tetiklenir (Start ve End ile birlikte). |

## Yardımcı Sınıflar

```csharp
public record TimeRangePreset(string Label, TimeSpan Start, TimeSpan End);

public class RangeChangedEventArgs<T>
{
    public T Start { get; set; }
    public T End { get; set; }
}
```

```
