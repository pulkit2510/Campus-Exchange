<div align="center">
  <h1>Campus Exchange</h1>
  <p>A student-first marketplace powered by Express, EJS, and a lightweight JSON data layer.</p>
</div>

## Stack Highlights

- **Node.js + Express** web server (`server.js`) with modular routes (`src/routes`)
- **EJS** componentized templates (see `src/views/pages` & `src/views/partials`)
- **OOP service/controller layer** (`src/services/ListingService.js`, `src/controllers/listingController.js`)
- **File-backed listings store** (`data/listings.json`) managed through the service layer
- Modern responsive UI delivered from `/public` assets (shared `styles.css`, JS helpers)

## Project Structure

| Path | Purpose |
| --- | --- |
| `server.js` | Boots Express, registers middleware, mounts routes |
| `src/services/ListingService.js` | OOP data access (fetch featured, create listing, stats, etc.) |
| `src/controllers/listingController.js` | OOP controller that orchestrates view rendering & API responses |
| `src/routes/index.js` | All web + API endpoints (`/`, `/browse`, `/listing/:slug`, `/api/listings`, …) |
| `src/views/partials` | Shared `head`, `header`, `footer` includes used by every EJS page |
| `src/views/pages` | Page-level EJS views (`home`, `browse`, `listing-form`, `detail`, `404`) |
| `public/styles.css` | Design system + layout primitives shared across templates |
| `public/Browse.js` | Client-side filtering that now consumes `/api/listings` |
| `public/listing.js` | Listing form UX (local preview + toast) |
| `data/listings.json` | Source of truth for listings (read/written by the service) |

## Getting Started

```bash
npm install
npm run dev   # nodemon server with auto reload

# production-style start
npm start
```

Visit `http://localhost:3000`.

## Key Components & Data Flow

1. **Routes** delegate work to the `ListingController`.  
   Example: `GET /browse` → `listingController.browse`.
2. **Controller** uses the **OOP service** (`ListingService`) to pull data from `data/listings.json`.  
   It passes data + `activePage` flags to **EJS templates**.
3. **Templates** extend reusable partials (head/header/footer) and render dynamic listings.
4. **Client JS** (`public/Browse.js`) fetches `/api/listings` for filtering UI, while `/listing.js`
   handles preview interactions for the listing form.

## Available Routes

| Route | Description |
| --- | --- |
| `GET /` | Homepage with featured listings |
| `GET /browse` | Filtering UI (server-rendered + client-side enhancements) |
| `GET /listing/new` | Form to post new listings |
| `POST /listing` | Creates a listing (stored through `ListingService`) |
| `GET /listing/:slug` | Detail page for an individual listing |
| `GET /api/listings` | JSON API consumed by the browse script |

## Future Ideas

- Auth & profile pages (tie into `activePage === "account"`)
- Image uploads via S3/GridFS
- Replace local preview with persisted drafts
- Add Jest tests for service/controller layers

