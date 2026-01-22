# QRCode

A component for generating and rendering SVG-based QR codes. Highly customizable and efficient, ideal for URLs, contact information, and configuration sharing.

## Examples

### Basic Usage
```razor
<BwQRCode Value="https://blazwind.dev" />
```

### Custom Colors and Size
```razor
<BwQRCode Value="https://example.com" 
          ForegroundColor="#1e40af"
          BackgroundColor="#f0f9ff" 
          Size="250" />
```

### Complex Data (WiFi)
```razor
<BwQRCode Value="WIFI:T:WPA;S:MyNetwork;P:password123;;" Size="200" />
```

### Contact Information (vCard)
```razor
@code {
    private string _vCard = @"BEGIN:VCARD
VERSION:3.0
N:Doe;John
FN:John Doe
TEL:+123456789
EMAIL:john@example.com
END:VCARD";
}

<BwQRCode Value="@_vCard" Size="250" />
```

## API - BwQRCode

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Value` | `string` | `""` | The text or URL to be encoded in the QR code. |
| `Size` | `int` | `200` | The size of the QR code in pixels (Width and Height). |
| `ForegroundColor` | `string` | `"#000000"` | Hex color code for the QR code modules. |
| `BackgroundColor` | `string` | `"#FFFFFF"` | Hex color code for the background area. |
| `Margin` | `int` | `2` | Number of quiet zone modules around the QR code. |
| `ErrorCorrectionLevel`| `string` | `"M"` | Level of error resilience (`L`: 7%, `M`: 15%, `Q`: 25%, `H`: 30%). |
| `Class` | `string?` | `null` | Additional CSS class for the wrapper element. |
| `Style` | `string?` | `null` | Additional CSS styles for the wrapper element. |

## Features

- ✅ **SVG Based**: High-quality resolution-independent rendering.
- ✅ **Dynamic**: Re-generates automatically when the `Value` changes.
- ✅ **Lightweight**: Optimized JavaScript integration for fast generation.
- ✅ **Versatile**: Supports any text-based encoding (URLs, WiFi, vCards, JSON).
