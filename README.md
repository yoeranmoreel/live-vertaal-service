# Live Vertaal Service

Pilot V3 wordt opnieuw opgebouwd als privacy-first realtime vertaaldienst voor oudercontacten in het basisonderwijs.

## Status
Actieve ontwikkeling staat op `v3-pilot`. De bestaande V2 blijft voorlopig op `main`.

## Stack
React + Vite · Vercel · Firebase/Firestore (EU) · Azure Translator (EU) · vervangbare speech-provider.

Zie [PILOT_V3_SPEC.md](./PILOT_V3_SPEC.md) voor de goedgekeurde productspecificatie.

## Lokaal
```bash
npm install
cp .env.example .env.local
npm run dev
```

Zonder Firebase-waarden start de V3-shell ook; realtime/auth worden in volgende batches aangesloten.

## Privacy
De pilot wordt privacy-by-design ontwikkeld. Er wordt niet geclaimd dat de dienst volledig AVG-compliant is voordat de concrete pilotketen en afspraken daadwerkelijk zijn beoordeeld.
