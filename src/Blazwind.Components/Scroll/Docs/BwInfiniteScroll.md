# InfiniteScroll

A component that enables "Endless Scrolling" or "Load More" functionality by detecting when the user reaches the bottom of the container. Ideal for feeds, logs, and paginated API results.

## Examples

### Basic Feed
```razor
<BwInfiniteScroll OnLoadMore="LoadNextPage" HasMore="@_hasMore">
    @foreach (var post in _posts)
    {
        <BwCard Title="@post.Title" Class="mb-4">
            @post.Content
        </BwCard>
    }
</BwInfiniteScroll>

@code {
    private List<Post> _posts = new();
    private bool _hasMore = true;

    private async Task LoadNextPage()
    {
        var newPosts = await Api.GetPostsAsync(page++);
        _posts.AddRange(newPosts);
        _hasMore = newPosts.Any();
    }
}
```

## API - BwInfiniteScroll

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `OnLoadMore` | `EventCallback`| - | Fired when the user scrolls near the bottom. |
| `HasMore` | `bool` | `true` | Set to `false` when there is no more data to load. |
| `EndMessage` | `string` | `"No more items"`| Text displayed when `HasMore` is false. |
| `Threshold` | `int` | `100` | Distance (px) from the bottom that triggers the event. |
| `Class` | `string?` | `null` | Additional CSS class for the wrapper. |

### Render Fragments (Slots)

| Slot | Description |
| :--- | :--- |
| `ChildContent`| The main content area where items are rendered. |
| `LoadingTemplate`| Custom UI to show during the async loading state. |

## Features

- ✅ **Intersection Observer**: Uses modern browser APIs for efficient detection.
- ✅ **Automatic Loading State**: Built-in spinner support.
- ✅ **Debounced**: Prevents multiple rapid triggers during a single scroll action.
- ✅ **Universal**: Works with any content type or container size.
