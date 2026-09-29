# PrimeTEK Multi Biz Solutions: website

A static, dependency-free website for PrimeTEK Multi Biz Solutions. Its content and look come from the company brochure: white pages, heavy headings with one accent word, flat yellow, blue and orange circles, and a tri-colour rule along the top edge.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: hero, readiness, the three capability pillars, who we serve, Ezugwu MRAP, made-in-Nigeria stats, leadership, gallery strip |
| `about.html` | Story, mission/vision/promise, strategic advantage, values, milestones, incorporation certificate |
| `leadership.html` | Executive Chairman profile, top-level organogram, responsibilities |
| `solutions.html` | Overview of the Anticipate / Secure / Dominate portfolio and delivery process |
| `anticipate.html` | ISR: drones, Eagle Eye RWS, satellite imagery and SAR, MiniSAR, tactical early warning |
| `secure.html` | Tactical vehicles, Ezugwu MRAP, tactical mission vehicles, NN-16M Interceptor, PPE, armouries, counter-UAS |
| `dominate.html` | X30 and M20 quadruped robots, weapons and ammunition sourcing |
| `manufacturing.html` | Made in Nigeria: filterable table of the 16 locally manufactured products and their capacities |
| `advisory.html` | Strategic defence consulting services, engagement model, sectors, FAQ |
| `gallery.html` | Filterable photo gallery with a lightbox |
| `contact.html` | Enquiry form, phone numbers, main and branch offices, map |
| `404.html` | Not-found page |

## Running locally

```sh
cd primetek
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Notes

- Styles are in `assets/css/styles.css` and behaviour is in `assets/js/main.js`. Images in `assets/img/` were extracted from the brochure and converted to WebP.
- Brochure facts (products, capacities, leadership, addresses, phone numbers) are reproduced as given. Supporting copy was written for the site and should be reviewed by PrimeTEK before launch. That covers mission/vision/values, advisory services, the FAQ, the leadership responsibility summaries, the tactical mission vehicle detail and the counter-UAS summary.
- The brochure lists no email address, so the site doesn't show one. Add it to the footer and contact page once it's confirmed.
- The contact form only validates in the browser. Connect it to a backend or form service before launch.
- Leadership members other than the Executive Chairman are shown with initials, because the brochure has no portraits for them. Swap in photos when they're available.
