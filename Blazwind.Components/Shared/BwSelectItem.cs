namespace Blazwind.Components.Shared;

/// <summary>
/// Represents an item in a select dropdown or radio group.
/// </summary>
/// <typeparam name="TValue">The type of the value.</typeparam>
public record BwSelectItem<TValue>(
    TValue Value,
    string Text,
    bool IsDisabled = false,
    string? Group = null
);