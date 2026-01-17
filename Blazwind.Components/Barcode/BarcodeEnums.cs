namespace Blazwind.Components.Barcode;

/// <summary>
/// Supported barcode formats
/// </summary>
public enum BarcodeFormat
{
    CODE128,
    CODE128A,
    CODE128B,
    CODE128C,
    EAN13,
    EAN8,
    EAN5,
    EAN2,
    UPC,
    UPCE,
    CODE39,
    ITF14,
    ITF,
    MSI,
    MSI10,
    MSI11,
    MSI1010,
    MSI1110,
    pharmacode,
    codabar
}

/// <summary>
/// Barcode render type
/// </summary>
public enum BarcodeRenderType
{
    Svg,
    Canvas
}