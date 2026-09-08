# HARMONY — Sito web

Sito statico (solo HTML/CSS/JS, **nessun build step, nessun backend**) per HARMONY: un approccio medical-tech che mette in relazione dentatura, occlusione e postura attraverso bite personalizzati e una rete di professionisti.

## Come aprirlo

Puoi aprire `index.html` direttamente nel browser facendo doppio click, oppure — consigliato, per far funzionare correttamente percorsi relativi e geolocalizzazione — avviare un piccolo server locale dalla cartella del progetto:

```bash
python3 -m http.server 4173
```

poi vai su `http://localhost:4173`.

## Come modificarlo

- **Testi e sezioni**: sono direttamente nei file `.html` (uno per pagina). Nessuna build: modifichi e ricarichi il browser.
- **Colori, font, spaziature, bottoni, card**: tutti i design token sono in cima a [assets/css/style.css](assets/css/style.css) (variabili `:root`), poi i singoli componenti sotto.
- **Comportamenti** (menu, slider hero, FAQ accordion, locator, form, cookie banner): [assets/js/main.js](assets/js/main.js).
- **Dati mock** (dentisti, FAQ, guide): [assets/js/data.js](assets/js/data.js) — nessun database, tutto client-side.

## Struttura

```
index.html                 Homepage
come-funziona.html
il-metodo.html
trova-dentista.html
professionisti.html
diventa-partner.html
faq.html
contatti.html               Modulo richiesta consulto
privacy.html
cookie-policy.html
404.html
guide/index.html
guide/bite-dentale.html
guide/bite-posturale.html
guide/bite-personalizzato.html
sitemap.xml
robots.txt
assets/css/style.css
assets/js/main.js
assets/js/data.js
```

## Cosa è già pronto

- Design system premium (bianco/blu/azzurro + accento caldo), tipografia Manrope/Inter.
- Header sticky con effetto vetro allo scroll, menu mobile.
- Hero editoriale con slider immagini e "bite 3D" dimostrativo (CSS 3D, interattivo al mouse).
- Percorso a step, timeline tecnologia, benefit grid asimmetrica.
- Dentist locator con dati mock, ricerca per città/CAP e geolocalizzazione (calcolo distanza reale).
- Form paziente e partner con validazione client-side e stato di successo/errore (nessun invio reale).
- FAQ accordion, guide/articoli con indice e related, breadcrumbs + JSON-LD (Organization, BreadcrumbList, Article).
- SEO on-page: title/description/canonical/OG per ogni pagina, sitemap.xml, robots.txt.
- Cookie consent banner (necessari/analitici/marketing) salvato in localStorage.
- `prefers-reduced-motion` rispettato ovunque; focus states accessibili.

## Cosa manca volutamente (da fare quando avrai i dati reali)

- Immagini e video reali (oggi sono placeholder a gradiente) e il modello 3D definitivo del bite (`.glb`).
- Dati aziendali reali nel footer (P.IVA, indirizzo, telefono, social) — cerca i commenti `PLACEHOLDER`/`da definire` in `index.html` e nelle altre pagine.
- Un backend reale per form e locator (oggi tutto è mock/client-side, come richiesto).
- Testi legali (Privacy/Cookie) da far validare da un legale.
