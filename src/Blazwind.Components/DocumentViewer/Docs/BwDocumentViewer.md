# BwDocumentViewer

A high-performance document and image viewer. Specifically designed for Enterprise Document Management (EDM) systems, it
supports PDFs and various image formats with built-in editing tools.

## Features

- ✅ **PDF Integration**: Seamless rendering using the browser's native engine.
- ✅ **Image Editing**: Integrated tools for **Rotation**, **Zoom**, and **Grayscale** filters.
- ✅ **Metadata Display**: Displays image dimensions, MIME type, and file size.
- ✅ **On-the-fly Save**: Capture modified images (rotated/filtered) as Base64 data.
- ✅ **Toolbar Controls**: Download, print, and fullscreen support.

## Usage

### Simple PDF Viewer

```razor
<BwDocumentViewer Url="https://example.com/report.pdf" 
                  Type="DocumentType.Pdf" 
                  Height="600px" />
```

### Image Editor Mode

```razor
<BwDocumentViewer Url="https://example.com/identity-card.jpg" 
                  Type="DocumentType.Jpeg" 
                  OnSave="HandleImageModified" />

@code {
    private void HandleImageModified(string base64Data)
    {
        // Save the edited (e.g. rotated) image back to your server
    }
}
```

## API Reference

### Parameters

| Parameter              | Type           | Default   | Description                                      |
|------------------------|----------------|-----------|--------------------------------------------------|
| `Url`                  | `string?`      | `null`    | The source URL of the document.                  |
| `Data`                 | `string?`      | `null`    | Base64 string data (alternative to `Url`).       |
| `Type`                 | `DocumentType` | `Pdf`     | The format: `Pdf`, `Png`, `Jpeg`, `Gif`, `Webp`. |
| `Height`               | `string`       | `"600px"` | Visual height of the viewer container.           |
| `InitialZoom`          | `double`       | `1.0`     | Initial zoom level for images.                   |
| `ShowToolbar`          | `bool`         | `true`    | Whether to display the control bar.              |
| `ShowDownloadButton`   | `bool`         | `true`    | Show/hide the download anchor.                   |
| `ShowPrintButton`      | `bool`         | `true`    | Show/hide the printer trigger.                   |
| `ShowFullscreenButton` | `bool`         | `true`    | Show/hide the fullscreen toggle.                 |

### Event Callbacks

| Event     | Payload  | Description                                                          |
|-----------|----------|----------------------------------------------------------------------|
| `OnLoad`  | `int`    | Triggered when the document is ready (sends page count).             |
| `OnSave`  | `string` | Triggered when the 'Save' button is clicked (sends modified Base64). |
| `OnError` | `string` | Triggered if document loading fails.                                 |

## Methods (Public)

- `ZoomInAsync()`: Increase image scale by 0.25x.
- `ZoomOutAsync()`: Decrease image scale by 0.25x.
- `RotateRight()`: Rotate the image 90 degrees clockwise.
- `RotateLeft()`: Rotate the image 90 degrees counter-clockwise.
- `ToggleGrayscale()`: Toggle the B&W filter.
- `ToggleFullscreenAsync()`: Enter or exit fullscreen mode.

## Technical Details

- **PDFs**: Rendered via an `<iframe>` targeting the direct URL or Base64 data.
- **Images**: Enhanced with CSS transforms and filters for high-speed manipulation.
- **Editing**: When clicking 'Save', the component uses JS to draw the current image state (with transforms) onto a
  hidden `<canvas>` and exports the new data.
