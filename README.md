# This game lets you test your song knowledge!
## Backend

The backend of this game uses Node.js with a cheerio framework to webscrape the top 100 songs from https://www.billboard.com/charts/hot-100, creating an API for said songs. It then takes the songs from the API and puts them into an array of song objects. Each object contains the song ranking, title, and artist.

## Frontend

The frontend was built using react.js. It uses the axios framework to connect to the backend. Sadly, there are still issues that are preventing gameplay from fully functioning(see Song.js in the client folder for more in depth documentation on errors) :( But one can still see the front end and iteract with it a bit. See below for more details on how to access it.

## How to make the program do stuff (for now)
 
After you clone the repository open the comnand terminal and cd to backend, type in the command node app.js. Open a new terminal and cd to client(the frontend) and type in the command npm start. Then mosey on over to your localhost:3000 and enjoy. The first button sadly will not do anything when you click it and the second one will throw an error (see Song.js in the client folder for more in depth documentation on errors). 

