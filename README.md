# Ranking app (discontinued)
A little web app for ranking your own defined elements, particularly products like books, movies and games. I will possibly implement options to import elements from web API (eg. music from Spotify).

![App_interaction](www/app/images/app/app-recording1.gif)

## How to serve locally

### Serve with XAMPP
[XAMPP README](https://github.com/paalss/Ranking-app/blob/master/www/app/)

### Serve with Docker

**Prerequisites**

* Docker

**Start Docker Desktop**

**Download source code and run containers**

Clone repository, navigate to Ranking-app/ and run:

```
cp sample.env .env

docker-compose up -d
```

Be sure to close any other MySQL servers when you run `docker-compose up -d`. Otherwise you won't be able to connect to the database.

If docker-compose up -d returns `ERROR: Service 'webserver' failed to build: The command '/bin/sh -c apt-get -y`, you might want to rebuild the container, using:

```
docker-compose build --no-cache
```

**Import database to your MySQL server**

You can import the database using PhpMyAdmin or Adminer.

Using PhpMyAdmin (fastest):

1. Go to [localhost:8080](http://localhost:8080) in a browser

2. In the interface, click the “import” tab. On this page, click “browse”, find and choose ranking_app.sql (`database/ranking_app.sql`), then click “Go” at the bottom of the page.

Using Adminer:

1. Go to [localhost:8081](http://localhost:8081)

2. log in with Server: database, Username: root and Password: tiger

3. In the interface, click the “import” tab. On this page, click “browse”, find and choose ranking_app.sql (`database/ranking_app.sql`), then click “Execute”.

**Open the site in a browser**

[localhost/app/](http://localhost/app/)

If everything worked correctly, you should see a premade list (named “wishlist”) on the page.

**Known bug**

When deleting items and saving changes, the database doesn't always remove the corresponding records.

When an item is trashed, it can be deleted from GUI. Upon next saving, the app will tell the database which records to delete. Sometimes the database ignores it, even when the request data is all correct and the queries returns true.

## Run e2e tests (jest&puppeteer)
**Navigate to the app folder and install the dependencies**

If none of the tests work, try opening the site manually and navigate to a list. Then run the tests again.

```
cd www/app/
npm install
```

**Run tests**

```
npm test
```

## I've used code from 
* sprintcube/docker-compose-lamp for making this app serve-able with Docker. See more: https://github.com/sprintcube/docker-compose-lamp

* SortableJS/sortablejs for drag and drop functionality. See more: https://github.com/SortableJS/sortablejs

## Development

Compile TS to JS ES6:

```
tsc www/app/script.ts --target es6
```
