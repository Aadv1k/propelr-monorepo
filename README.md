# Propelr Monorepo 🚀

| Packages          | Path                                       |  Description
| ----------------- | ------------------------------------------ | --- | 
| @propelr/frontend | [./packages/frontend](./packages/frontend) | the frontend UI built using React and Chakra UI for propelr | 
| @propelr/backend  | [./packages/backend](./packages/backend)  | the backend RestAPI for the core service |
| @propelr/common   | [./packages/common](./packages/common)   | shared utilities and similar config |

## Bootstrap

The project uses the following services and APIs and hence requires you to have a key for them.
- MongoDB Atlas
- Outlook (for sending mail)
- Abstract API (to verify mail, if not provided it will not the service)
- Google OAuth Credentials
- Microsoft OAuth Credentials

here is what your `.env` file might look like

```env
GOOGLE_CLIENT_ID = ""
GOOGLE_CLIENT_SECRET =  ""

MICROSOFT_CLIENT_ID = ""
MICROSOFT_CLIENT_SECRET = ""

ATLAS_PASSWORD = ""
ATLAS_USER = ""

# We are using outlook
MAIL_ADDRESS = ""
MAIL_PASSWORD = ""
```

Next, to you should run the [`pre-build.sh`](./scripts/pre-build.sh) to copy client info  to `@propelr/common` (this is required for frontend oAuth workflow)

```shell
./scripts/pre-build.sh
npm install --ws
npm run build --ws
```

Or alternatively run the build command

```
npm run build
```

This will generate the following structure

```shell
$ tree -L 1 ./dist
dist
├── backend
├── common
└── frontend
```

## Codebase

### Frontend

The frontend of the app is built using ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB), and [Chakra UI](https://chakra-ui.com/).

Here is the component structure of the `@propelr/frontend` package

```
├── components
│   ├── Dashboard.tsx
│   ├── DashboardCreate.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Login.tsx
│   ├── LoginGroup.tsx
│   ├── Navbar.tsx
│   ├── NotConvincedYet.tsx
│   ├── Overlay.tsx
│   ├── Pricing.tsx
│   ├── Products.tsx
│   ├── Register.tsx
│   └── chakra
│       ├── InputPassword.tsx
│       └── base.ts
├── context
│   └── UserContext.tsx
├── index.css
├── index.tsx
├── logo.svg
└── unique-selector.d.ts
```

the frontend is not very clean, it need to go through a major refactor [See issue](https://github.com/Aadv1k/propelr/issues/1)


### Backend

TODO: Document the backend
