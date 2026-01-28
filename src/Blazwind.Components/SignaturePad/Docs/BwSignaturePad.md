# BwSignaturePad

Dijital imza yakalama bileşeni. e-Devlet ve kurumsal uygulamalar için imza toplama.

## Örnekler

### Temel Kullanım

```razor
<BwSignaturePad Label="İmzanız"
               @bind-Value="_signatureData"
               Height="200px" />
```

### Özelleştirme

```razor
<BwSignaturePad Label="Mavi Kalem"
               PenColor="#1d4ed8"
               BackgroundColor="#eff6ff"
               Height="150px" />
```

### Varyantlar

```razor
<BwSignaturePad Variant="BwVariant.Filled" />
<BwSignaturePad Variant="BwVariant.Outline" />
```

> [!IMPORTANT]
> Bu bileşen imza çizimi için HTML5 Canvas ve dahili bir JavaScript modülü kullanır.

## Parametreler

| Parametre         | Tip         | Varsayılan  | Açıklama                                                     |
|:------------------|:------------|:------------|:-------------------------------------------------------------|
| `Value`           | `string`    | `null`      | İmza verisi (Data URL veya SVG formatında, Two-way binding). |
| `Width`           | `string`    | `"100%"`    | Çizim alanı genişliği.                                       |
| `Height`          | `string`    | `"200px"`   | Çizim alanı yüksekliği.                                      |
| `PenColor`        | `string`    | `"#000000"` | Kalem rengi (Hex).                                           |
| `BackgroundColor` | `string`    | `"#ffffff"` | Arka plan rengi (Hex).                                       |
| `MinWidth`        | `double`    | `0.5`       | Minimum kalem kalınlığı.                                     |
| `MaxWidth`        | `double`    | `2.5`       | Maksimum kalem kalınlığı.                                    |
| `Variant`         | `BwVariant` | `Outline`   | Görünüm varyantı (`Outline`, `Filled`).                      |
| `ShowClearButton` | `bool`      | `true`      | Temizleme butonunu gösterir.                                 |
| `ShowUndoButton`  | `bool`      | `true`      | Geri al butonunu gösterir.                                   |
| `IsReadOnly`      | `bool`      | `false`     | Sadece imza görüntüleme modu.                                |
| `Label`           | `string`    | `null`      | Alan etiketi.                                                |
| `HelperText`      | `string`    | `null`      | Yardımcı metin.                                              |

## Olaylar (Events)

| Olay           | Paylaşım (Payload) | Açıklama                                                         |
|:---------------|:-------------------|:-----------------------------------------------------------------|
| `ValueChanged` | `string`           | İmza her değiştiğinde (vuruş sonu) tetiklenir (Two-way binding). |
| `OnEndStroke`  | `null`             | Kalem/parmak kaldırıldığında tetiklenir.                         |

## Metotlar (Methods)

| Metot                       | Dönüş Tipi     | Açıklama                                 |
|:----------------------------|:---------------|:-----------------------------------------|
| `ClearAsync()`              | `Task`         | Çizimi temizler.                         |
| `UndoAsync()`               | `Task`         | Son vuruşu geri alır.                    |
| `ToDataUrlAsync(type)`      | `Task<string>` | İmzayı Base64 PNG/JPG olarak döner.      |
| `ToSvgAsync()`              | `Task<string>` | İmzayı SVG formatında döner.             |
| `IsEmptyAsync()`            | `Task<bool>`   | Pad'in boş olup olmadığını kontrol eder. |
| `FromDataUrlAsync(dataUrl)` | `Task`         | Verilen URL'den imzayı yükler.           |
