# Ranking app (work in progress)
A little app for ranking your own defined elements, and saving the changes permanently.

![App_interface](/images/app.png)

## Open web app
This app isn't public on the web, it has to be run locally.

You need PHP on your computer. You can get it by installing XAMPP from https://www.apachefriends.org/index.html.

In terminal / command prompt, navigate to the project folder (probably named Ranking-app or Ranking-app-master).

Run `php -S 127.0.0.1:8000` to start the localhost server.

Open a browser and enter http://127.0.0.1:8000/.

## Automatic testing
Install Jest and puppeteer by running `npm install --production` in terminal / command prompt.

The localhost server has to be running.

Since `php -S 127.0.0.1:8000` now occupies the terminal, open a new one.

Run `npm test`