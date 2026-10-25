# 2700 Tråden – hjemmesiden

Ejer: Kristoffer. Han er ikke teknisk. Svar på dansk i korte, enkle sætninger.
Spørg ikke om tekniske valg. Tag selv det mest almindelige valg, og sig kort, hvad du valgte.

## Sådan er siden sat op
- Ren statisk side: HTML, CSS og billeder. Der skal ikke bygges noget.
- Alt ligger i roden af repository'et. `index.html` ligger øverst.
- Siden udgives med GitHub Pages fra branchen `main` (roden).
  Hver ændring på `main` er live på https://2700traaden.dk efter et par minutter.
- Domænet styres hos Nordicway (DNS). Rør ikke ved DNS eller domæner, medmindre Kristoffer beder om det.

## Regler for ændringer
- Læg færdige ændringer direkte på `main`, og push dem. Ellers kommer de ikke på siden.
- Slet eller ændr aldrig filerne `CNAME` og `.nojekyll`. Uden dem forsvinder siden fra 2700traaden.dk.
- `netlify.toml` er en rest fra Netlify. Lad den ligge, indtil Kristoffer siger andet.
- Brug relative links (fx `assets/billede.jpg`, `../kunst/`), ligesom resten af siden.
- Ny side: læg den i sin egen mappe med en `index.html`, og tilføj den i `sitemap.xml`.
- Får du en zip med en ny version: pak den ud uden ekstra mappe og uden `__MACOSX`/`.DS_Store`,
  og erstat filerne i roden. Behold `CNAME`, `.nojekyll` og `CLAUDE.md`.

## Når du er færdig
- Tjek efter et par minutter, at https://2700traaden.dk viser ændringen.
- Fortæl Kristoffer kort, hvad du har ændret, og om det er live.
