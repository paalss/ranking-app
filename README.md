# Ranking app (work in progress)
A little app for ranking your own defined elements, and saving the changes permanently.

![App_interface](/images/app.png)


## Open web app
This app isn't public on the web, it has to be run locally.

You need PHP on your computer. You can get it by installing XAMPP from https://www.apachefriends.org/index.html.

In terminal / command prompt, navigate to the project folder (probably named Ranking-app or Ranking-app-master).

Run:

```
php -S 127.0.0.1:8000
```

Open a browser and enter http://127.0.0.1:8000/.

## Automatic testing
### Prerequisites
1. Install XAMPP from https://www.apachefriends.org/index.html, if you haven't already.

2. Ensure the project folder is placed somewhere inside your server-folder:

<b>Windows server folder</b>

xampp/htdocs/

<b>Mac server folder</b>

The server folder isn't automatically available in Finder, you'll have to mount the volume first. Open the XAMPP app, navigate to volume page and click the mount button to enable it.

lampp/htdocs/

___

If done correctly, you should by now be able to open the web page in browser this way:

<b>Windows</b>

Open XAMPP app, then start “Apache”. Enter localhost/path/to/project-folder in browser.

(localhost is equivalent to the htdocs folder. The path to project folder should be the same in both.)

<b>Mac</b>

Open XAMPP app, click “start”. When XAMPP's ready, you can start “Apache” (Services page). Enable a localhost port. Enter something like localhost:8080/path/to/project-folder in browser.

(localhost is equivalent to the htdocs folder. The path to project folder should be the same in both.)

___

3. Download Jest and puppeteer by running `npm install` in terminal / command prompt, in the project folder

4. In script.test.js, replace the path in `await page.goto('___')` with your path to this project folder.

5. Make sure the localhost server is running. It should be if you managed to open the web page as described between step 2 and 3.

6. Run `npm test`