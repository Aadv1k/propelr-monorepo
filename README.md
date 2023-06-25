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

the backend for the app is built using Koa + TypeScript, it follows a (mostly) pure RESTFul architechture. To get started, first run these commands:

```shell
npm run build:backend
npm run start:backend
```

This will start a local dev server at `4000`.

If you navigate to `./packages/backend/src/` you will see the following files:


- `common/` Contains the shared constants and utilities among the code base
- `models/` This contains the code for interacting with our `MongoDB` databse 
- `routes/` Each file within routes corresponds to an API route
- `server.ts` This exports a koa server which is consumed by the `index.ts` 

#### API

Let's briefly discuss all of the paths within the propelr API



##### `GET /api/users`

get a list of all userid's within the system

##### `DELETE /api/users` 

- ***Auth required***

deletes the user being requested via the JWT token 

##### `POST /api/users/login`

Login workflow, check if a user exists return error otherwise

```json
{
	"email": "john@doe.com"
	"password": "123"
}
```


##### `POST /api/users/register`

The signup workflow, check if a user doesn't exist, return error otherwise

When `process.env.NODE_ENV` is set to production, this route uses `Abstract API` to ensure the validity of the email.

```json
{
	"username": "john"
	"email": "john@doe.com"
	"password": "123"
}
```
	
##### `GET /api/oauth/:id/token`

where `:id`
- `google`
- `microsoft`

Our API implements the logic for an "OAuth callback", this means that it will extract the `authToken` from the URL and use it to fetch the user's email from the given service, if user found it will return the token for them or create one and do the same


##### `POST /api/flows`

- ***Auth required***

Creates a new flow for the user extracted via the JWT token

```json
{
	query: {
		syntax: "VAR data = FETCH \"https://api.kanye.rest\"",
		vars: ["data"]
	},
	
	schedule: {
		type: "daily",
		time: "10:30"
	},
	
	receiver: {
		identity: "email",
		address: "hi@example.com"
	}

}
```

Here is a breakdown of this schema

- `query.syntax`: this requires a valid [DracoQL](https://github.com/aadv1k/dracoql) syntax, this is the primary engine for the entire app and it is what fetches the actual html
- `query.vars`: required to extract the given variables from the interpreter of DracoQL

- `schedule.type`: `daily | none` defines how when the query should be run
- `schedule.time?`: Defines when the query should run if set to `daily`

- `receiver.identity`: `email | whatsapp` This defines to whom the extracted data must be sent to
- `receiver.address`: defines the address of the receiver, eg email or phone number

##### `DELETE /api/flows/:id`

- ***Auth required***

delete the provided flow for the user

##### `GET /api/flows/:id/execute`

- ***Auth required***

This will immediately execute the provided query and send it to the provided address


##### `GET /api/flows/:id/start`

- ***Auth required***

This will "start the flow" which means it will run at the provided time. All flows are ***stopped*** by default.

##### `GET /api/flows/:id/stop`

- ***Auth required***

This will "stop the flow" which means it will not run at the provided time. 
