# Webjoy → Lovable: 1-op-1 overzetten

## Wat zit er in dit pakket?
De complete, afgeronde Webjoy-onepager als statische site, klaar voor Lovable's
Vite-structuur:

- `index.html` — de volledige homepage (vervangt Lovable's eigen index.html)
- `public/kwalificatie.html` — de kwalificatie-funnel (bereikbaar op /kwalificatie.html)
- `public/assets/` — alle 30 afbeeldingen: logo, smileys, reviews, cases, werk-slider,
  klantlogo's, teamfoto, social proof

## Stappen (GitHub-route, de enige die 1-op-1 werkt)
1. Maak in Lovable een nieuw (leeg) project.
2. Koppel GitHub: in Lovable rechtsboven **GitHub → Connect & create repository**.
3. Clone die repo lokaal. Vervang daarin `index.html` door die uit dit pakket en
   kopieer de map `public/` uit dit pakket eroverheen (laat `package.json`,
   `vite.config.ts`, `src/` en de rest van Lovable's bestanden gewoon staan).
4. Commit en push. Lovable synct automatisch en de preview toont de site exact
   zoals hij nu lokaal draait.
5. Plak daarna onderstaande prompt in de Lovable-chat, zodat de AI de site niet
   "verbetert" of ombouwt.

> Waarom niet alles via één chat-prompt? Lovable's chat kan geen zip of losse
> afbeeldingsbestanden als projectbestanden opnemen. Code plakken kan wel, maar
> de 30 foto's en logo's kunnen alleen via GitHub (of handmatige upload) het
> project in. Vandaar deze route: één push, nul fouten.

## De prompt (kopieer en plak in Lovable)

```
Ik heb zojuist via GitHub mijn complete, afgeronde website gepusht:
index.html in de root, plus public/kwalificatie.html en public/assets/.

Dit is een bewust statische site (HTML + Tailwind CDN + vanilla JS). Behandel
hem als af. Regels voor alles wat je vanaf nu voor mij doet:

1. Bouw NIETS om naar React-componenten. index.html en
   public/kwalificatie.html zijn de bron van waarheid; src/ wordt niet gebruikt
   en mag blijven staan zoals het is.
2. Wijzig geen copy, kleuren, fonts (Google Sans Flex, JetBrains Mono, Caveat),
   spacing of section-volgorde, tenzij ik er expliciet om vraag.
3. Laat alle animaties intact: de woord-voor-woord scroll-reveal
   (IntersectionObserver + .reveal-word), de hero page-load choreografie
   (.hero-in/.hero-pop-in), de drie infinite marquees (USP-pillen twee
   richtingen, werk-slider, review-slider), de telefoon-trilanimatie en de
   services-waaier (zijkaarten ±5°, midden verhoogd).
4. De knop "Doe de kwalificatie" linkt overal naar kwalificatie.html; dat is
   een statische pagina in public/. Laat die route werken.
5. De kwalificatie-funnel verstuurt nog nergens naartoe (console.log). Bouw
   daar alleen een koppeling voor als ik erom vraag.
6. Als ik later wijzigingen vraag, bewerk je de bestaande HTML-bestanden
   direct, in dezelfde stijl (CSS-tokens in :root, Tailwind-utilities, Nederlands
   commentaar).

Bevestig dat de site 1-op-1 draait en verander verder niets.
```

## Controle na de push
- Homepage: hero-animatie, 3 marquees, telefoon trilt bij inscrollen, FAQ klapt uit.
- /kwalificatie.html: 3 stappen + validatie + bedankscherm.
- Geen 404's in de console (alle 30 assets laden).
