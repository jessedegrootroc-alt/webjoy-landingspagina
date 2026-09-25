/* smooth-scroll.js: vloeiend scrollen met GSAP ScrollSmoother
   - Alles wat position:fixed is hoort BUITEN #smooth-wrapper.
   - Bij prefers-reduced-motion geen smoothing: dan scrolt de browser gewoon zelf.
   - Laadt GSAP niet, dan gebeurt hier niets en scrolt de site als vanouds. */
(() => {
  const { gsap, ScrollTrigger, ScrollSmoother } = window;
  if (!gsap || !ScrollTrigger || !ScrollSmoother) return;
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  const kalm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const MARGE = 110;          // ruimte boven een ankerdoel, voor een vaste header
  let smoother = null;
  let eigenSprong = false;

  const maak = () => {
    if (smoother || kalm.matches || !document.getElementById('smooth-wrapper')) return;
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1,            // seconden om de scrollbalk in te halen; hoger = zweveriger
      effects: true,        // data-speed en data-lag op elementen werken (parallax)
      smoothTouch: 0,       // op touch geen smoothing, dat voelt verkeerd
      onFocusIn: () => (eigenSprong ? false : undefined),
    });
  };
  const sloop = () => { smoother?.kill(); smoother = null; };

  maak();
  window.smoother = () => smoother;   // handig voor andere scripts: window.smoother()?.scrollTop()

  /* Ankerlinks (#sectie): de browser kan niet zelf scrollen in de fixed wrapper,
     dus dat doen we hier, met focus mee voor toetsenbordgebruikers. */
  document.addEventListener('click', (e) => {
    const link = e.target.closest?.('a[href^="#"]');
    if (!link || link.getAttribute('href') === '#') return;
    const id = decodeURIComponent(link.getAttribute('href').slice(1));
    const doel = document.getElementById(id);
    if (!doel || !smoother) return;
    e.preventDefault();
    eigenSprong = true;
    if (!doel.hasAttribute('tabindex')) doel.setAttribute('tabindex', '-1');
    doel.focus({ preventScroll: true });
    smoother.scrollTo(doel, true, `top ${MARGE}px`);
    history.replaceState(history.state, '', `#${id}`);
    requestAnimationFrame(() => requestAnimationFrame(() => { eigenSprong = false; }));
  });

  /* Binnenkomen op een adres met #anker: de sprong van de browser komt te
     vroeg, dus nog een keer zodra de smoother er is. */
  if (location.hash && smoother) {
    const doel = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (doel) requestAnimationFrame(() => smoother.scrollTo(doel, false, `top ${MARGE}px`));
  }

  /* Bewegingsvoorkeur omgezet terwijl de site openstaat: meteen volgen. */
  kalm.addEventListener('change', () => { sloop(); maak(); ScrollTrigger.refresh(); });
})();
