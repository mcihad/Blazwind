# BwImagePreview

A high-fidelity image gallery and preview component with a built-in Lightbox. It allows users to view a collection of images as thumbnails and expand them into a full-screen interactive viewer.

## Features

- ✅ **Gallery Mode:** Automatically lists images as selectable thumbnails.
- ✅ **Lightbox Viewer:** Seamless full-screen overlay with backdrop blur.
- ✅ **Navigation:** Integrated "Next" and "Previous" controls for multi-image sets.
- ✅ **Smart Limiting:** Show a subset of thumbnails and hide others behind a "+N More" indicator (`MaxCount`).
- ✅ **Keyboard Support:** Navigate with arrow keys and close with `ESC`.
- ✅ **Looping:** Option to wrap back to the first image after reaching the end.

## Usage

### Basic Gallery
```razor
@{
    var myImages = new List<string> { 
        "https://picsum.photos/id/10/800/600", 
        "https://picsum.photos/id/11/800/600" 
    };
}
<BwImagePreview Images="@myImages" />
```

### Custom Thumbnail Sizes
```razor
<BwImagePreview Images="@myImages" 
                ThumbnailWidth="200px" 
                ThumbnailHeight="150px" />
```

### Limited Display (+N More)
If you have 10 images but only want to show 3 thumbnails:
```razor
<BwImagePreview Images="@myImages" MaxCount="3" />
```

## API Reference

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Images` | `List<string>` | `null` | List of Image URLs to display. |
| `MaxCount` | `int` | `0` | Max thumbnails to show (0 = reveal all). |
| `ThumbnailWidth` | `string` | `"100px"` | CSS width for thumbnails. |
| `ThumbnailHeight`| `string` | `"100px"` | CSS height for thumbnails. |
| `ThumbnailClass` | `string?` | `null` | Custom class for thumbnail containers. |
| `Loop` | `bool` | `true` | Whether to restart at image 1 after the last one. |
| `Class` | `string?` | `null` | Custom class for the component container. |

## Interaction
- **Click:** Opens the high-fidelity lightbox.
- **Arrows:** Navigate between images in the lightbox.
- **ESC:** Closes the lightbox.
