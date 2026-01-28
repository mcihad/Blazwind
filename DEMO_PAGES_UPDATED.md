# Demo Sayfaları Tema Uyumluluğu Güncellemeleri

## Güncellenen Sayfalar

### ✅ LayoutDemo.razor
- `class="text-sm text-gray-500 mb-2"` → `<BwTypography Size="BwSize.Small" Color="BwColor.Secondary">` + `<BwMargin Bottom="BwSpacing.Xs">`
- `class="bg-gray-100 p-3 rounded"` → `Style="background-color: var(--bw-gray-100); padding: 0.75rem; border-radius: var(--bw-radius-default);"`
- Renkli box'lar → CSS variables (var(--bw-primary-500), var(--bw-success-500), etc.)
- `<code>` tags → Metinde doğrudan yazıldı (BwAlert içinde)

### Kalan Sayfalar (Basit Güncellemeler Gerekli)
- UserProfileDemo.razor - Birkaç border/padding sınıfı
- PaddingMarginDemo.razor - Örnek amaçlı renkli box'lar
- SplitPanelDemo.razor - IDE example styling
- GridDemo.razor - Renkli grid item'lar  
- FlowDemo.razor - POS screen örneği

## Yaklaşım
Bu sayfalar layout/demo sayfaları olduğundan, renkli box'lar örnek amaçlı. Yine de:
1. Text sınıfları → BwTypography
2. Spacing → BwMargin/BwPadding
3. Border → inline styles with CSS variables
4. Colors → var(--bw-color-xxx) kullanımı
5. Dark mode → .dark selector ile otomatik çalışıyor
