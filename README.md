# Ranking app (work in progress)
A little app for ranking your own defined elements, and saving the changes permanently. This app can now be served using Docker, thanks to sprintcube/docker-compose-lamp. See more here: https://github.com/sprintcube/docker-compose-lamp

![App_interface](www/app/images/app/app.png)

## Open web app
I've layed up for using Docker to serve this AMP-stack app, but if you'd rather use XAMPP, you can visit an earlier version of this app. See this commit:

https://github.com/paalss/Ranking-app/tree/e153adf208a48f6bcaf386fe152b34e114b68b43

**Prerequisites**

* Git

* Docker

* Docker-compose

```
git clone https://github.com/paalss/Ranking-app.git

cd Ranking-app

cp sample.env .env

docker-compose up -d
```

> If docker-compose up -d gives `ERROR: Service 'webserver' failed to build: The command '/bin/sh -c apt-get -y`, you might want to rebuild the container, using:
>
> ```
> docker-compose build --no-cache
> ```

You will have to import the ranking_app.sql file into the MySQL server. Go to PhpMyAdmin by entering `localhost:8080` in a browser. In the interface click the “import” tab, click “browse”, find and choose ranking_app.sql (`www/app/database/ranking_app.sql`), then click “Go” at the bottom of the page.

In a browser, enter `localhost/app/`

The app should open, and show the pre-made-example list "wishlist".