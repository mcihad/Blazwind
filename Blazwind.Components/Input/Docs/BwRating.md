# Rating (Değerlendirme)

Yıldız tabanlı derecelendirme bileşeni.

## Özellikler
*   **Yarım Yıldız:** `AllowHalf` ile buçuklu puanlama.
*   **İkonlar:** `FilledIcon` ve `EmptyIcon` ile özelleştirilebilir ikonlar (kalp, daire vb.).
*   **Okunur Mod:** `IsReadOnly` ile sadece gösterim.

## Kullanım

### Temel Kullanım
```razor
<BwRating Label="Ürün Puanı" @bind-Value="rating" />
```

### Yarım Yıldız ve Gösterim
```razor
<BwRating Value="3.5" AllowHalf="true" ShowValue="true" IsReadOnly="true" />
```

### Özel İkon
```razor
<BwRating FilledIcon="fa-solid fa-heart" 
          EmptyIcon="fa-regular fa-heart" 
          Color="BwColor.Danger" />
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `double` | `0` | Mevcut puan (Two-way binding). |
| `MaxValue` | `int` | `5` | Maksimum yıldız (veya ikon) sayısı. |
| `AllowHalf` | `bool` | `false` | Yarım puanlık (buçuklu) seçim izni. |
| `ShowValue` | `bool` | `false` | Seçilen değeri sayısal olarak yan tarafta gösterir. |
| `FilledIcon` | `string` | `"fa-solid fa-star"` | Dolu ikon sınıfı. |
| `EmptyIcon` | `string` | `"fa-regular fa-star"` | Boş ikon sınıfı. |
| `Color` | `BwColor` | `Warning` | İkon rengi. |
| `Size` | `BwSize` | `Medium` | İkon boyutu (`Small`, `Medium`, `Large`). |
| `Label` | `string` | `null` | Üst etiket metni. |
| `HelperText` | `string` | `null` | Alt yardımcı metin. |
| `IsReadOnly` | `bool` | `false` | Sadece okuma modu (hover ve tıklama kapalı). |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `double` | Puan değiştiğinde tetiklenir (Two-way binding). |
