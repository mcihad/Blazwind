# BwCardBody

A simple wrapper for the main content area of a card, providing consistent padding.

## Usage

```razor
<BwCard>
    <BwCardBody>
        Main content goes here with default 1.5rem (24px) padding.
    </BwCardBody>
</BwCard>
```

## API

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `ChildContent`| `RenderFragment?`| `null` | Content inside the body. |
| `Class` | `string?` | `null` | Additional CSS classes. |
