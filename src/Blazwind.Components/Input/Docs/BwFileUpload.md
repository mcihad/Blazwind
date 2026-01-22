# FileUpload (Dosya Yükleme)

Sürükle bırak destekli dosya yükleme alanı.

## Özellikler
*   **Sürükle Bırak:** Dosyaları alana sürükleyerek yükleme.
*   **Önizleme:** Yüklenen dosyaların listesini ve ikonlarını gösterme.
*   **Kısıtlamalar:** `MaxFileSize`, `MaxFiles`, `Accept` ile dosya kontrolü.

## Kullanım

### Temel Kullanım
```razor
<BwFileUpload Label="Belgeler" @bind-Files="uploadedFiles" />
```

### Kısıtlamalı (Fotoğraf Sadece)
```razor
<BwFileUpload Accept=".jpg,.png" MaxFileSize="1048576" HelperText="Mak 1MB, JPG/PNG" />
```

### Tek Dosya
```razor
<BwFileUpload Multiple="false" Label="Profil Fotoğrafı" />
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `Files` | `List<IBrowserFile>` | `new()` | Seçilen dosyalar (Two-way binding). |
| `Accept` | `string` | `null` | Kabul edilen dosya uzantıları (örn: `.jpg,.pdf`). |
| `MaxFileSize` | `long?` | `null` | Maksimum dosya boyutu (bayt cinsinden). |
| `MaxFiles` | `int?` | `10` | Maksimum seçilebilecek dosya sayısı. |
| `Multiple` | `bool` | `true` | Birden fazla dosya seçimine izin verir. |
| `ShowPreview` | `bool` | `true` | Yüklenen dosyaların listesini aşağıda gösterir. |
| `Label` | `string` | `null` | Alan etiketi. |
| `HelperText` | `string` | `null` | Yardımcı metin. |
| `IsDisabled` | `bool` | `false` | Devre dışı bırakır. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `FilesChanged` | `List<IBrowserFile>` | Dosya listesi her değiştiğinde (ekleme/çıkarma) tetiklenir. |
| `OnFileSelected` | `IReadOnlyList<IBrowserFile>` | Sadece yeni dosyalar seçildiğinde tetiklenir. |
