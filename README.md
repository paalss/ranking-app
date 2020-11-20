# Ranking app (work in progress)
A little app for ranking your own defined elements, and saving the changes permanently.

![App_interface](/images/app/app.png)


## Open web app
To use this app, you'll have to fire it up on your localhost. 

This app isn't public on the web, so you'll have to fire it up on localhost to use it.

This is a guide for setting up the app on localhost using XAMPP on Windows.

### 1. Install XAMPP
Get the XAMPP installer from https://www.apachefriends.org/.

During the installation you can select which compoents to download. Ensure you install MySQL. PhpMyAdmin might also come in handy, but is not necessary. (See image.)

![Xampp_components](/images/xampp/select-components.png)


### 2. Clone/download repository
Clone or download this repository and place it somewhere inside the _document root directory_, which on Windows is:

```
C:/XAMPP/htdocs
```

### 3. Import ranking_app.sql to your MySQL Server
You can use PhpMyAdmin or command line interfaces to deal with this.

#### Using PhpMyAdmin
##### Connect to MySQL Server
In XAMPP control panel app, start the Apache and MySQL services.

Click the “admin” button at the same row as “MySQL” (See image).

![PhpMyAdmin_button](/images/xampp/phpmyadmin-button.png)

Click import and import the ranking_app.sql (`/database/ranking_app.sql`) file (see image).

![PhpMyAdmin_import](/images/xampp/phpmyadmin-import.png)

#### Using Command prompt & MySQL Shell
##### Connect to MySQL Server
In XAMPP control panel app, start the MySQL service.
Run this command in the bin directory:

```
C:\xampp\mysql\bin>mysql -u root -p
```

Then type your password if any and hit enter.

##### import the database dump
While connected, you can import the ranking_app.sql by running:

```
MariaDB [(none)]> source C:/xampp/htdocs/*path/to*/Ranking-app/database/ranking_app.sql;
```

There's no need to first create an empty database, the ranking_app.sql will take care of creating it. 

Useful resource:

How do I import an SQL file using the command line in MySQL?

https://stackoverflow.com/questions/17666249/how-do-i-import-an-sql-file-using-the-command-line-in-mysql

### 4. Open the app
Open a browser and enter `localhost*path/to/*Ranking-app`.

I.e. If you downloaded/cloned the app in `htdocs/pages/Ranking-app`, you should be able to open the app by entering this: `localhost/pages/Ranking-app`

You should see this (image):

![the-words-choose-list-and-below-alist-named-wishlist](/images/app/first-look-at-app.png)

## There's no list named 'wishlist'
This most likely means the app isn't connected to the MySQL server database.

If you have changed your MySQL username or password to something else than default (username='root', pawword=''), you will have to update the db_connection.php (`/db_connection.php`) file, so it uses your current login credentials.