# Autocomplete (Otomatik Tamamlama)

Filtrelenebilir, tekli veya çoklu seçim yapılabilen gelişmiş liste bileşeni.

## Kullanım

### Tekli Seçim
```razor
<BwAutocomplete Data="Cities" 
                Label="Şehir Ara" 
                Placeholder="Şehir yazın..." 
                @bind-SelectedItem="selectedCity" />
```

### Çoklu Seçim
```razor
<BwAutocomplete Data="Skills" 
                Label="Yetenekler" 
                Multiple="true" 
                MaxTags="5"
                @bind-SelectedItems="mySkills" />
```

### Asenkron Arama (Async Search)

Büyük veri setleri için `SearchFunc` kullanarak sunucu taraflı arama yapılabilir.

```razor
<BwAutocomplete TItem="User" 
                Label="Kullanıcı Ara" 
                SearchFunc="@SearchUsers" 
                ItemText="@(u => u.Name)" />

@code {
    private async Task<IEnumerable<User>> SearchUsers(string searchText)
    {
        // Örn: API çağrısı
        return await Http.GetFromJsonAsync<List<User>>($"api/users?q={searchText}");
    }
}
```

### Yeni Öğe Oluşturma (AllowCreate)

Listede bulunmayan öğelerin kullanıcı tarafından eklenmesine izin verir.

```razor
<BwAutocomplete TItem="string" 
                Items="@tags" 
                AllowCreate="true" 
                OnCreateNew="@((val) => tags.Add(val))"
                Label="Etiketler" />
```

### Özelleştirme
Dataların nasıl görüneceğini `ItemText` fonksiyonu ile belirleyebilirsiniz.

```razor
<BwAutocomplete Items="Users" 
                ItemText="@(u => u.Name + " (" + u.Role + ")")" 
                Label="Kullanıcı Seç" />
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `TItem` | - | Seçili öğe (Tekli seçim). |
| `SelectedItems` | `List<TItem>` | `null` | Seçili öğeler (Çoklu seçim). |
| `Items` | `IEnumerable<TItem>` | `null` | Statik veri kaynağı. |
| `SearchFunc` | `Func<string, Task<IEnumerable<TItem>>>` | `null` | Asenkron arama fonksiyonu. |
| `ItemText` | `Func<TItem, string>` | - | Öğenin görünen metni için seçici. |
| `Multiple` | `bool` | `false` | Çoklu seçimi etkinleştirir. |
| `AllowCreate` | `bool` | `false` | Yeni öğe oluşturulmasına izin verir. |
| `MaxTags` | `int?` | `null` | Çoklu seçimde maksimum etiket sayısı. |
| `Placeholder` | `string` | `"Seçiniz..."` | Yer tutucu metin. |
| `Label` | `string` | `null` | Alan etiketi. |
| `Size` | `BwSize` | `Medium` | Boyut. |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |
| `For` | `Expression` | `null` | Validasyon için alan referansı. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `TItem` | Seçim değiştiğinde tetiklenir (Tekli seçim). |
| `SelectedItemsChanged` | `List<TItem>` | Seçimler değiştiğinde tetiklenir (Çoklu seçim). |
| `OnCreateNew` | `string` | Yeni bir öğe oluşturulduğunda tetiklenir. |
| `OnSearch` | `string` | Arama yapıldığında tetiklenir. |
