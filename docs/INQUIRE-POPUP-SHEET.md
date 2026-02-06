# Inquire popup – enable/disable from Google Sheet (Global tab)

The site can show an **inquire popup** (same form as the home hero) in two cases:

1. **Scroll popup** – after the user scrolls **85%** of the page.
2. **Exit-intent popup** – when the user moves the mouse toward the top of the window (e.g. to close the tab or leave).

Both are controlled by the **Global** sheet so you can turn them on or off without code changes.

---

## Global sheet keys (key-value rows)

Add these rows to your **Global** tab (or edit existing ones):


| key                     | value        | Effect                                                                                                      |
| ----------------------- | ------------ | ----------------------------------------------------------------------------------------------------------- |
| **showScrollPopup**     | true / false | **true** (or 1 or yes) = show popup after scrolling 85%. **false** or empty = no scroll popup.              |
| **showExitIntentPopup** | true / false | **true** (or 1 or yes) = show popup on exit intent (mouse leaving top). **false** or empty = no exit popup. |


- Values are case-insensitive; **true**, **1**, **yes** = enabled. Anything else = disabled.
- The popup uses the same form as the hero: **formIframeUrl** from Global (iframe embed) or the fallback form fields.

---

## Behaviour

- Each popup type is shown **at most once per session** (scroll popup once, exit popup once).
- User can close the popup with the X button or by clicking the dark backdrop.
- Form inside the popup is the same as “Inquire Now” on the home screen (same iframe URL or same fields).

