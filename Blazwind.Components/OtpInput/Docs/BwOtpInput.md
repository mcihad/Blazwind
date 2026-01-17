# BwOtpInput

OTP (One Time Password) veya PIN kodu girişi için özelleştirilmiş input bileşeni.

## Özellikler

- Yapılandırılabilir hane sayısı
- Otomatik odak geçişi
- Yalnızca rakam veya alfanümerik giriş
- Maskelenmiş gösterim (şifre modu)
- Hata durumu gösterimi
- Yapıştırma desteği

## Kullanım

```razor
<BwOtpInput @bind-Value="_otpCode" Length="6" />

@code {
    private string _otpCode = "";
}
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Value` | `string` | `""` | Girilen tüm kod (Two-way binding). |
| `Length` | `int` | `6` | Karakter sayısı (kutu sayısı). |
| `NumericOnly` | `bool` | `true` | Sadece rakam girişine izin verir. |
| `IsMasked` | `bool` | `false` | Girişi gizler (password tipi). |
| `Label` | `string` | `null` | Alan etiketi. |
| `Size` | `BwSize` | `Medium` | Boyut (`Small`, `Medium`, `Large`). |
| `Color` | `BwColor` | `Primary` | Odaklanıldığındaki vurgu rengi. |
| `Variant` | `BwVariant` | `Outline` | Görünüm varyantı (`Filled`, `Outline`). |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |
| `AutoFocus` | `bool` | `false` | İlk kutuya otomatik odaklanır. |
| `HasError` | `bool` | `false` | Hata durumunu görselleştirir. |
| `ErrorMessage` | `string` | `null` | Hata mesajı. |
| `HelperText` | `string` | `null` | Yardımcı metin. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `ValueChanged` | `string` | Her karakter girişinde tetiklenir (Two-way binding). |
| `OnComplete` | `string` | Tüm kutular dolduğunda tetiklenir. |
| `OnFocus` | `index: int` | Bir kutuya odaklanıldığında tetiklenir. |

## Metotlar (Methods)

| Metot | Açıklama |
| :--- | :--- |
| `Clear()` | Tüm kutuları temizler. |

## Örnekler

### 4 Haneli PIN

```razor
<BwOtpInput @bind-Value="_pin" 
            Length="4" 
            NumericOnly="true" />
```

### Maskelenmiş Güvenlik Kodu

```razor
<BwOtpInput @bind-Value="_securityCode" 
            Length="6" 
            IsMasked="true" />
```

### Alfanümerik Kod

```razor
<BwOtpInput @bind-Value="_code" 
            Length="8" 
            NumericOnly="false" />
```

### Hata Durumu

```razor
<BwOtpInput @bind-Value="_otp" 
            Length="6" 
            HasError="@_isInvalid" />
```

### Tamamlanma Olayı

```razor
<BwOtpInput @bind-Value="_otp" 
            Length="6" 
            OnComplete="VerifyCode" />

@code {
    private async Task VerifyCode(string code)
    {
        // API'ye doğrulama isteği gönder
        var result = await VerifyOtpAsync(code);
    }
}
```
