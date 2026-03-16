# Törökbálinti Ifjúsági Önkormányzat (TIFO) - Weboldal

Ez a projekt a TIFO hivatalos weboldala, modern, minimalista, fiatalos dizájnnal, magyar nyelven.

## Főbb technológiák
- Next.js (App Router)
- Tailwind CSS
- TypeScript
- Supabase (adatbázis és autentikáció, előkészítve)

## Főoldal funkciók
- Események listázása (mock adatokkal, amíg nincs Supabase)
- Admin felület események kezelésére (védett, emailes bejelentkezés)
- Rólunk, Kapcsolat, csapat bemutatása

## Fejlesztői indítás

1. Telepítsd a függőségeket:
   ```bash
   npm install
   ```
2. Indítsd el a fejlesztői szervert:
   ```bash
   npm run dev
   ```
3. Nyisd meg a böngészőben: [http://localhost:3000](http://localhost:3000)

## Supabase csatlakozás

1. Regisztrálj a [Supabase](https://supabase.com)-en, hozz létre új projektet.
2. Másold ki a projekt URL-t és az anon kulcsot.
3. Hozz létre egy `.env.local` fájlt a projekt gyökerében, tartalma:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=ide_írd_be
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ide_írd_be
   ```
4. A Supabase táblát így hozd létre:
   - Tábla neve: `events`
   - Oszlopok: `id` (uuid, primary key), `title` (text), `date` (date), `description` (text), `image` (text), `location` (text, opcionális)
5. A Supabase integrációhoz módosítsd a `src/lib/supabaseClient.ts`-t és az eseménykezelő kódot.

## Deploy Vercelre

1. Lépj be a [Vercel](https://vercel.com)-re, importáld a GitHub repót vagy töltsd fel a projektet.
2. Add meg a környezeti változókat a Vercel dashboardon (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Deploy után a weboldal elérhető lesz a Vercel által adott URL-en.

## Oldalak
- Főoldal
- Eseményeink
- Rólunk
- Kapcsolat
- Admin (védett)

---

## Készítette: TIFO