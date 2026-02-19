Inżynieria-Internetu/projekt-zaliczeniowy-ii-2025-_w_sensie_ze_tutaj_mam_nazwe_wpisac/README.md
# Blog – Projekt zaliczeniowy

Aplikacja blogowa z backendem (NestJS) i frontendem (React + Vite + TypeScript).


## Uruchomienie projektu

1. Zainstaluj zależności:
   ```
   npm install
   ```
2. Uruchom projekt w trybie deweloperskim:
   ```
   npm run dev
   ```
   Frontend: http://localhost:5173  
   Backend/API: http://localhost:3001

## Główne funkcje

- Rejestracja i logowanie użytkowników (autoryzacja przez ciasteczka HttpOnly)
- Tworzenie, edycja i usuwanie postów
- Przeglądanie postów z filtrowaniem po tagach i wyszukiwaniem
- Komentowanie postów
- Zarządzanie kategoriami i tagami
- Upload obrazków

## API

Dokumentacja endpointów znajduje się w pliku `api.md`.

**Podstawowy adres API:**  
`http://localhost:3001/api`

## Technologie

- Backend: NestJS (Node.js, TypeScript)
- Frontend: React, Vite, TypeScript
