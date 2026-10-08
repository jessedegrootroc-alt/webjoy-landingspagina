/* analytics.js: Google Analytics 4 met Consent Mode v2.

   VUL HIER JE MEETCODE IN. Je vindt hem in Google Analytics onder
   Beheer > Gegevensstromen > je website. Hij begint met G- en ziet eruit als
   G-ABC1234XYZ. Zolang dit leeg is, gebeurt er niets: er wordt geen script
   geladen en er komt geen cookie op de site.

   Hoe de toestemming werkt:
   - De tag laadt altijd, maar start op 'denied'. Google zet dan geen cookies
     en stuurt geen identifiers mee; alleen een geanonimiseerde ping.
   - Zet iemand analytische cookies aan in de cookiemelding, dan gaat
     analytics_storage op 'granted' via gtag('consent', 'update', ...).
   - De keuze wordt door cookiebalk.js in localStorage bewaard en bij een
     volgend bezoek meteen opnieuw toegepast.
   - cookiebalk.js levert de keuze aan via window.webjoyToestemming en meldt
     elke wijziging met het event 'webjoy:toestemming'.                      */
const META_ID = 'G-DHF7Z631FX';

(() => {
  if (!META_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };

  /* Standaard alles weigeren. Dit moet vóór het laden van gtag.js staan,
     anders is de tag al vertrokken voordat de regels bekend zijn. */
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  });

  /* Weigeren betekent ook: opruimen wat er van een eerdere keuze nog staat. */
  const ruimCookiesOp = () => {
    document.cookie.split(';').forEach(c => {
      const naam = c.split('=')[0].trim();
      if (naam === '_ga' || naam.startsWith('_ga_') || naam === '_gid') {
        const domein = location.hostname.replace(/^www\./, '');
        document.cookie = naam + '=; Max-Age=0; path=/';
        document.cookie = naam + '=; Max-Age=0; path=/; domain=.' + domein;
      }
    });
  };

  const verwerk = (keuze) => {
    const analytisch = !!(keuze && keuze.analytisch);
    const marketing  = !!(keuze && keuze.marketing);
    gtag('consent', 'update', {
      analytics_storage:  analytisch ? 'granted' : 'denied',
      ad_storage:         marketing  ? 'granted' : 'denied',
      ad_user_data:       marketing  ? 'granted' : 'denied',
      ad_personalization: marketing  ? 'granted' : 'denied',
    });
    if (!analytisch) ruimCookiesOp();
  };

  /* Een eerdere keuze nog vóór de eerste paginaweergave doorgeven, zodat die
     meting al klopt. cookiebalk.js staat bewust eerder in de pagina. */
  if (window.webjoyToestemming) verwerk(window.webjoyToestemming);

  gtag('js', new Date());
  gtag('config', META_ID, { anonymize_ip: true });

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(META_ID);
  document.head.appendChild(script);

  document.addEventListener('webjoy:toestemming', (e) => verwerk(e.detail));

  /* ---- Events ----
     Eén listener op document in de capture-fase: dan telt een klik ook mee
     als een ander script het standaardgedrag onderweg tegenhoudt. */
  const stuur = (naam, params) => window.gtag('event', naam, params || {});

  document.addEventListener('click', (e) => {
    const link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const tekst = (link.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);

    if (href.indexOf('tel:') === 0) {
      stuur('telefoon_klik', { link_url: href });
    } else if (href.indexOf('wa.me/') !== -1) {
      stuur('whatsapp_klik', { link_url: href });
    } else if (/kwalificatie\.html/.test(href)) {
      stuur('kwalificatie_klik', { link_tekst: tekst });
    }
  }, true);
})();
