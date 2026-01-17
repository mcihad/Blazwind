```mdc
# BwCustomRange (Özelleştirilebilir Aralık Seçici)

Tamamen özelleştirilebilir brush bileşeni. Kendi görselleştirmenizi ekleyebilirsiniz.

## Özellikler
*   **Tam Özelleştirme:** ChildContent ile istediğiniz görselleştirme.
*   **Template Desteği:** BackgroundTemplate ve SelectionTemplate.
*   **Esnek API:** Tüm brush özelliklerini içerir.
*   **Slot Pattern:** Farklı bölümler için şablonlar.

## Kullanım

### Temel Kullanım
```razor
<BwCustomRange OnBrushChanged="OnBrushChanged">
    <div class="h-20 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 rounded-lg"></div>
</BwCustomRange>
```

### Şablonlar ile
```razor
<BwCustomRange OnBrushChanged="OnBrushChanged">
    <BackgroundTemplate>
        <div class="h-24 bg-slate-100 rounded-lg flex items-end justify-around p-2">
            @foreach (var value in chartData)
            {
                <div class="w-4 bg-slate-300 rounded-t" style="height: @(value)%"></div>
            }
        </div>
    </BackgroundTemplate>
    <SelectionTemplate>
        <div class="h-full bg-primary-500/30 rounded"></div>
    </SelectionTemplate>
</BwCustomRange>
```

### Görsel Harita ile
```razor
<BwCustomRange Label="Bölge Seçimi" OnBrushChanged="OnBrushChanged">
    <img src="/images/heatmap.png" class="w-full h-24 object-cover rounded" />
</BwCustomRange>
```

### Özel SVG Grafik ile
```razor
<BwCustomRange OnBrushChanged="OnBrushChanged">
    <svg viewBox="0 0 400 100" class="w-full h-24">
        <polyline 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
            points="@GetPolylinePoints()" />
    </svg>
</BwCustomRange>
```

## Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
| :--- | :--- | :--- | :--- |
| `BackgroundTemplate` | `RenderFragment` | `null` | Tüm alanı kaplayan arka plan şablonu. |
| `SelectionTemplate` | `RenderFragment` | `null` | Sadece seçili alanı kaplayan şablon. |
| `HandleTemplate` | `RenderFragment` | `null` | Tutamaçlar için özel şablon. |
| `ChildContent` | `RenderFragment` | `null` | Ana içerik alanı. |
| `StartPercent` | `double` | `0` | Başlangıç yüzdesi (Two-way binding). |
| `EndPercent` | `double` | `100` | Bitiş yüzdesi (Two-way binding). |
| `MinWidthPercent` | `double` | `5` | Minimum seçim genişliği (%). |
| `Height` | `int` | `80` | Bileşen yüksekliği (px). |
| `Label` | `string` | `null` | Alan etiketi. |

## Olaylar (Events)

| Olay | Paylaşım (Payload) | Açıklama |
| :--- | :--- | :--- |
| `StartPercentChanged` | `double` | Başlangıç yüzdesi değiştiğinde tetiklenir. |
| `EndPercentChanged` | `double` | Bitiş yüzdesi değiştiğinde tetiklenir. |
| `OnBrushChanged` | `BrushChangedEventArgs` | Fırça alanı her değiştiğinde tetiklenir. |

## Slot Pattern
```razor
<BwCustomRange>
    <!-- Arka plan - tüm alan -->
    <BackgroundTemplate>
        ...
    </BackgroundTemplate>
    
    <!-- Seçili bölge - sadece seçilen alan -->
    <SelectionTemplate>
        ...
    </SelectionTemplate>
    
    <!-- Sol tutamaç -->
    <LeftHandleTemplate>
        ...
    </LeftHandleTemplate>
    
    <!-- Sağ tutamaç -->
    <RightHandleTemplate>
        ...
    </RightHandleTemplate>
</BwCustomRange>
```

## Kullanım Senaryoları
- **Özel Grafikler:** D3.js, Chart.js entegrasyonu
- **Harita Seçimi:** Coğrafi bölge seçimi
- **Görüntü Kırpma:** Resim üzerinde alan seçimi
- **Video Timeline:** Video düzenleme zaman çizelgesi
```
