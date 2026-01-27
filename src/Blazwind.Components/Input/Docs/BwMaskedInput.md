# Masked Input

A component that provides formatted data entry such as Phone, Date, and Credit Card. It inherits `BwBaseInput` features.

## Features

* **Predefined Masks:** Common formats via `BwMaskPreset` (Phone, Date, CreditCard, IBAN).
* **Custom Mask:** Define custom masks using `#` (digit), `A` (letter), `*` (any).

## Usage

### Predefined Mask (Phone)

```razor
<BwMaskedInput Label="Phone" Preset="BwMaskPreset.Phone" @bind-Value="phone" />
```

### Custom Mask (License Plate)

```razor
<BwMaskedInput Label="License Plate" Mask="## AA ####" Placeholder="34 AB 1234" />
```

### Automatic Validation

```razor
<BwMaskedInput @bind-Value="form.Phone" 
               For="@(() => form.Phone)"
               Label="Phone"
               Preset="BwMaskPreset.Phone" />
```

## Parameters

| Parameter     | Type            | Default  | Description                                                                                 |
| :------------ | :-------------- | :------- | :------------------------------------------------------------------------------------------ |
| `Value`       | `string`        | `null`   | Input value (two-way binding).                                                              |
| `Mask`        | `string`        | `""`     | Mask pattern (e.g. `(###) ### ## ##`).                                                      |
| `Preset`      | `BwMaskPreset?` | `null`   | Predefined masks (`Phone`, `CreditCard`, `Date`, `Time`, `Iban`).                           |
| `MaskChar`    | `char`          | `'_'`    | Character shown for empty slots.                                                            |
| `UnmaskValue` | `bool`          | `true`   | If `true`, `Value` returns only raw characters; if `false`, it also includes mask literals. |
| `Placeholder` | `string`        | `null`   | Placeholder (generated from the mask if not provided).                                      |
| `Label`       | `string`        | `null`   | Field label.                                                                                |
| `Size`        | `BwSize`        | `Medium` | Size.                                                                                       |
| `IsDisabled`  | `bool`          | `false`  | Disables the field.                                                                         |
| `For`         | `Expression`    | `null`   | Field reference for validation.                                                             |

## Events

| Event          | Payload  | Description                                             |
| :------------- | :------- | :------------------------------------------------------ |
| `ValueChanged` | `string` | Triggered whenever the value changes (two-way binding). |
| `OnChange`     | `string` | Triggered after the value changes.                      |
| `OnEnter`      | `null`   | Triggered when the Enter key is pressed.                |

## Mask Characters

| Character | Description                                               |
| :-------- | :-------------------------------------------------------- |
| `#`       | Digits only (0–9)                                         |
| `A`       | Letters only (a–z, A–Z)                                   |
| `*`       | Letter or digit                                           |
| Other     | Fixed literal characters (space, dash, parentheses, etc.) |
