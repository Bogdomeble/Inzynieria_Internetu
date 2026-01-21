## API Reference

**Base URL:** `http://localhost:3001/api`

###  Autoryzacja
System wykorzystuje ciasteczka **HttpOnly** (`access_token`).

| Metoda | Endpoint | Opis | Wymagane Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Rejestracja nowego użytkownika | `{ email, username, password }` |
| `POST` | `/auth/login` | Logowanie (ustawia ciasteczko) | `{ email, password }` |
| `POST` | `/auth/logout` | Wylogowanie (czyści ciasteczko) | - |
| `GET` | `/auth/profile` | Pobiera dane zalogowanego usera | - |

### Posty 

| Metoda | Endpoint | Opis |
| :--- | :--- | :--- |
| `GET` | `/posts` | Lista postów. Filtry: `?search=...`, `?tag=...` |
| `GET` | `/posts/:id` | Pobiera post po ID |
| `GET` | `/posts/slug/:slug` | Pobiera post po unikalnym slugu (URL) |
| `POST` | `/posts` |  Tworzy nowy post |
| `PATCH` | `/posts/:id` |  Edytuje post |
| `DELETE` | `/posts/:id` |  Usuwa post (Autor lub Admin) |

###  Komentarze 

| Metoda | Endpoint | Opis |
| :--- | :--- | :--- |
| `GET` | `/posts/:id/comments` | Pobiera komentarze dla danego posta |
| `POST` | `/comments` |  Dodaje komentarz |
| `DELETE` | `/comments/:id` |  Usuwa komentarz (Autor lub Admin) |

###  Zasoby i Pliki

| Metoda | Endpoint | Opis |
| :--- | :--- | :--- |
| `GET` | `/categories` | Lista wszystkich kategorii |
| `GET` | `/tags` | Lista wszystkich tagów |
| `POST` | `/upload` | Upload obrazka (`multipart/form-data`). Zwraca URL. |
