# Select (Seçim Kutusu)

Açılır listeden tekli veya çoklu seçim yapılmasını sağlar. `Data` parametresi ile generic veri kaynağı destekler.

## Özellikler

*   **Veri Kaynağı:** `Data` parametresi ile generic liste binding.
*   **Çoklu Seçim:** `IsMultiple` ile birden fazla öğe seçimi.
*   **Arama:** Entegre arama/filtreleme özelliği.
*   **Validasyon:** Standart `For` validasyon desteği.

## Kullanım

### Liste ile Kullanım (Data API)

```razor
<BwSelect Data="@users" 
          @bind-Value="selectedUserId" 
          ItemValue="@(u => u.Id)" 
          ItemText="@(u => u.Name)"
          Label="Kullanıcı Seçin" />
```

### Çoklu Seçim

```razor
<BwSelect Data="@roles"
          @bind-SelectedValues="selectedRoles"
          IsMultiple="true"
          Label="Roller" />
```

### Özel Seçenekler (Slot)

`Items` parametresi yerine manual `option` etiketleri veya özel içerik de kullanılabilir.

```razor
<BwSelect @bind-Value="selectedColor" Label="Renk">
    <option value="red">Kırmızı</option>
    <option value="blue">Mavi</option>
    <option value="green">Yeşil</option>
</BwSelect>
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `TValue` | - | Seçili değer (Tekli seçim, Two-way binding). |
| `SelectedValues` | `List<TValue>` | `null` | Seçili değerler listesi (Çoklu seçim, Two-way binding). |
| `Items` | `IEnumerable<BwSelectItem<TValue>>` | `null` | Veri kaynağı. |
| `IsMultiple` | `bool` | `false` | Çoklu seçimi etkinleştirir. |
| `VisibleRows` | `int` | `4` | Çoklu seçim modunda görünür satır sayısı. |
| `Label` | `string` | `null` | Alan etiketi. |
| `Placeholder` | `string` | `null` | Yer tutucu (Tekli seçimde ilk boş seçenek). |
| `LabelPosition` | `BwLabelPosition` | `Top` | Etiket konumu (`Top`, `Left`, `Hidden`). |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |
| `IsRequired` | `bool` | `false` | Zorunlu işaretini gösterir. |
| `IsValid` | `bool` | `true` | Manuel validasyon durumu. |
| `ErrorMessage` | `string` | `null` | Manuel hata mesajı. |
| `For` | `Expression<Func<T>>` | `null` | Otomatik validasyon için alan referansı. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `TValue` | Seçim değiştiğinde tetiklenir (Tekli seçim). |
| `SelectedValuesChanged` | `List<TValue>` | Seçimler değiştiğinde tetiklenir (Çoklu seçim). |
| `SelectedItemChanged` | `BwSelectItem<TValue>` | Seçilen öğe nesnesi değiştiğinde tetiklenir. |
| `SelectedItemsChanged` | `List<BwSelectItem<TValue>>` | Seçilen öğe nesneleri listesi değiştiğinde tetiklenir. |
