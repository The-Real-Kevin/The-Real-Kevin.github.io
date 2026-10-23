---
name: Preview routing checks
description: Distinguish local screenshot success from the actual user-facing preview.
---

When a user cannot see changes despite a successful app-preview screenshot, check the default development-domain URL and its forwarded port.

**Why:** The local screenshot reached the updated app while the default preview address returned 502 because it forwarded to an unused port.

**How to apply:** Verify both the running service and the default development-domain response; do not assume a successful local screenshot proves that the user's preview can reach the app.

Do not rely on a manually corrected forwarding map remaining unchanged; preview routing can be regenerated.

**Why:** The default route repeatedly reverted to an unused port while the port-specific preview still worked, including after an apparently successful restart.

**How to apply:** Preview fixes must tolerate both the default-domain and port-specific routes. Verify both after workflow configuration changes rather than repeatedly rewriting the same mapping.
