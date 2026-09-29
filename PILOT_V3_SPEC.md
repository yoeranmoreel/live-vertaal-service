# Live Vertaal Service — Pilot V3

**Specificatie:** 1.0  
**Status:** Goedgekeurd voor bouw  
**Branch:** `v3-pilot`

## 1. Doel
Pilot V3 maakt Nederlandstalige communicatie vanuit een basisschool vrijwel realtime toegankelijk voor ouders die een andere taal spreken.

De pilot moet aantonen dat leerkrachten sessies vooraf kunnen plannen en starten, ouders zonder account via QR of URL kunnen deelnemen, één voorkeurstaal kiezen en daarna de volledige interface in die taal gebruiken. Nederlands wordt vrijwel realtime getranscribeerd en alleen naar actieve talen vertaald.

## 2. Technisch uitgangspunt
- React + Vite PWA.
- GitHub als broncodebeheer; Vercel voor deployment.
- Firebase/Firestore in een Europese locatie voor realtime data.
- Geen Google Apps Script, Google Sheets-database of periodieke polling.
- Azure Translator via EU-endpoint als primaire vertaalprovider.
- Speech-provider vervangbaar; Azure Speech-to-Text is primaire kandidaat.
- Vaste UI-teksten worden lokaal vertaald en kosten geen Translation API-verbruik.

## 3. Organisatie en rollen
Hiërarchie: School → Groepen → Leerkrachten + Sessies.

Een groep kan meerdere leerkrachten hebben. Gekoppelde leerkrachten beheren samen geplande, actieve en historische sessies van die groep.

Rollen in de pilot:
- Ouder: geen account.
- Leerkracht: account en toegang tot gekoppelde groepen.
- School-admin: beheert groepen, leerkrachten, koppelingen en statistieken; niet standaard de inhoud van alle transcripties.

Later kunnen bestuurs-admin en platform-admin worden toegevoegd.

## 4. Ouderflow
Deelname kan via QR-code én leesbare sessie-URL. Beide openen dezelfde sessie. Ouders hoeven geen account of persoonsgegevens op te geven.

Het eerste scherm toont minimaal:
- Kies uw voorkeurstaal
- Choose your preferred language
- اختر لغتك المفضلة

Talen worden in hun eigen taalnaam getoond, zoals Nederlands, English, العربية, Polski, Türkçe en Українська.

Na taalkeuze schakelt de volledige ouderinterface naar die taal: knoppen, statussen, meldingen, instellingen, audio, afsluiting en downloads. RTL-talen krijgen automatisch RTL-layout. De keuze wordt voor de sessie lokaal onthouden.

## 5. Leerkrachtomgeving
Na inloggen ziet een leerkracht de gekoppelde groepen. Per groep zijn minimaal zichtbaar:
- Gepland
- Live
- Historie

Meerdere leerkrachten van dezelfde groep delen deze omgeving en kunnen elkaars groepssessies beheren.

## 6. Sessies vooraf plannen
Een sessie kan ruim vooraf worden gepland met minimaal groep, sessienaam, datum, begintijd en de optie om een oudersamenvatting beschikbaar te maken.

Het systeem genereert automatisch interne ID, publieke identificatie, URL en QR-code. Op het moment zelf opent de leerkracht alleen de reeds geplande sessie en toont QR + URL.

## 7. Wachtkamer
Ouders mogen deelnemen in wachtstatus en tijdens een live sessie.

De leerkrachtweergave is Nederlands/LTR en toont aantallen met Nederlandse taalnamen, bijvoorbeeld Pools, Arabisch en Turks.

De ouderwachtkamer is volledig in de gekozen oudertaal.

## 8. Live sessie en late deelnemers
Na Start gesprek wordt de sessie live en start speech-to-text. De Nederlandse tekst vormt het brontranscript.

Live status sluit deelname niet. Late ouders kiezen hun taal en ontvangen vertalingen vanaf hun deelname. Eerdere tekst wordt niet retroactief vertaald naar een nieuw geactiveerde taal.

Een taal die eenmaal in een sessie actief is geworden blijft tot het einde actief, zodat tijdelijke disconnects geen vertaalgaten veroorzaken.

## 9. Transcript en vertaling
Het Nederlandse transcript wordt als logisch doorlopende tekst opgebouwd. Tijdstempels per segment zijn niet nodig; start- en eindtijd van de sessie worden wel opgeslagen.

Per Nederlands tekstdeel wordt één vertaling gemaakt per actieve doeltaal, ongeacht het aantal ouders met die taal. Vertalingen worden per sessie/bericht/taal gecachet.

De ouder ziet alleen tekst vanaf het moment van deelname terug en standaard geen Nederlandse brontekst.

## 10. Voorlezen
Vertaalde tekst kan optioneel worden voorgelezen. Browser speechSynthesis wordt voor de pilot onderzocht; voorlezen staat standaard uit.

