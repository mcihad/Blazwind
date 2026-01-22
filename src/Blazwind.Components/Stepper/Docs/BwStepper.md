# Stepper

A navigation component that guides users through a series of steps or a workflow (wizard).

## Examples

### Basic Usage

```razor
<BwStepper @bind-ActiveStep="activeStep">
    <BwStepperItem Title="Step 1" />
    <BwStepperItem Title="Step 2" />
    <BwStepperItem Title="Step 3" />
</BwStepper>

@code {
    private int activeStep = 0;
}
```

### Variants
The `Variant` parameter supports different styles: `Default`, `Dots`, `Pills`, `Progress`, `Icons`.

```razor
<BwStepper Variant="BwStepperVariant.Progress" @bind-ActiveStep="step">
    <!-- Items -->
</BwStepper>
```

### Orientation
Use `Orientation` to switch between `Vertical` and `Horizontal` layouts.

```razor
<BwStepper Orientation="BwOrientation.Vertical">
    <BwStepperItem Title="Personal Info" Description="Name & Email">
        <ChildContent>
            <!-- Step Content -->
        </ChildContent>
    </BwStepperItem>
    <BwStepperItem Title="Account Info" Description="Password">
        <ChildContent>
            <!-- Step Content -->
        </ChildContent>
    </BwStepperItem>
</BwStepper>
```

### Alternative Label
Use `AlternativeLabel` to place labels below the step icons (Horizontal mode).

## API - BwStepper

### Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `ActiveStep` | `int` | `0` | The index of the currently active step (Two-way binding). |
| `Variant` | `BwStepperVariant` | `Default` | Visual style: `Default`, `Dots`, `Pills`, `Progress`, `Icons`. |
| `Orientation` | `BwOrientation` | `Horizontal` | Layout direction: `Horizontal`, `Vertical`. |
| `Linear` | `bool` | `true` | If true, user must complete steps in order. |
| `ShowConnectors`| `bool` | `true` | Whether to show lines between steps. |
| `AlternativeLabel`| `bool` | `false` | Positions labels below the icon (Horizontal only). |
| `Size` | `BwSize` | `Medium` | Size of the indicators. |
| `Class` | `string?` | `null` | Custom CSS class. |

### See Also
- [StepperItem](Stepper/Docs/BwStepperItem.md)
