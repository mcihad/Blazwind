# Expanded

A utility component designed to fill available space within a flexbox layout.

## Usage

Use `BwExpanded` inside a `BwFlex`, `BwRow`, or any flexbox container to push surrounding elements to the edges.

```razor
@using Blazwind.Components.Layout

<BwFlex>
    <div>Left Content (Fixed)</div>
    
    <BwExpanded>
        This content fills all remaining horizontal space.
    </BwExpanded>
    
    <div>Right Content (Fixed)</div>
</BwFlex>
```

## Parameters

| Parameter  | Type      | Default | Description                                                                                                            |
|:-----------|:----------|:--------|:-----------------------------------------------------------------------------------------------------------------------|
| `Expanded` | `bool`    | `false` | If true, applies `flex-1` class.                                                                                       |
| `Flex`     | `int`     | `0`     | Custom flex-grow value. Use this to create proportional space (e.g., `Flex="2"` takes twice as much space as default). |
| `Class`    | `string?` | `null`  | Custom CSS classes.                                                                                                    |

### Proportional Expansion Example

```razor
<BwFlex>
    <BwExpanded Flex="1" Class="bg-gray-100">Takes 1/3</BwExpanded>
    <BwExpanded Flex="2" Class="bg-gray-200">Takes 2/3</BwExpanded>
</BwFlex>
```
