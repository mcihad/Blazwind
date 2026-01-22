# BwApprovalChain

A component used to visualize approval processes. Ideal for tracking petitions, permits, document approvals, or any multi-step workflow.

## Features

- ✅ Horizontal and vertical layouts.
- ✅ Approver avatar and personal information display.
- ✅ Status indicators (Pending, Approved, Rejected, Skipped).
- ✅ Date and time stamps.
- ✅ Comment/note area for each step.
- ✅ Interactive clickable steps.
- ✅ Progress bar display.

## Basic Usage

```razor
<BwApprovalChain Steps="@_steps" 
                 Direction="ApprovalDirection.Horizontal" 
                 OnStepClick="HandleStepClick" />

@code {
    private List<ApprovalStep> _steps = new()
    {
        new() { Id = "1", Title = "Application", Status = ApprovalStatus.Approved },
        new() { Id = "2", Title = "Review", Status = ApprovalStatus.Pending, ApproverName = "John Doe" },
        new() { Id = "3", Title = "Final Approval", Status = ApprovalStatus.Pending }
    };

    private void HandleStepClick(ApprovalStep step)
    {
        // Handle step interaction
    }
}
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `Steps` | `List<ApprovalStep>` | - | The list of approval steps. |
| `Direction` | `ApprovalDirection` | `Horizontal` | Layout direction (`Horizontal` or `Vertical`). |
| `ShowConnectors` | `bool` | `true` | Whether to show connector arrows between steps. |
| `Interactive` | `bool` | `true` | Whether steps are clickable. |
| `ShowActions` | `bool` | `false` | Whether to show action buttons (internal use/extension). |
| `ShowProgress` | `bool` | `true` | Whether to show the progress bar at the top. |
| `Size` | `BwSize` | `BwSize.Medium` | The size of the step cards (`Small`, `Medium`, `Large`). |
| `OnStepClick` | `EventCallback<ApprovalStep>` | - | Triggered when a step is clicked. |

## ApprovalStep Model

| Property | Type | Description |
|----------|------|-------------|
| `Id` | `string` | Unique identifier for the step. |
| `Title` | `string` | Title of the step. |
| `ApproverName` | `string?` | Name of the person responsible for this step. |
| `ApproverRole` | `string?` | Title or role of the approver. |
| `ApproverAvatar` | `string?` | URL for the approver's avatar image. |
| `Status` | `ApprovalStatus` | Current status of the step (`Pending`, `Approved`, `Rejected`, `Skipped`). |
| `Date` | `DateTime?` | The date and time the action was taken. |
| `Comment` | `string?` | A comment or note associated with the step. |

## Status Values

- `Pending` - Waiting for action (gray/blue if active).
- `Approved` - Action successfully completed (green).
- `Rejected` - Action declined (red).
- `Skipped` - Step was bypassed (gray/faded).
