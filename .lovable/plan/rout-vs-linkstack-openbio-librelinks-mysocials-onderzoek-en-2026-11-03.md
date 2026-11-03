# ROUT vs LinkStack, OpenBio, LibreLinks, MySocials — onderzoek en verbeterplan

## Conclusie in het kort
ROUT is op bijna elk vlak al verder dan de vier voorbeelden: meer bloktypes, workspaces met rollen, eigen domeinen met verificatie, inplannen van links (dat heeft geen van de vier), privacyvriendelijke statistieken zonder IP-opslag (OpenBio bewaart IP's), stapsgewijze bevestiging bij export, en beheer en moderatie. MySocials heeft zelfs een ernstig lek: hun "privépagina" stuurt e-mail en telefoon gewoon mee naar de bezoeker. Dat nemen we dus niet over.

Wat we wel kunnen leren, en wat ROUT nog mist of zwakker doet:

| Onderwerp | Bij hen | Bij ROUT nu | Actie |
|---|---|---|---|
| Profiel importeren | LinkStack: JSON exporteren én terugzetten | Alleen exporteren | Terugzetten uit eigen export, plus importeren vanuit een LinkStack-export |
| vCard (contact opslaan) | LinkStack: knop "Contact opslaan" | Niet als blok | Nieuw blok "Contact opslaan" (.vcf) met alleen de velden die je zelf aanzet |
| E-mail verzamelen | OpenBio: inschrijfblok + CSV | Niet aanwezig | Inschrijfblok met dubbele bevestiging en CSV-export in Studio |
| Statistieken | OpenBio/LibreLinks: verwijzers, landen, toestellen, tijdlijn, top-links | Bezoeken en klikken, ontdubbeling per server | Verwijzers en landen (zonder IP), filters op periode, top-links; ontdubbeling verplaatsen naar de database zodat de cijfers kloppen over alle servers |
| Archiveren | LibreLinks: link tijdelijk uitzetten | Verbergen + inplannen bestaan | Duidelijke "archief"-weergave in de links-lijst |
| Live voorbeeld | LinkStack: klikken in het voorbeeld navigeren niet weg | Voorbeeld bestaat | Klikken in het voorbeeld onderscheppen |
| Bento-indeling | OpenBio: tegels in verschillende maten | Lijst + brede indeling | Optionele tegelweergave (klein/breed/groot) per blok, zonder de huidige indeling te breken |
| Aftellen / weer | OpenBio: aftelblok | Evenementen bestaan | Aftelblok (alleen datum, geen externe dienst) |
| Ingeplande links | Niemand heeft dit | Werkt, maar verloopt pas bij herladen | Automatisch verbergen/tonen op het exacte moment, ongeldige datums weigeren in de editor |

## Interne verbeteringen uit de eigen code-analyse
1. **Zichtbaarheidsregels** (context/aanwezigheid) bestaan maar worden op het openbare profiel niet toegepast — aansluiten.
2. **Statistieken-sleutel** heeft een voorspelbare reservewaarde — verplicht maken; ontdubbeling uit het servergeheugen naar de database.
3. **Vertalingen**: Nederlandse vaste tekst in het exportscherm vertalen; vertaalbestanden pas laden wanneer de pagina ze nodig heeft (snellere eerste lading).
4. **Delen-labels**: taalregio correct zetten (nu `en_EN` in plaats van `en_US`, `nl_BE`, …).
5. **Toegankelijkheid**: animaties en glas-effecten respecteren "minder beweging" en contrast overal, niet enkel op de QR-code.

## Voorgestelde volgorde (in fasen, elk apart testbaar)
1. **Fase 1 — fundament (geen zichtbare risico's):** punten 1–4 hierboven + ingeplande links op het exacte moment.
2. **Fase 2 — portabiliteit:** profiel terugzetten uit export + LinkStack-import, vCard-blok.
3. **Fase 3 — groei:** e-mail-inschrijfblok + CSV, uitgebreide statistieken (verwijzers, landen, filters, top-links).
4. **Fase 4 — vormgeving:** archiefweergave, niet-wegklikkend voorbeeld, aftelblok, optionele tegelindeling.

## Technische details
- Nieuwe gegevens (inschrijvingen, verwijzer/land per bezoek, ontdubbel-sleutels) via nieuwe genummerde migraties in `db/`, toegepast met `scripts/migrate-gateway.ts`, altijd met grants voor `rout_app`, RLS en eigenaarsbeleid.
- Land komt uit de request-header van de hosting (geen IP opslaan); verwijzer alleen als domein.
- Import valideert met hetzelfde zod-schema als de editor, weigert externe media in sociale grids (bestaande regel) en schrijft naar het concept, niet direct naar het gepubliceerde profiel.
- vCard en inschrijfblok renderen alleen expliciet aangezette velden; inschrijvingen met rate-limit per profiel via de database.
- Bento-indeling als extra veld per blok (`size`), standaard ongewijzigd, zodat bestaande profielen er identiek uitzien.
- Elke fase: tests voor de nieuwe regels, `tsgo` foutloos, geen wijziging aan bestaande publieke paden.
- Openstaand: migratie 0167 (verwijdert ElevenLabs-sleuteltabel) blijft wachten op jouw akkoord.
