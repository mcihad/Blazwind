# Result

A component used to give feedback to the user about the result of an action or the state of the system (Success, Error, Unauthorized, etc.). It can be used as a full-page result or within a container.

## Examples

### Basic Success
```razor
<BwResult Status="BwResultStatus.Success"
          Title="Submission Successful"
          Subtitle="Your application has been received and is under review." />
```

### 404 Page Not Found
```razor
<BwResult Status="BwResultStatus.NotFound404"
          Title="404"
          Subtitle="Sorry, the page you visited does not exist.">
    <Extra>
        <BwButton Variant="BwVariant.Filled" Color="BwColor.Primary">Back Home</BwButton>
    </Extra>
</BwResult>
```

### Detailed Error Message
```razor
<BwResult Status="BwResultStatus.Error"
          Title="Submission Failed"
          Subtitle="Please check your connection and try again.">
    <Extra>
        <BwButton Color="BwColor.Danger" Text="Retry" />
        <BwButton Color="BwColor.Secondary" Variant="BwVariant.Outline" Text="Cancel" />
    </Extra>
    <ChildContent>
        <p class="font-bold mb-1">Error details:</p>
        <code class="text-xs">Connection timeout at db-cluster-01.internal</code>
    </ChildContent>
</BwResult>
```

## API - BwResult

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Status` | `BwResultStatus` | `Info` | Predefined status type (`Success`, `Error`, `Info`, `Warning`, `NotFound404`, `Forbidden403`, `InternalError500`). |
| `Title` | `string?` | `null` | Primary header text. |
| `Subtitle` | `string?` | `null` | Descriptive sub-text below the title. |
| `Class` | `string?` | `null` | Additional CSS class for the container. |

### Render Fragments (Slots)

| Slot | Description |
| :--- | :--- |
| `Icon` | Custom icon to override the predefined status icon. |
| `Extra` | Area for action buttons or links below the description. |
| `ChildContent`| Detailed content area shown within a styled box (useful for error logs). |

## Enums

### BwResultStatus
`Success`, `Error`, `Info`, `Warning`, `NotFound404`, `Forbidden403`, `InternalError500`

## Features

- ✅ **Semantic Icons**: Built-in icons for common system states.
- ✅ **Clean Layout**: Optimized vertical spacing and centered content.
- ✅ **Themed**: Automatically switches between light and dark modes.
- ✅ **Flexible**: Can be used for small alerts or full-screen feedback.
