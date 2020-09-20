# Ranking app (work in progress)
A little app for ranking your own defined elements, and saving the changes permanently.

## Open web page
This app isn't currently public on the web, so you'll have to fire it up in a localhost server. The server must be able to run PHP. You can use XAMPP for Windows/Mac to do this. See instructions below:

### Localhost setup guide with XAMPP Windows/Mac

#### 1. Download XAMPP from https://www.apachefriends.org/index.html
NB: Make sure “Apache” is checked during the installation process. This is needed to run PHP apps.

#### 2. Download source code into a server-folder
2.1 Open XAMPP

2.2 Download / clone the source code into the server-folder xampp/htdocs/ (for xampp windows), lampp/htdocs (for xampp mac) or similar. 

NB for XAMPP Mac users: The server folder isn't automatically available in Finder, you'll have to mount it first. Use mount button in the XAMPP app.

#### 3. Start server and open:
3.1 In XAMPP interface, start Apache

3.2 Open the webpage by writing: localhost/path/to/sourceCodeFolder (xampp windows), localhost:8080/path/to/sourceCodeFolder (xampp mac) or similar.


## Automatic testing

1. Download Jest and puppeteer by running "npm install" in terminal / command line

2. Run "npm test"