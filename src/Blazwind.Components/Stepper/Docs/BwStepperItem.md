# StepperItem

Represents a single step within a [Stepper](Stepper/Docs/BwStepper.md) component.

## Examples

```razor
<BwStepperItem Title="Step Title" Description="Optional description" Icon="fa-solid fa-user">
    <ChildContent>
        <p>This content is shown when this step is active.</p>
    </ChildContent>
</BwStepperItem>
```

## API - BwStepperItem

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `Title` | `string` | `""` | The main title of the step. |
| `Description` | `string` | `null` | Optional sub-text or description. |
| `Icon` | `string` | `null` | Custom icon class (replaces the index number). |
| `IconContent` | `RenderFragment` | `null` | Custom content for the step indicator circle. |
| `IsDisabled` | `bool` | `false` | If true, the step cannot be clicked/navigated to. |
| `IsError` | `bool` | `false` | Shows the step in an error state. |
| `IsOptional` | `bool` | `false` | added an "Optional" label to the step. |
| `ChildContent` | `RenderFragment` | `null` | The content to display when this step is active. |
| `Color` | `BwColor` | `Primary` | Theme color (Inherits from parent if not set). |
