# TagInput (Etiket Girişi)

Kullanıcının serbest metin etiketleri girmesini sağlayan bileşen.

## Özellikler
*   **Klavye Kontrolü:** Enter, Tab veya Virgül ile etiket ekleme.
*   **Silme:** Backspace veya çarpı ikonu ile silme.
*   **Limit:** Maksimum etiket sayısı belirleme (`MaxTags`).
*   **Benzersizlik:** Aynı etiketin tekrar eklenmesini engelleme (`AllowDuplicates`).
*   **Yardım Araçları:** `BwHelpTooltip` entegrasyonu.

## Kullanım

```razor
<BwTagInput Label="Anahtar Kelimeler" @bind-Tags="keywords" />
```

### Validasyonlu Kullanım

```razor
<BwTagInput Tags="keywords" 
            ErrorMessage="@errorMessage" 
            IsValid="@isValid" 
            HelpTextMode="BwHelpTextMode.Popup"
            HelperText="En az 3 etiket giriniz" />
```

### Sınırlı ve Benzersiz
Maksimum 5 etiket ve aynı etikete izin verme.

```razor
<BwTagInput MaxTags="5" AllowDuplicates="false" />
```

### Özel Ayırıcı Tuşlar (TriggerKeys)

Varsayılan olarak `Enter`, `Tab` ve `,` tuşları yeni etiket ekler. `TriggerKeys` ile bunu özelleştirebilirsiniz.

```razor
<BwTagInput @bind-Tags="myTags" 
            TriggerKeys="@(new[] { "Enter", " " })" 
            Placeholder="Boşluk ile etiket ekle" />
```

## Parametreler
| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Tags` | `List<string>` | `new()` | Etiket listesi (Two-way binding). |
| `MaxTags` | `int?` | `null` | Maksimum eklenebilecek etiket sayısı. |
| `AllowDuplicates` | `bool` | `false` | Aynı etiketin birden fazla eklenmesine izin verir. |
| `TriggerKeys` | `string[]` | `["Enter", "Tab", ","]` | Yeni etiket eklemeyi tetikleyen tuşlar. |
| `Label` | `string` | `null` | Alan etiketi. |
| `Placeholder` | `string` | `"Etiket ekle..."` | Yer tutucu metin. |
| `Size` | `BwSize` | `Medium` | Boyut. |
| `Color` | `BwColor` | `Primary` | Etiketlerin rengi. |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |
| `For` | `Expression` | `null` | Validasyon için alan referansı. |
| `ErrorMessage` | `string` | `null` | Hata mesajı. |
| `IsValid` | `bool` | `true` | Validasyon durumu. |
| `HelperText` | `string` | `null` | Yardım metni. |
| `HelpTextMode` | `BwHelpTextMode` | `Inline` | Yardım metni modu. |
| `LabelPosition` | `BwLabelPosition` | `Top` | Etiket konumu. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `TagsChanged` | `List<string>` | Etiket listesi değiştiğinde tetiklenir (Two-way binding). |
| `OnTagAdded` | `string` | Yeni bir etiket eklendiğinde tetiklenir. |
| `OnTagRemoved` | `string` | Bir etiket silindiğinde tetiklenir. |
