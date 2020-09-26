# Ranking app (work in progress)
A little app for ranking your own defined elements, and saving the changes permanently.

![App_interface](/images/app.png)


## Possible functionality in finished product
I'm thinking of making this app able to “copy list to clipboard”, so that you can create a list, paste it into a Google Doc and share it as a wishlist. Also possible functionality could be to make this into a list-sharing app where different users can share lists with oneanother.


## Open web app
This app isn't public on the web, so you'll have to fire it up in a localhost server which can run PHP.

You can use XAMPP for Windows/Mac to do this. See instructions below:

### Localhost setup guide with XAMPP Windows/Mac

#### 1. Download XAMPP from https://www.apachefriends.org/index.html
NB: During the installation process, make sure to select the “Apache” and “PHP” components, so that they gets downloaded.

#### 2. Download source code into the server-folder
Download / clone the source code into the server-folder xampp/htdocs/ (for xampp windows), lampp/htdocs (for xampp mac) or similar. 

NB for XAMPP Mac users: The server folder isn't automatically available in Finder, you'll have to mount it first. Use mount button in the XAMPP app user interface.

#### 3. Start server and open site
Open XAMPP app if you haven't already.

In XAMPP interface, start Apache. In Mac version this button is on the “Services” page.

Open the webpage in browser with the path: localhost/path/to/sourceCodeFolder (xampp windows), localhost:8080/path/to/sourceCodeFolder (xampp mac) or similar.


## Automatic testing
1. Download Jest and puppeteer by running "npm install" in terminal / command line

2. In script.test.js, replace the path in “await page.goto('___')” with the path your path to the source code folder. localhost/path/to/sourceCodeFolder (xampp windows), localhost:8080/path/to/sourceCodeFolder (xampp mac)

3. Make sure the localhost server is running, e.g. by starting Apache from the XAMPP user interface

4. Run "npm test"