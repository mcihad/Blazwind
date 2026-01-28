# File Upload

A drag-and-drop–enabled file upload area.

## Features

* **Drag & Drop:** Upload files by dragging them into the area.
* **Preview:** Displays a list and icons of uploaded files.
* **Constraints:** File control using `MaxFileSize`, `MaxFiles`, and `Accept`.

## Usage

### Basic Usage

```razor
<BwFileUpload Label="Documents" @bind-Files="uploadedFiles" />
```

### With Restrictions (Images Only)

```razor
<BwFileUpload Accept=".jpg,.png" MaxFileSize="1048576" HelperText="Max 1MB, JPG/PNG" />
```

### Single File

```razor
<BwFileUpload Multiple="false" Label="Profile Photo" />
```

## Parameters

| Parameter     | Type                 | Default | Description                                   |
|:--------------|:---------------------|:--------|:----------------------------------------------|
| `Files`       | `List<IBrowserFile>` | `new()` | Selected files (two-way binding).             |
| `Accept`      | `string`             | `null`  | Accepted file extensions (e.g., `.jpg,.pdf`). |
| `MaxFileSize` | `long?`              | `null`  | Maximum file size (in bytes).                 |
| `MaxFiles`    | `int?`               | `10`    | Maximum number of selectable files.           |
| `Multiple`    | `bool`               | `true`  | Allows selecting multiple files.              |
| `ShowPreview` | `bool`               | `true`  | Shows the list of uploaded files below.       |
| `Label`       | `string`             | `null`  | Field label.                                  |
| `HelperText`  | `string`             | `null`  | Helper text.                                  |
| `IsDisabled`  | `bool`               | `false` | Disables the component.                       |

## Events

| Event            | Payload                       | Description                                            |
|:-----------------|:------------------------------|:-------------------------------------------------------|
| `FilesChanged`   | `List<IBrowserFile>`          | Triggered whenever the file list changes (add/remove). |
| `OnFileSelected` | `IReadOnlyList<IBrowserFile>` | Triggered only when new files are selected.            |
