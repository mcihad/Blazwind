### Gelişmiş Özellikler (Kopyala, Temizle, Şifre)

Bileşen, sık kullanılan yardımcı fonksiyonları dahili olarak destekler.

```razor
<!-- Kopyalama Butonu -->
<BwInputButton Label="Referans No" Value="REF-123456" ShowCopy="true" IsReadOnly="true" />

<!-- Temizleme Butonu -->
<BwInputButton Label="Arama" @bind-Value="searchTerm" ShowClear="true" />

<!-- Şifre Göster/Gizle -->
<BwInputButton Label="Şifre" Type="password" ShowPasswordToggle="true" />
```

### Slotlar (Prepend/Append/Buttons)

```razor
<BwInputButton Label="Arama">
    <PrependContent>
        <span class="px-3 text-gray-500">https://</span>
    </PrependContent>
    <Buttons>
        <BwButton Text="Git" Color="BwColor.Primary" />
    </Buttons>
    <AppendContent>
        <span class="px-3 text-gray-500">.com</span>
    </AppendContent>
</BwInputButton>
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `string` | `null` | Giriş değeri (Two-way binding). |
| `Label` | `string` | `null` | Alan etiketi. |
| `Placeholder` | `string` | `null` | Yer tutucu metin. |
| `Type` | `string` | `"text"` | Input tipi (`password`, `email` vb.). |
| `Size` | `BwSize` | `Medium` | Boyut (`Small`, `Medium`, `Large`). |
| `ShowClear` | `bool` | `false` | Değer varken temizleme (X) butonu gösterir. |
| `ShowCopy` | `bool` | `false` | Panoya kopyala butonu gösterir. |
| `ShowPasswordToggle` | `bool` | `true` | Şifre tipi için göster/gizle butonu (göz ikonu). |
| `IsLoading` | `bool` | `false` | Yükleniyor ikonu gösterir. |
| `PrefixIcon` | `string` | `null` | Sol taraftaki ikon sınıfı. |
| `SuffixIcon` | `string` | `null` | Sağ taraftaki ikon sınıfı. |
| `PrependContent` | `RenderFragment` | `null` | En sol tarafa eklenecek içerik (gri arka planlı). |
| `AppendContent` | `RenderFragment` | `null` | En sağ tarafa eklenecek içerik (gri arka planlı). |
| `Buttons` | `RenderFragment` | `null` | Sağ tarafa eklenecek butonlar. |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `string` | Değer değiştiğinde tetiklenir. |
| `OnClick` | `void` | Input alanına tıklandığında tetiklenir. |
| `OnEnterPressed` | `void` | Enter tuşuna basıldığında tetiklenir. |
| `OnClear` | `void` | Temizleme butonuna basıldığında tetiklenir. |
