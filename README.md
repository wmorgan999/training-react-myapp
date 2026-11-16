# training-react-myapp

A small React app built while following the React training course (https://github.com/wmorgan999/react-training, lesson 03). It lists customers and lets you add one, against the same `/api/customers` contract as the [homelab](https://github.com/wmorgan999/homelab) project.

**Stack:** React 19, Vite 8, React Router 7, Vitest + Testing Library.

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
npm run build     # production build into dist/
npm run lint      # oxlint
```

## Project layout

```
src/
  api/customers.js            fetch calls (no React)
  hooks/useCustomers.js       loading, error and data state
  components/CustomerForm.jsx       add-customer form (+ .test.jsx)
  components/CustomerTable.jsx      customer table, or "No customers yet."
  pages/CustomersPage.jsx     the customers screen
  App.jsx                     navigation and routes
  main.jsx                    mounts the app inside the router
mock-api.mjs                  stand-in API on port 8080
```

## Notes

- A duplicate email makes the API (real and stand-in) return HTTP 500, so the form shows "Save failed: 500".
- The stand-in API's data resets whenever you restart it.
- `npm run lint` reports one warning (`set-state-in-effect`) in `useCustomers.js`. The code is correct; it's the standard fetch-in-an-effect pattern, which the lint rule discourages for data loading.
