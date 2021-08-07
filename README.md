# Northcoders Boardgames API

## Table of contents

- [Description](#description)
- [Technologies](#technologies)
- [Installation](#installation)
- [Setting up environment variables](#setting-up-environment-variables)
- [Seeding the database](#seeding-the-database)
- [Running tests with Jest](#running-tests-with-jest)

---

## Description

This project is an application created for the purpose of accessing application data programmatically.

The intention is to build a backend service mimicking the functionality real world services such as Reddit, Twitter and could be adapted for other services. The API will provide the information to the front end architecture.

Link to the hosted NC-Boardgames API [here](https://nc-boardgames.herokuapp.com/api/).

---

## Technologies

The technologies and packages used for this project are listed below:

- [Node.js](https://nodejs.org/en/) v14.17.4 LTS
- [Postgres](https://www.postgresql.org/) v13.0.0

Project dependencies:

- [Express](https://expressjs.com/) v4.17.1
- [Node-postgres](https://www.postgresql.org/) v8.7.1
- [Dotenv](https://www.npmjs.com/package/dotenv) v10.0.0
- [PG-format](https://www.npmjs.com/package/pg-format) v1.0.4

Dev dependencies:

- [Jest](https://jestjs.io/) v27.06
- [Jest-sorted](https://www.npmjs.com/package/jest-sorted) v1.0.12
- [SuperTest](https://www.npmjs.com/package/supertest) v6.1.4

---

## Installation

To install NC-Boardgames API, follow these steps:

1. Ensure you have the following installed:
   - Node.js (download [here](https://nodejs.org/en/))
   - Postgres (download [here](https://www.postgresql.org/))
2. Fork and clone the repo
3. Open the repo and install dependencies:

```
    npm install
```

**Note**: this will not include dev dependencies, if you wish to install dev dependencies to run tests run the command below

```
    npm install -D jest jest-sorted supertest
```

---

## Setting up environment variables

Variable environment files will need to be setup locally as they have been added to `.gitignore`.

Create the following following files in the root directory:

- `.env.development`

```
    PGDATABASE=nc_games
```

- `.env.test`

```
    PGDATABASE=nc_games_test
```

---

## Seeding the database

Run the following command, this will create the development and test databases locally, then seed the databases

```
    npm run setup-dbs
    npm run seed
```

---

## Running tests with Jest

<!-- Provide clear instructions of how to clone, install dependencies, seed local database, and run tests-->
