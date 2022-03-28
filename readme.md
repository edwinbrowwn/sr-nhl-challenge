#### Dev initial setup
```npm i```
```docker-compose up -d```

### development ...
### Make migration
```npx prisma migrate dev --name init```

![Typescript](https://img.shields.io/npm/v/typescript?color=3178c6&label=Typescript&logo=Typescript&style=for-the-badge)
![Node.js](https://img.shields.io/npm/v/node?color=%23339933&label=Node.js&logo=Node.js&style=for-the-badge)
![Fastify](https://img.shields.io/npm/v/fastify?color=000000&label=Fastify&logo=Fastify&style=for-the-badge)
![PostgreSQl](https://img.shields.io/npm/v/postgresql?color=%2332648c&label=PostgreSQL&logo=PostgreSQL&style=for-the-badge)
# SR NHL Challenge

> NHL real time data pipeline. This is a coding challenge solution and will not be maintained/updated.

## Quick Start

Install dependencies and start PostgreSQL server

```bash
npm i && docker-compose up -d
```
Make migrations

```bash
npx prisma migrate dev --name init
```
...
```bash
npm run dev
```


## API Reference

#### Create shortUrl ids for redirects

```http
  GET /api/v1/game/
```

| Parameter | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| `status` | `string` | Game status. **"live,final..etc"** |
| `stats` |  | Show stats by player ID. |
| `page` | `string` |  |
| `pageSize`| `string` | Default is 10. Max 25 |

## Acknowledgements

 - [Challenge Documentation](https://github.com/sportradarus/sportradar-advanced-challenge)