## 11. Gesprek beëindigen
Na beëindigen stopt speech-to-text, sluit nieuwe deelname, wordt het Nederlandse transcript gearchiveerd en worden definitieve gebruiksstatistieken opgeslagen.

## 12. Oudersamenvatting
Als de leerkracht dit vooraf heeft aangezet, wordt na afloop eerst een Nederlandse conceptsamenvatting gemaakt. Een bevoegde leerkracht moet deze kunnen aanpassen en expliciet goedkeuren.

Zonder goedkeuring wordt niets gepubliceerd. Na goedkeuring wordt de samenvatting alleen vertaald naar talen die tijdens de sessie zijn gebruikt. Ouders kunnen de samenvatting zonder account in hun gekozen taal downloaden. Ouders krijgen geen volledig transcript.

## 13. Transcript voor leerkrachten
Bevoegde groepsleerkrachten kunnen het volledige Nederlandse transcript bekijken en downloaden. Het bevat minimaal school, groep, sessienaam, datum, starttijd, eindtijd en transcripttekst.

Het transcript blijft gedurende het lopende schooljaar beschikbaar. De definitieve automatische verwijderdatum wordt vóór de echte pilot vastgesteld.

## 14. Tijdelijke vertaaldata
Live vertalingen worden alleen bewaard zolang nodig voor live gebruik, reconnect en samenvatting. Daarna worden ze automatisch verwijderd.

## 15. Statistieken
Per sessie worden minimaal bijgehouden:
- groep;
- aantal deelnemers;
- deelnemers per taal;
- duur;
- Nederlandse broncharacters;
- vertaalde characters;
- gebruikte talen;
- status oudersamenvatting.

School-admin ziet geaggregeerd gebruik per groep, leerkracht en maand zonder standaard toegang tot gesprekstekst.

## 16. Conceptueel datamodel
```
schools/{schoolId}
groups/{groupId}
teachers/{teacherId}
sessions/{sessionId}
sessions/{sessionId}/participants/{participantId}
sessions/{sessionId}/messages/{messageId}
sessions/{sessionId}/translations/{translationId}
sessions/{sessionId}/summary
```

Groepsrechten worden niet alleen in de UI maar ook server-side/security-rules afgedwongen.

## 17. Privacy-by-design
Ouders: geen account, naam, e-mail, telefoonnummer of kindgegevens. Alleen een technische participant-ID en gekozen taal.

Audio wordt niet permanent opgeslagen en uitsluitend voor speech-to-text verwerkt.

Het Nederlandse transcript wordt wel opgeslagen, met autorisatie en bewaartermijn. Live vertalingen zijn tijdelijk. Statistieken bevatten waar mogelijk geen inhoudelijke gesprekstekst.

Verwachte verwerkers zijn Vercel, Firebase/Google Cloud en Microsoft Azure. Voor echte ouder-/kindgesprekken worden datastroom, locaties, bewaartermijnen, subverwerkers, DPA's en eventuele internationale doorgiften gecontroleerd.

Voor de echte pilot worden minimaal bewaartermijnen, toegangsrechten, privacy-informatie, verwijder- en incidentprocedures vastgesteld en wordt de FG/privacyverantwoordelijke betrokken en beoordeeld of een DPIA nodig is.

De dienst wordt niet als volledig AVG-compliant gepresenteerd voordat dit daadwerkelijk is beoordeeld.

## 18. Foutscenario's
De app moet bruikbaar reageren op geweigerde microfoon, providerstoringen, internetverlies, refresh/reconnect, verlopen of onbekende sessies, API-limieten en per ongeluk sluiten van de leerkrachtbrowser.

## 19. Acceptatiecriteria
De pilot is technisch testklaar wanneer onder meer:
- auth, groepen en gedeelde groepsrechten werken;
- sessies vooraf gepland en later geopend kunnen worden;
- QR én URL werken;
- ouders accountloos deelnemen en volledige lokalisatie/RTL werkt;
- realtime transcript en meerdere vertalingen tegelijk werken;
- caching dubbele vertaling voorkomt;
- late deelname en nieuwe talen tijdens live werken zonder retroactieve vertaling;
- reconnect werkt;
- transcriptarchief/download werkt;
- gecontroleerde oudersamenvatting en download werken;
- taal- en gebruiksstatistieken kloppen;
- tijdelijke vertaaldata verwijderd kan worden;
- privacy/datastroom voor pilot is gecontroleerd.

## 20. Niet in Pilot V3
Nog niet: betalingen, abonnementen, facturatie, landelijke onboarding, uitgebreid bestuursdashboard, white-labeling, commerciële SLA, complexe rapportages of native apps.

## 21. Kernprincipe
Voor de ouder: **Scan QR of open URL → kies taal → lees/luister mee.** Geen account, installatie of technische kennis.

Voor de leerkracht: **Plan vooraf → open sessie → toon QR + URL → start → praat Nederlands → rond af.**

De techniek doet de rest.
