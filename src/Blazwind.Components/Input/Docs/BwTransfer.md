# BwTransfer

İki liste arasında çoklu öğe taşıma işlemleri için kullanılan gelişmiş veri giriş bileşenidir. Genellikle yetki atama, personel seçimi veya kategori yönetimi gibi işlemlerde kullanılır.

## Genel Özellikler
- **Çift Yönlü Taşıma:** Kaynak listeden hedef listeye ve tersine öğe taşıma.
- **Arama Desteği:** Her iki liste içinde anlık filtreleme.
- **Toplu Seçim:** Tümünü seç/kaldır özelliği.
- **Generic Yapı:** Herhangi bir model tipiyle (`TItem`) çalışabilir.
- **Özelleştirilebilir:** Başlıklar, yükseklik ve görüntülenen metin alanı ayarlanabilir.

## Kullanım Örnekleri

### Temel Kullanım
Basit string listesi ile kullanım.
```razor
@code {
    List<string> AllItems = new() { "Item 1", "Item 2", "Item 3", "Item 4", "Item 5" };
    List<string> SelectedItems = new();
}

<BwTransfer DataSource="@AllItems" 
            @bind-TargetItems="@SelectedItems" />
```

### Complex Object (Sınıf) ile Kullanım
Gerçek dünya senaryosu: Kullanıcı listesi.
```razor
@code {
    public class User { public int Id { get; set; } public string Name { get; set; } }
    
    List<User> Users = new() { ... };
    List<User> SelectedUsers = new();
}

<BwTransfer DataSource="@Users"
            @bind-TargetItems="@SelectedUsers"
            TextSelector="@(u => u.Name)"
            ValueSelector="@(u => u.Id)"
            Titles="@(new[] { "Tüm Personel", "Seçilenler" })"
            ShowSearch="true" />
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `DataSource` | `IEnumerable<TItem>` | `null` | Tüm öğelerin listesi. |
| `TargetItems` | `IList<TItem>` | `new List<TItem>()` | Seçilen (sağ taraftaki) öğelerin listesi (Two-way binding). |
| `TextSelector` | `Func<TItem, string>` | - | Öğenin görünen metni için seçici. |
| `ValueSelector` | `Func<TItem, object>` | - | Öğenin benzersiz değeri için seçici. |
| `Titles` | `string[]` | `["Source", "Target"]` | Liste başlıkları. |
| `ShowSearch` | `bool` | `false` | Arama alanını gösterir. |
| `SearchPlaceholder` | `string` | `"Ara..."` | Arama alanı yer tutucusu. |
| `Height` | `string` | `"300px"` | Listenin yüksekliği. |
| `IsDisabled` | `bool` | `false` | Tüm bileşeni devre dışı bırakır. |
| `For` | `Expression<Func<IList<TItem>>>` | `null` | Validasyon için alan referansı. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `TargetItemsChanged` | `List<TItem>` | Seçilen öğeler listesi değiştiğinde tetiklenir (Two-way binding). |
| `OnTransfer` | `TransferEventArgs<TItem>` | Öğeler bir listeden diğerine geçtiğinde tetiklenir. |
