# WebNovelSync

A Chrome extension that copies web-fiction chapters from one platform and posts or schedules them on up to eight others.

**Chrome Web Store:** https://chromewebstore.google.com/detail/gnemgbbfllodlnbioibbgkfkbpblphne

## Why I built it

I translate a web novel, and every new chapter had to be posted by hand on every site I published on: copy the title, paste the body, fix the formatting, pick the right story, set a release time, then do it again on the next site. Most of these platforms have no public API, so there was nothing to automate against except the sites themselves. WebNovelSync does that copying for me, and now for its other users too.

## What it does

1. **Scan a range of chapters** from the story open in the current tab. Supported sources: Webnovel, ScribbleHub, FanFiction.net, AO3, Royal Road, and Wattpad.
2. **Choose target platforms** and a mode for each one: post now, save as a draft, or schedule.
3. **Post** each chapter to ScribbleHub, FanFiction.net, AO3, Royal Road, Webnovel (Inkstone), Wattpad, Inkitt, or Tapas.
4. **Schedule releases.** Chapters can be spread out on a release schedule: a start date and time, how many chapters per release, and how many days between releases (for example, two chapters every seven days at noon). Scheduled posts are stored and fired by Chrome alarms, and anything missed while the browser was closed is posted on the next launch and marked as late.
5. **Recover from failures.** Progress is saved after every chapter, so a failed chapter can be retried on its own instead of restarting the whole sync.

## How it works

```
popup (popup.html / popup.js)
   │  chapter range, targets, post mode
   ▼
background service worker (background.js, Manifest V3)
   ├─ scanCurrentTab / fetchChapterFromSource   → chapter titles + content
   │     └─ offscreen document (offscreen.js)   → parses fetched HTML with DOMParser
   ├─ postChapterToPlatform                     → one adapter per platform
   │     postToScribbleHub, postToFanFiction, postToAO3, postToRoyalRoad,
   │     postToWebnovel, postToWattpad, postToInkitt, postToTapas
   ├─ queues + chrome.alarms                    → scheduled and missed posts
   └─ chrome.storage.local                      → progress, settings, retry state

content scripts (*_verification.js)             → check sign-in on each site
```

- **One adapter per platform.** Every site has a different editor, login flow, and publishing form, so each platform has its own posting function. A change on one site only breaks one adapter.
- **Ownership checks.** Before posting, the extension confirms the signed-in account owns the target story (`verifyRoyalRoadOwnership`, `verifyAO3Ownership`, and so on), so it never posts to someone else's work.
- **No passwords.** The extension uses the sessions you are already signed in to. It never asks for, reads, or stores your login details.
- **Offscreen parsing.** Manifest V3 service workers have no DOM, so fetched chapter pages are parsed in an offscreen document.

## Install from source

1. Clone this repository.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the repository folder.
4. Sign in to the platforms you want to post on, then open the extension from the toolbar.

To build the minified version that is published to the Chrome Web Store:

```bash
npm install
npm run build
```

This runs Grunt and writes the minified extension to `dist/`.

## Files

| File | What it is |
| --- | --- |
| `manifest.json` | Extension manifest (Manifest V3) |
| `background.js` | Service worker: scanning, platform adapters, queues, scheduling, retries |
| `popup.html`, `popup.js`, `popup.css` | The extension's interface |
| `offscreen.html`, `offscreen.js` | Parses fetched chapter HTML |
| `*_verification.js` | Content scripts that check sign-in status on each platform |
| `Gruntfile.js` | Build script for the minified release |
| `webnovelsyncwebsite/` | The extension's website and privacy policy (React, TypeScript, Tailwind) |

## Limitations

Because the platforms have no shared API, the adapters depend on each site's current page layout. When a site redesigns its editor, that platform's adapter has to be updated.
