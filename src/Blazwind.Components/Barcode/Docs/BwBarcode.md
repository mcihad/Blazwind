# BwBarcode

A component used to generate barcodes. Ideal for asset, document, and product tracking.

## Examples

### Basic Usage

```razor
<BwBarcode Value="1234567890128" Format="BarcodeFormat.EAN13" />
```

### Different Formats

```razor
<BwBarcode Value="BLAZWIND123" Format="BarcodeFormat.CODE128" />
<BwBarcode Value="ABC-12345" Format="BarcodeFormat.CODE39" />
```

### Customization

```razor
<BwBarcode Value="COLORED" 
           LineColor="#1d4ed8"
           Background="#eff6ff"
           Height="80" />
```

## API

| Parameter      | Type                | Default     | Description                                          |
|----------------|---------------------|-------------|------------------------------------------------------|
| `Value`        | `string`            | `""`        | The barcode value to encode.                         |
| `Format`       | `BarcodeFormat`     | `CODE128`   | The barcode format.                                  |
| `RenderAs`     | `BarcodeRenderType` | `Svg`       | Rendering engine (`Svg` or `Canvas`).                |
| `Width`        | `int`               | `2`         | Width of a single bar (px).                          |
| `Height`       | `int`               | `100`       | Height of the barcode (px).                          |
| `DisplayValue` | `bool`              | `true`      | Whether to display the text value below the barcode. |
| `Text`         | `string?`           | `null`      | Custom text to display instead of the actual value.  |
| `Font`         | `string`            | `monospace` | Font family for the displayed text.                  |
| `FontSize`     | `int`               | `14`        | Font size for the displayed text.                    |
| `TextAlign`    | `string`            | `center`    | Alignment of the displayed text.                     |
| `Background`   | `string`            | `#ffffff`   | Background color.                                    |
| `LineColor`    | `string`            | `#000000`   | Bar (line) color.                                    |
| `Margin`       | `int`               | `10`        | Margin around the barcode.                           |
| `Label`        | `string?`           | `null`      | Label text displayed above the barcode.              |
| `Class`        | `string?`           | `null`      | Additional CSS classes.                              |

## Supported Formats

- **CODE128** (A, B, C) - General purpose
- **EAN13**, **EAN8**, **EAN5**, **EAN2** - Product barcodes
- **UPC**, **UPCE** - North American retail
- **CODE39** - Logistics and industry
- **ITF14**, **ITF** - Shipping and packaging
- **MSI** (10, 11, 1010, 1110) - Warehouse management
- **Pharmacode** - Pharmaceutical industry
- **Codabar** - Legacy systems

## Methods

| Method           | Signature                       | Description                        |
|------------------|---------------------------------|------------------------------------|
| `ToDataUrlAsync` | `Task<string> ToDataUrlAsync()` | Exports the barcode as a Data URL. |
