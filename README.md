# Ranking app (work in progress)
A little app for ranking your own defined elements, and saving the changes permanently.

This app can now be served using Docker, thanks to sprintcube/docker-compose-lamp. See more here: https://github.com/sprintcube/docker-compose-lamp

![App_interface](www/app/images/app/app.png)

## Open web app
I've layed up for using Docker to serve this AMP-stack app, but if you'd rather use XAMPP, you can visit an earlier version. See this commit:

https://github.com/paalss/Ranking-app/tree/e153adf208a48f6bcaf386fe152b34e114b68b43

If you want to use Docker, continue reading.

**Prerequisites**

* Git

* Docker

* Docker-compose

Start Docker Desktop

**Run in a Bash**

```
git clone https://github.com/paalss/Ranking-app.git

cd Ranking-app/

cp sample.env .env

docker-compose up -d
```

> If docker-compose up -d returns `ERROR: Service 'webserver' failed to build: The command '/bin/sh -c apt-get -y`, you might want to rebuild the container, using:
>
> ```
> docker-compose build --no-cache
> ```

**Import database into MySQL server**

1. Open PhpMyAdmin by going to [localhost:8080](http://localhost:8080) in a browser

2. In the interface, click the “import” tab. On this page, click “browse”, find and choose ranking_app.sql (`database/ranking_app.sql`), then click “Go” at the bottom of the page.

**Open the site in a browser**

[localhost/app/](http://localhost/app/)

If everything worked correctly, you should see a premade list (named “wishlist”) on the page.

## Run automatic tests

**Navigate to app folder and install the dependencies**

```
cd www/app/
npm install
```

**Run tests**

```
npm test
```