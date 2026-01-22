# VirtualScroll

A high-performance component for rendering large lists by only injecting elements that are currently visible within the viewport. Ideal for datasets with thousands of items.

## Examples

### Large Dataset
```razor
<BwVirtualScroll Items="@_users" ItemHeight="60" ContainerHeight="500">
    <ItemTemplate Context="user">
        <div class="flex items-center p-2 border-b">
            <BwAvatar Text="@user.Name" />
            <span class="ml-3">@user.Name</span>
        </div>
    </ItemTemplate>
</BwVirtualScroll>

@code {
    private List<User> _users = GenerateThousandsOfUsers();
}
```

## API - BwVirtualScroll

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Items` | `IEnumerable<TItem>`| - | **Required**. The complete collection of data items. |
| `ItemTemplate`| `RenderFragment<TValue>`| - | **Required**. Template used to render each visible item. |
| `ItemHeight` | `int` | `48` | **Required**. Fixed height of a single item in pixels. |
| `ContainerHeight`| `int` | `400` | Fixed height of the scroll container in pixels. |
| `BufferCount` | `int` | `5` | Number of hidden items to render above/below the viewport to prevent flickering. |
| `Class` | `string?` | `null` | CSS class for the scroll container. |
| `Style` | `string?` | `null` | CSS styles for the scroll container. |

## Features

- ✅ **High Performance**: Drastically reduces DOM nodes and memory footprint.
- ✅ **Smooth Experience**: Uses smart buffering to ensure fluid scrolling.
- ✅ **Type Safe**: Supports generic types (`TItem`) for full IntelliSense support.
- ✅ **Reactive**: Re-renders efficiently when the collection changes.

> [!IMPORTANT]
> `ItemHeight` must be a fixed value for the virtualization logic to calculate offsets correctly. Variable height items are currently not supported.
