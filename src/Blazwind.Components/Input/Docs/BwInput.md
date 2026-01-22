# Input (Metin Girişi)

Kullanıcıdan metin tabanlı veri almak için kullanılan temel bileşendir. `BwBaseInput` altyapısını kullanır ve tüm standart form özelliklerini destekler.

## Özellikler

*   **Boyutlandırma:** `Small`, `Medium`, `Large`.
*   **İkonlar:** Sol veya sağ tarafa ikon ekleme desteği.
*   **Doğrulama:** `EditContext` entegrasyonu ve otomatik hata mesajları (`For` parametresi).
*   **Label Pozisyonu:** `Top`, `Left`, `Floating` (Kayan etiket).
*   **Yardım Metni:** `Inline` (satır altı) veya `Popup` (tooltip) modları.

## Kullanım

### Temel Kullanım

```razor
<BwInput Label="Adınız" Placeholder="Adınızı giriniz" @bind-Value="model.Name" />
```

### İkonlu Kullanım

```razor
<BwInput Label="Arama" IconLeft="fa-solid fa-search" Placeholder="Ara..." />
<BwInput Label="E-posta" IconRight="fa-solid fa-envelope" Type="email" />
```

### Otomatik Validasyon (For Parametresi)

`For` parametresi verildiğinde `IsValid` ve `ErrorMessage` otomatik yönetilir.

```razor
<BwInput @bind-Value="model.Email" 
         For="@(() => model.Email)" 
         Label="E-posta" />
```

### Label Pozisyonları

```razor
<BwInput Label="Floating Label" LabelPosition="BwLabelPosition.Floating" />
<BwInput Label="Sol Etiket" LabelPosition="BwLabelPosition.Left" LabelWidth="120px" />
```

### Yardımcı Metinler (Helper Text)

Yardımcı metinler, alanın altında (`Inline`) veya bir soru işareti ikonu ile (`Popup`) gösterilebilir.

```razor
<!-- Satır Altı (Varsayılan) -->
<BwInput Label="Şifre" 
         Type="password" 
         HelperText="En az 8 karakter olmalıdır." 
         HelpTextMode="BwHelpTextMode.Inline" />

<!-- Tooltip (Popup) -->
<BwInput Label="Kullanıcı Adı" 
         HelperText="Sistemdeki benzersiz adınız." 
         HelpTextMode="BwHelpTextMode.Popup" />
```

### Event Callbacks

```razor
<BwInput Value="@_value" 
         ValueChanged="OnValueChanged"
         OnEnter="HandleEnter"
         OnInput="HandleInput"
         OnFocus="() => _isFocused = true"
         OnBlur="() => _isFocused = false" />
```

## BwInput Parametreleri

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `string` | `null` | Giriş değeri (Two-way binding destekler). |
| `Label` | `string` | `null` | Alan etiketi. |
| `Placeholder` | `string` | `null` | Yer tutucu metin. |
| `Type` | `string` | `"text"` | HTML input tipi (`text`, `password`, `email`, `number` vb.). |
| `Size` | `BwSize` | `Medium` | Boyut (`Small`, `Medium`, `Large`). |
| `IconLeft` | `string` | `null` | Sol taraftaki ikon sınıfı (FontAwesome örn: `fa-solid fa-user`). |
| `IconRight` | `string` | `null` | Sağ taraftaki ikon sınıfı. |
| `LabelPosition` | `BwLabelPosition` | `Top` | Etiket konumu (`Top`, `Left`, `Floating`, `Hidden`). |
| `LabelWidth` | `string` | `"140px"` | `LabelPosition.Left` modunda etiketin genişliği. |
| `HelperText` | `string` | `null` | Yardımcı metin içeriği. |
| `HelpTextMode` | `BwHelpTextMode` | `Inline` | Yardım metni gösterim modu (`Inline`, `Popup`). |
| `IsRequired` | `bool` | `false` | Zorunlu alan işaretini (*) gösterir. |
| `IsDisabled` | `bool` | `false` | Alanı devre dışı bırakır. |
| `IsReadOnly` | `bool` | `false` | Sadece okunabilir yapar. |
| `IsValid` | `bool` | `true` | Manuel validasyon durumu. |
| `ErrorMessage` | `string` | `null` | Manuel hata mesajı. |
| `For` | `Expression<Func<string>>` | `null` | Otomatik validasyon için alan referansı. |
| `Density` | `BwFormDensity` | `Normal` | Form yoğunluğu (`Compact`, `Normal`, `Relaxed`). |
| `Class` | `string` | `null` | Ek CSS sınıfları. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `string` | Değer her değiştiğinde tetiklenir (Two-way binding). |
| `OnChange` | `string` | Değer değiştiğinde ve alan odaktan çıktığında (blur) tetiklenir. |
| `OnInput` | `ChangeEventArgs` | Her tuş vuruşunda (native input event) tetiklenir. |
| `OnEnter` | `void` | Enter tuşuna basıldığında tetiklenir. |
| `OnFocus` | `FocusEventArgs` | Alan odaklandığında tetiklenir. |
| `OnBlur` | `FocusEventArgs` | Alandan çıkıldığında tetiklenir. |
