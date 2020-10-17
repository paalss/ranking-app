# Ranking app (work in progress)
A little app for ranking your own defined elements, and saving the changes permanently.

![App_interface](/images/app.png)


## Open web app
This app isn't public on the web, it has to be run locally.

Prerequisite: Have PHP on your computer. You can get it by installing XAMPP from https://www.apachefriends.org/index.html. NB: During the installation process, make sure to select the “Apache” and “PHP” components, so that they gets downloaded.

Terminal / command prompt:

cd to path/to/projectFolder and run:
```
php -S 127.0.0.1:8000
```

Open a browser and go to http://127.0.0.1:8000/

## Automatic testing
Install XAMPP from https://www.apachefriends.org/index.html, if you haven't already.

Ensure the project folder is placed somewhere inside the server-folder:

<b>windows server folder</b>
xampp/htdocs/

<b>mac server folder</b>
lampp/htdocs/

NB for XAMPP Mac users: The server folder isn't automatically available in Finder, you'll have to mount it first. Use mount button in the XAMPP app user interface.

1. Download Jest and puppeteer by running "npm install" in terminal / command prompt

2. In script.test.js, replace the path in “await page.goto('___')” with your path to this project folder. localhost/path/to/projectFolder (xampp windows), localhost:8080/path/to/projectFolder (xampp mac)

3. Make sure the localhost server is running, e.g. by starting Apache from the XAMPP user interface

4. Run "npm test"