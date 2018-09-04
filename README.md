# Tippiq Id OSS

*Update 03-09-2017*: This repository is now published as open source software under the GPL 3 License (see the LICENSE file).

*Warning*: Please take the appropriate security measures before running this software in production.


Tippiq Identity Provider
========================

### Installation

**Prerequisites**
* Ruby, should come preinstalled on your Mac
* [Homebrew](http://http://brew.sh/)
* Wget, `brew install wget`
* [Git](http://git-scm.com/), `brew install git`
* [PostgreSQL](https://github.com/PostgresApp/PostgresApp/releases/download/9.5.5/Postgres-9.5.5.zip), do not install via Homebrew or use version 9.6 as that causes the migrations to fail
* Add `export PATH=$PATH:/Applications/Postgres.app/Contents/Versions/latest/bin` to your `~/.bash_profile` and `source ~/.bash_profile`. Doing `which psql` should report the installation
* [Node.js](https://nodejs.org/), `brew install homebrew/versions/node6-lts`, do not use v7 as some dependencies are incompatible
* `npm install -g knex`, for doing the database migrations
* `npm install -g yarn`, for efficient dependency management

Local install:

    gem install mailcatcher

Or use with Docker:

    docker run --restart unless-stopped -d -p 1025:1025 -p 1080:1080 --name mailcatcher schickling/mailcatcher

**Install dependencies**

    yarn

Execute in terminal:

    psql -c "create user tippiq_id with password 'tippiq_id';"

    psql -c "ALTER USER tippiq_id WITH SUPERUSER"

    createdb -e -O tippiq_id tippiq_id

### Development

    export TIPPIQ_ID_DATABASE_URL="postgresql://tippiq_id:tippiq_id@localhost:5432/tippiq_id"

    npm run dev

Open [localhost:3001/styleguide](http://localhost:3001/styleguide) to verify

### Seed data

    knex seed:run

### Testing

    npm run e2e

If chromedriver could not be found, make sure to update with:

    ./node_modules/protractor/bin/webdriver-manager update


## Creating private and public keys

A Microservice has to sign a request with its private when it needs to access a protected endpoint on another microservice.
Below is an example of how to create a private/public key pair using openssl:

Create a private key:
`openssl ecparam -name secp256k1 -genkey -noout -out private-key.pem`

Use private key to create a public key:
`openssl ec -in private-key.pem -pubout -out public-key.pem`

### Contributing

Please read up on our [guidelines](https://github.com/Alliander/tippiq-oss-id/blob/master/CONTRIBUTING.md) for contributing.
