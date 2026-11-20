# training-react-myapp

A small React app built while following the React training course (https://github.com/wmorgan999/react-training, lesson 03). It lists customers and lets you add one, against the same `/api/customers` contract as the [homelab](https://github.com/wmorgan999/homelab) project.

**Stack:** React 19, **TypeScript**, Vite 8, React Router 7, Vitest + Testing Library. (This is the TypeScript version; the plain JavaScript version is on `main`. See lesson 07 of the course.)

## Run it

You need Node.js (LTS). From this folder:

```bash
npm install
```

The app calls `/api/customers`, and Vite forwards `/api` to `http://localhost:8080` (see `vite.config.js`). Something has to be listening there:

- **No backend yet?** Start the included stand-in API in a second terminal. It serves the same URLs and JSON shapes, with data kept in memory:
  ```bash
  node mock-api.mjs
  ```
- **Using the real homelab stack?** Start it with `docker compose up --build` in the homelab repo instead. Both use port 8080, so run one or the other, not both.

Then start the dev server and open the address it prints (normally http://localhost:5173/):

```bash
npm run dev
```

Changes to `vite.config.js` only apply after restarting `npm run dev`.

## Test and build

```bash
npm test          # runs the Vitest tests once
npm run typecheck # TypeScript check only (tsc --noEmit)
npm run build     # typecheck, then production build into dist/
npm run lint      # oxlint
```

## Project layout

```
src/
  api/customers.ts            fetch calls (no React)
  hooks/useCustomers.ts       loading, error and data state
  components/CustomerForm.tsx       add-customer form (+ .test.tsx)
  components/CustomerTable.tsx      customer table, or "No customers yet."
  pages/CustomersPage.tsx     the customers screen
  types.ts                    the Customer type, shared by everything
  App.tsx                     navigation and routes
  main.tsx                    mounts the app inside the router
mock-api.mjs                  stand-in API on port 8080
```

## Notes

- A duplicate email makes the API (real and stand-in) return HTTP 409, and the app shows "That email is already registered." (An API built before exercise 6 returns 500 instead, shown as "Save failed: 500".)
- Each table row has a Delete button with a Yes/No confirm; the detail page has an Edit form. These need the API's `DELETE` and `PUT` endpoints (exercise 6).
- The stand-in API's data resets whenever you restart it.
- `npm run lint` reports one warning (`set-state-in-effect`) in `useCustomers.ts`. The code is correct; it's the standard fetch-in-an-effect pattern, which the lint rule discourages for data loading.
