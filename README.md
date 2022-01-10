This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3001/api/hello](http://localhost:3001/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

---

# Local Development Setup

## Install Docker/Docker Desktop
- [Docker Desktop - for Mac](https://docs.docker.com/desktop/windows/install/)
- [Docker Desktop - for Windows](https://docs.docker.com/desktop/mac/install/)

*`if you are using Windows/Mac, run this command`*

```bash  
docker-machine ip default
```

## Build & Run
```bash
docker-compose up --build -d  # open terminal on root of the directory
```

## Only Run 
```bash
docker-compose up --build -d  # -d flag is to run container in background
```

## Stop 
```bash
docker kill $(docker ps -q)
```

## Delete container 
 
```bash
docker-compose down # this will remove storage data
```
