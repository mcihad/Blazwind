using Blazwind.Components.Shared;

namespace Blazwind.Components.List;

/// <summary>Interface for non-generic access to BwList</summary>
public interface IBwListParent
{
    bool EnableSorting { get; }
    BwSelectionMode SelectionMode { get; }
    bool IsSelected(int index);
    Task ToggleSelection(int index);
}