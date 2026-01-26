using Blazwind.Components.Services;
using Microsoft.JSInterop;
using Xunit;

public class ScriptLoaderServiceTests
{
    private sealed class ThrowingJsRuntime : IJSRuntime
    {
        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, object?[]? args)
        {
            throw new InvalidOperationException("JS should not be invoked for invalid inputs.");
        }

        public ValueTask<TValue> InvokeAsync<TValue>(string identifier, CancellationToken cancellationToken, object?[]? args)
        {
            throw new InvalidOperationException("JS should not be invoked for invalid inputs.");
        }
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("javascript:alert(1)")]
    [InlineData("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==")]
    [InlineData("vbscript:alert(1)")]
    [InlineData("file:///etc/passwd")]
    [InlineData("http://example.com/\0")]
    public async Task LoadScriptAsync_RejectsUnsafePaths(string path)
    {
        var service = new ScriptLoaderService(new ThrowingJsRuntime());

        await Assert.ThrowsAsync<ArgumentException>(() => service.LoadScriptAsync(path));
    }

    [Theory]
    [InlineData("")]
    [InlineData("javascript:alert(1)")]
    [InlineData("data:text/css;base64,Zm9v")]
    [InlineData("vbscript:alert(1)")]
    [InlineData("file:///etc/passwd")]
    public async Task LoadStyleAsync_RejectsUnsafePaths(string path)
    {
        var service = new ScriptLoaderService(new ThrowingJsRuntime());

        await Assert.ThrowsAsync<ArgumentException>(() => service.LoadStyleAsync(path));
    }
}
