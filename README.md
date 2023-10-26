This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Install dependencies

```bash
npm install
```

### Set up database

Create .env file in the root directory and add the following (replace the database url with your own):

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/book-app
```

Run the following command to create the database:

```bash
npx prisma migrate dev --name init
```

### Start the development server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Launch Prisma Studio for database management

```bash
npx run studio
```
