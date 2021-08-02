This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Environment variables:
  - First create a .env.local in the root folder.
  - Look in the .env.example to see the needed variables
  - You will need a google cloud account and a distance matrix API key to fill out the GOOGLE_SECRET variable.
  - Also you will need a mongoDB atlas account and a cluster to fill out the MONGODB_URL variable.
  - Create a security key to fill out the AUTH_SECRET variable (will be used to encrypt the token)
  - Fill out the NEXT_PUBLIC_HOME_URL variable with http://localhost:3000

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.