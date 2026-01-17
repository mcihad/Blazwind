# Radio & RadioGroup

Tekli seçim grubu oluşturmak için kullanılan bileşenler. `Data` üzerinden dinamik liste veya manual `BwRadio` tanımı destekler.

## Özellikler

*   **Dinamik Veri:** `Data` parametresi ile generic liste bağlama.
*   **İki Yönlü Bağlama:** `Value` ve `ValueChanged` desteği.
*   **Validasyon:** `For` parametresi ile otomatik validasyon.
*   **Görünüm:** `Orientation` (dikey/yatay) ve `Size` ayarları.

## Kullanım

### Manual Kullanım

```razor
<BwRadioGroup Name="options" @bind-Value="selectedOption">
    <BwRadio Value="@("opt1")" Label="Seçenek 1" />
    <BwRadio Value="@("opt2")" Label="Seçenek 2" />
</BwRadioGroup>
```

### Data API Kullanımı

```razor
<BwRadioGroup Data="@cities" 
              @bind-Value="selectedCity"
              ItemValue="@(x => x.Id)"
              ItemText="@(x => x.Name)"
              Orientation="BwOrientation.Horizontal" />
```

### Otomatik Validasyon

```razor
<BwRadioGroup @bind-Value="model.Gender" 
              For="@(() => model.Gender)"
              Data="@genders" />
```

## Parametreler

### BwRadio Group (Grup Temelli)

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `TValue` | - | Seçili değer (Two-way binding). |
| `Data` | `IEnumerable<TItem>` | `null` | Dinamik veri kaynağı. |
| `ItemText` | `Func<TItem, string>` | - | Görünen metin seçici. |
| `ItemValue` | `Func<TItem, TValue>` | - | Değer seçici. |
| `Name` | `string` | `null` | Grup adı (HTML `name` attribute). |
| `Orientation` | `BwOrientation` | `Vertical` | Düzen (`Vertical`, `Horizontal`). |
| `Size` | `BwSize` | `Medium` | Boyut (`Small`, `Medium`, `Large`). |
| `IsDisabled` | `bool` | `false` | Tüm grubu devre dışı bırakır. |
| `IsValid` | `bool` | `true` | Manuel validasyon durumu. |
| `ErrorMessage` | `string` | `null` | Manuel hata mesajı. |
| `For` | `Expression<Func<TValue>>` | `null` | Otomatik validasyon için alan referansı. |

### BwRadio (Tekil)

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `TValue` | - | Radyo butonunun temsil ettiği değer. |
| `Label` | `string` | `null` | Görünen etiket. |
| `IsDisabled` | `bool` | `false` | Tekil olarak devre dışı bırakır. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `TValue` | Seçim değiştiğinde tetiklenir (Two-way binding). |
| `OnChange` | `TValue` | Seçim sonrası tetiklenir. |
