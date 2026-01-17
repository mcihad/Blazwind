namespace Blazwind.Components.Shared;

/// <summary>
/// Preset mask types for common input formats
/// </summary>
public enum BwMaskPreset
{
    /// <summary>Phone number: (###) ### ## ##</summary>
    Phone,

    /// <summary>Credit card: #### #### #### ####</summary>
    CreditCard,

    /// <summary>Date: ##/##/####</summary>
    Date,

    /// <summary>Time: ##:##</summary>
    Time,

    /// <summary>Turkish IBAN: TR## #### #### #### #### #### ##</summary>
    Iban
}