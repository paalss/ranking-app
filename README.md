# Ranking app (work in progress)
A little app for ranking your own defined elements, and saving the changes permanently.

![App_interface](/images/app.png)


## Open web app
To use this app, you'll have to fire it up on your localhost. 

This app isn't public on the web, so you'll have to fire it up on localhost to use it.

This is a guide for setting up the app on localhost using XAMPP on Windows.

### 1. Install XAMPP
Get the XAMPP installer from https://www.apachefriends.org/.

During the installation you can select which compoents to download. Ensure you get these:

- [x] Apache

- [x] MySQL

- [x] PHP

- [x] PhpMyAdmin (not necessary, but might come in handy)

### 2. Clone/download repository
Clone or download this repository and place it somewhere inside the _document root directory_, which on Windows is:

```
C:/XAMPP/htdocs
```

### 3. Import ranking_app.sql to your MySQL Server
For this you can use command line interfaces or a graphical database management tool like PhpMyAdmin.

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

#### Using PhpMyAdmin
In XAMPP control panel app, start the Apache and MySQL services.

Click the “admin” button at the same row as “MySQL”.

You will automatically log in.

Click import and import the ranking_app.sql (`/database/ranking_app.sql`) file.

### 4. Ensure db_connection.php has the right login credentials
The file db_connection.php (`/db_connection.php`) holds the login credentials that connects the app to your MySQL server. By defailt this is set to $username='root' and $password=''. If those details doesn't match yours, open this file in a text editor and edit the text so it does.

### 5. Open the app
Open a browser and enter `localhost*path/to/*Ranking-app`.

I.e. If you downloaded/cloned the app in `htdocs/folderName/ranking-app`, you should be able to open the app by entering this: `localhost/folderName/ranking-app`
