using System.Linq.Expressions;
using Blazwind.Components.Shared;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Web;

namespace Blazwind.Components.Input;

/// <summary>
///     Base class for all input components providing common parameters and functionality
/// </summary>
/// <typeparam name="TValue">The type of the input value</typeparam>
public abstract class BwBaseInput<TValue> : BwBase, IDisposable
{
    #region IDisposable

    public virtual void Dispose()
    {
        if (CascadedEditContext != null) CascadedEditContext.OnValidationStateChanged -= HandleValidationStateChanged;
    }

    #endregion

    #region Lifecycle

    protected override void OnInitialized()
    {
        if (CascadedEditContext != null && For != null)
        {
            FieldIdentifier = FieldIdentifier.Create(For);
            CascadedEditContext.OnValidationStateChanged += HandleValidationStateChanged;
        }
    }

    #endregion

    #region Cascading Parameters

    [CascadingParameter]
    protected EditContext? CascadedEditContext { get; set; }

    [CascadingParameter]
    protected BwLabelPosition? CascadedLabelPosition { get; set; }

    [CascadingParameter]
    protected BwFormDensity? CascadedDensity { get; set; }

    [CascadingParameter]
    protected BwHelpTextMode? CascadedHelpTextMode { get; set; }

    #endregion

    #region Common Parameters

    /// <summary>Input label text</summary>
    [Parameter]
    public string? Label { get; set; }

    /// <summary>Label position - overrides cascade if set</summary>
    [Parameter]
    public BwLabelPosition? LabelPosition { get; set; }

    /// <summary>Label width for Left position (e.g., "120px", "30%")</summary>
    [Parameter]
    public string LabelWidth { get; set; } = "120px";

    /// <summary>Placeholder text</summary>
    [Parameter]
    public string? Placeholder { get; set; }

    /// <summary>Helper/description text</summary>
    [Parameter]
    public string? HelperText { get; set; }

    /// <summary>Help text display mode - overrides cascade if set</summary>
    [Parameter]
    public BwHelpTextMode? HelpTextMode { get; set; }

    /// <summary>Validation state - false shows error styling</summary>
    [Parameter]
    public bool IsValid { get; set; } = true;

    /// <summary>Error message to display</summary>
    [Parameter]
    public string? ErrorMessage { get; set; }

    /// <summary>Required field indicator (*)</summary>
    [Parameter]
    public bool IsRequired { get; set; }

    /// <summary>Disabled state</summary>
    [Parameter]
    public bool IsDisabled { get; set; }

    /// <summary>Read-only state</summary>
    [Parameter]
    public bool IsReadOnly { get; set; }

    /// <summary>Component size</summary>
    [Parameter]
    public BwSize Size { get; set; } = BwSize.Medium;


    /// <summary>Form density - overrides cascade if set</summary>
    [Parameter]
    public BwFormDensity? Density { get; set; }

    #endregion

    #region Value Binding

    /// <summary>Current value (two-way binding)</summary>
    [Parameter]
    public TValue? Value { get; set; }

    /// <summary>Callback when value changes</summary>
    [Parameter]
    public EventCallback<TValue?> ValueChanged { get; set; }

    /// <summary>Expression for validation binding</summary>
    [Parameter]
    public Expression<Func<TValue>>? For { get; set; }

    #endregion

    #region Event Callbacks

    /// <summary>Fired when value changes</summary>
    [Parameter]
    public EventCallback<TValue?> OnChange { get; set; }

    /// <summary>Fired when input receives focus</summary>
    [Parameter]
    public EventCallback<FocusEventArgs> OnFocus { get; set; }

    /// <summary>Fired when input loses focus</summary>
    [Parameter]
    public EventCallback<FocusEventArgs> OnBlur { get; set; }

    /// <summary>Fired when input is clicked</summary>
    [Parameter]
    public EventCallback<MouseEventArgs> OnClick { get; set; }

    /// <summary>Fired on key down</summary>
    [Parameter]
    public EventCallback<KeyboardEventArgs> OnKeyDown { get; set; }

    /// <summary>Fired on key up</summary>
    [Parameter]
    public EventCallback<KeyboardEventArgs> OnKeyUp { get; set; }

    #endregion

    #region Protected State

    protected FieldIdentifier FieldIdentifier;
    protected IEnumerable<string> ValidationMessages = Enumerable.Empty<string>();
    protected bool HasValue => Value != null && !Value.Equals(default(TValue));
    protected bool IsFocused { get; set; }

    #endregion

    #region Computed Properties

    protected BwLabelPosition EffectiveLabelPosition =>
        LabelPosition ?? CascadedLabelPosition ?? BwLabelPosition.Top;

    protected BwFormDensity EffectiveDensity =>
        Density ?? CascadedDensity ?? BwFormDensity.Normal;

    protected BwHelpTextMode EffectiveHelpTextMode =>
        HelpTextMode ?? CascadedHelpTextMode ?? BwHelpTextMode.Inline;

    protected bool HasError => !IsValid || !string.IsNullOrEmpty(ErrorMessage) || ValidationMessages.Any();
    protected bool HasLabel => !string.IsNullOrEmpty(Label);
    protected bool HasHelper => !string.IsNullOrEmpty(HelperText);
    protected string? DisplayError => ErrorMessage ?? ValidationMessages.FirstOrDefault();

    #endregion

    #region Event Handlers

    protected virtual void HandleValidationStateChanged(object? sender, ValidationStateChangedEventArgs e)
    {
        ValidationMessages = CascadedEditContext!.GetValidationMessages(FieldIdentifier);
        StateHasChanged();
    }

    protected virtual async Task HandleValueChanged(TValue? newValue)
    {
        Value = newValue;
        await ValueChanged.InvokeAsync(newValue);
        await OnChange.InvokeAsync(newValue);

        if (CascadedEditContext != null && For != null) CascadedEditContext.NotifyFieldChanged(FieldIdentifier);
    }

    protected virtual async Task HandleFocus(FocusEventArgs e)
    {
        IsFocused = true;
        await OnFocus.InvokeAsync(e);
    }

    protected virtual async Task HandleBlur(FocusEventArgs e)
    {
        IsFocused = false;
        await OnBlur.InvokeAsync(e);
    }

    protected virtual async Task HandleClick(MouseEventArgs e)
    {
        await OnClick.InvokeAsync(e);
    }

    protected virtual async Task HandleKeyDown(KeyboardEventArgs e)
    {
        await OnKeyDown.InvokeAsync(e);
    }

    protected virtual async Task HandleKeyUp(KeyboardEventArgs e)
    {
        await OnKeyUp.InvokeAsync(e);
    }

    #endregion

    #region CSS Helpers

    protected string GetSizeClass()
    {
        return Size switch
        {
            BwSize.Small => "bw-input-small",
            BwSize.Large => "bw-input-large",
            _ => "bw-input-medium"
        };
    }

    protected string GetDensityMarginClass()
    {
        return EffectiveDensity switch
        {
            BwFormDensity.Compact => "mb-2",
            BwFormDensity.Relaxed => "mb-6",
            _ => "mb-4"
        };
    }

    protected string GetLabelSpacingClass()
    {
        return EffectiveDensity switch
        {
            BwFormDensity.Compact => "mb-0.5",
            BwFormDensity.Relaxed => "mb-2",
            _ => "mb-1.5"
        };
    }

    protected string GetStateClass()
    {
        return HasError
            ? "bw-input-error"
            : "";
    }

    protected string GetDisabledClass()
    {
        return IsDisabled
            ? "bw-input-disabled"
            : "";
    }

    protected string GetBaseInputClass()
    {
        return "bw-input";
    }

    #endregion
}