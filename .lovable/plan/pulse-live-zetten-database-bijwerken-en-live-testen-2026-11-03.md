# Pulse live zetten: database bijwerken en live testen

## Wat er gebeurt
De live database loopt 18 updates achter. Pulses kunnen pas worden opgeslagen als de updates voor aanwezigheid (0185–0187) en de nieuwe pulse-stijlen (0191) zijn uitgevoerd. Die bouwen voort op eerdere updates, dus alle openstaande updates worden in volgorde uitgevoerd.

## Stappen
1. **Controle vooraf**: de lijst met uitgevoerde updates in de live database vergelijken met de lokale lijst. De twee updates die alleen een nieuwe naam kregen (workspace_icon 0169→0172, question_stories) worden als al uitgevoerd gemarkeerd en niet opnieuw gedraaid.
2. **Elke openstaande update lezen** (0174 … 0191) en nagaan of hij veilig twee keer kan draaien (`if not exists`, `create or replace`, `drop policy if exists`). Waar dat niet zo is, wordt de update niet aangepast maar met een voorafgaande bestaanscontrole uitgevoerd.
3. **Uitvoeren, één per keer, in volgorde**: elke update als één transactie (alles of niets) en dan registreren in de lijst met uitgevoerde updates. Bij een fout: direct stoppen, niets half uitgevoerd, de foutmelding melden.
4. **Controle achteraf**: nagaan dat de pulse-tabel, de validatie (stijlen bg/font/align/sticker) en de openbare weergavefunctie bestaan, en dat de beperkte app-rol (`rout_app`) nog steeds door de veiligheidscontrole van de app komt.
5. **Live test in de preview** (ingelogd): een pulse met stijl plaatsen in Studio en in Command Center → de groene ring verschijnt op de avatar van het openbare profiel → de pulse "nu beëindigen" → de ring verdwijnt. Screenshots als bewijs.
6. **Typecheck** `bunx tsgo --noEmit` (exitcode 0) en de bestaande presence/qa-tests draaien.

## Technische details
- Uitvoering via de Neon-verbinding als batch (`queries`), één bestand per transactie; schema_migrations-insert zit in dezelfde batch.
- Bestanden met `create index concurrently` of andere statements die niet in een transactie mogen, worden apart gedraaid.
- Inloggen voor de test gaat via de eigen inlog van de app (Neon-gebaseerd); als er geen testaccount beschikbaar is, vraag ik welk account ik mag gebruiken.
- Wat niet automatisch te testen is, wordt in het eindbericht expliciet genoemd.
