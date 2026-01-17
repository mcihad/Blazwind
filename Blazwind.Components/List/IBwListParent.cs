namespace Blazwind.Components.List;

using Blazwind.Components.Shared;

/// <summary>Interface for non-generic access to BwList</summary>
public interface IBwListParent
{
    bool EnableSorting { get; }
    BwSelectionMode SelectionMode { get; }
    bool IsSelected(int index);
    Task ToggleSelection(int index);
}