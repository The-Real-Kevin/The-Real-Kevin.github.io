---
name: Browser validation timing
description: Avoid false failures when testing scroll, layout, and native dialogs in Chromium.
---

Use a real-time browser session for scroll, rendering-frame, and native-dialog interaction checks instead of relying on Chromium's dump-DOM virtual-time mode.

**Why:** Virtual time advanced test timers without reliably advancing rendering frames and native scroll/dialog events, producing inconsistent clipping, focus, and navigation failures. The same checks passed across languages, themes, and viewport sizes with real browser timing.

**How to apply:** Use CDP or a normal browser automation session for these interactions. Keep timer-based polling bounded, and distinguish test-clock failures from application failures before changing working UI behavior.
