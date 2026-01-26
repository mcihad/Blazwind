# Security Policy

## Reporting a Vulnerability

If you discover a security issue, please report it privately by opening a GitHub Security Advisory or by emailing the maintainer listed in the repository profile. Do not disclose vulnerabilities publicly until they have been triaged.

## Supported Versions

| Version | Supported |
| --- | --- |
| 0.0.x (alpha) | ✅ |

## Security Practices

- **Script loading guardrails:** `ScriptLoaderService` blocks unsafe URL schemes (javascript/data/vbscript).
- **UI text escaping:** Toasts and JS dialogs render user text via DOM APIs to prevent XSS.
- **Blazor encoding:** Razor components HTML-encode by default; only use `MarkupString` with trusted input.
- **Dependency hygiene:** Dependencies should be reviewed regularly for vulnerabilities.
