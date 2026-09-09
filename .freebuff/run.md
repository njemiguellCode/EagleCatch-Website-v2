# EagleCatch Website v2 - Preview Run Doc

## Overview
Pure static HTML/CSS/JS website. No build process, no dependencies, no package.json.

## Pages
- `index.html` — Landing page (hero search, stats, steps, fresh finds)
- `find.html` — Find items (search, category + status filters, sort, autocomplete)
- `item.html` — Item detail + inline claim form (`?id=ASKI-000123`)
- `report.html` — Report Found Item structured form
- Form backend: FormSubmit AJAX — ALL forms (report, claim, contact) deliver to nickoseser@gmail.com. First-ever submission triggers a one-time "Activate Form" email to that inbox; clicking it enables delivery.
- `user-manual.html` — User manual (quick start, lost/found walkthroughs, status guide, FAQ)
- `about.html`, `contact.html` — About / contact
- `assets/images/favicon.svg` — Favicon (referenced by all pages)

## How to Run (dev server on port 8080)
From the project root, detached (Windows / PowerShell):

```
powershell -NoProfile -Command "(Start-Process -FilePath 'python.exe' -ArgumentList '-m','http.server','8080','--bind','127.0.0.1' -WorkingDirectory 'C:\Users\nicko\Documents\EagleCatch Website v2' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"
```

- Verify: `netstat -ano | grep ":8080" | grep -i listen`, then `curl http://127.0.0.1:8080/index.html` → HTTP 200
- Register preview with URL `http://127.0.0.1:8080/index.html` and the printed PID.
- Note: `Start-Process` via this tool can print nothing and "time out" while still succeeding — check the port before restarting.

## No Build Required
Open `index.html` directly in a browser also works, but serving over HTTP is preferred
(fetch/data.js and consistent URLs).

## Caching Notes
- HTML pages carry `Cache-Control: no-cache` meta tags.
- Versioned asset URLs (`styles.css?v=5`, `main.js?v=7`, `find.js?v=8`, `item.js?v=8`, `data.js?v=2`) — bump `?v=` when editing those files, else the browser may serve stale copies. data.js IS versioned (photos were invisible until it was).
- Items in `data.js` carry a `photo` field (picsum.photos seeded placeholders). Replace with real photos per item; cards show a 4:3 thumb, item page a 16:9 photo. Field is optional — items without it simply render without images.
