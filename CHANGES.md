# CareTwin frontend update

## New
- Profile page (/dashboard/profile): photo upload, health details, emergency contacts, completeness score
- Family (/dashboard/family): add/edit/remove members; the header switcher scopes every page
- Emergency QR (/dashboard/emergency + public /emergency): choose fields, link or plain-text QR, PNG/SVG/print
- Report Summary (/dashboard/reports): summary for any member + period (1/3/4/6/12 months or custom)
- Medical Records: working add/view/download/delete, period limiter, 12-month activity strip, card/timeline views
- Pages: AI Diagnostics, Integrations, FAQs, Contact, Privacy, Terms, HIPAA, Security, 404

## Fixed
- 3 lint errors + 12 warnings; broken footer links; dead buttons (search, bell, symptom analyze, hero CTAs)
- Geist font was referenced but never loaded; 8-10px text raised to readable sizes
- Settings tabs now work; Settings/Support moved into the dashboard shell (no duplicate headers)
- Navbar is responsive; login/signup have validation and their own layout
- Removed 8 empty/unused files; replaced the next/dist/client/link import

## Notes
- Data lives in localStorage (lib/store.ts). Swap lib/useCareData.ts for API calls when the backend exists.
- AI chat, symptom analysis and report summary are local stand-ins (lib/analyze.ts, lib/summary.ts).
- Change support email / emergency number in lib/site.ts.
- New dependencies: qrcode, geist (+ @types/qrcode). Run `npm install`.
