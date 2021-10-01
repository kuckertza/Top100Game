//Dependencies for Express api framework
const Joi = require('joi');
const { response } = require('express');
const express = require('express');
const app = express();

//Uses middleware in request processing pipeline
app.use(express.json());
const fs = require('fs');
const writeStream = fs.createWriteStream('songs.csv');

//Write Headers
writeStream.write('Rank,Song,Artist\n');

//dependencies for webscraping
const request = require('request');
const cheerio = require('cheerio');

//Array to hold 100 webscraped songs
const songs = [];

//request the top 100 link
request('https://www.billboard.com/charts/hot-100', (error, response, html) => {
    //200 means a successful http response
    if(!error && response.statusCode == 200){
        const $ = cheerio.load(html);

        /*Loops through the top 100 website and get the id(aka the rank), the song title, and the artist.
        Then uses this info to create a song object and adds the song object to the songs array
        */
        $('.chart-list__element').each((i, el) => {
            const id = parseInt($(el).find('.chart-element__rank__number').text());
            const songTitle = $(el).find('.chart-element__information__song').text();
            const artist =  $(el).find('.chart-element__information__artist').text();

            const tempSong = new Song(id, songTitle, artist);
            songs[i] = tempSong;

            //Write Row to CSV
            writeStream.write(`${id}, ${songTitle}, ${artist}\n`);
        });
        /*
        Album cover information from the top 100 website to use to add album covers later
        <"chart-element__image" style="background-image: url(&quot;https://charts-static.billboard.com/img/2021/07/the-kid-laroi-qev-stay-ens-155x155.jpg&quot;);"></span>
        <class="chart-element__image flex--no-shrink" style="background-image: url(&quot;https://charts-static.billboard.com/img/2021/09/drake-p3d-way-2-sexy-hhn-155x155.jpg&quot;);"></span>
        */
       console.log("scraping done");
    }
});

//gets all the songs from the api
app.get('/api/songs', (req, res) =>{
    res.send(songs);
});

//Searches API for the ID number(aka the ranking) and returns a 404 if not found
app.get('/api/songs/:id', (req, res) => {
    let song = songs.find(c => c.id == parseInt(req.params.id));
    if (!song) return res.status(404).send('The song was not found');
    res.send(song);
});


//use to create a new song and add it to the API
app.post('/api/songs', (req, res) => {
    const {error} = validateSong(req.body); 

    if(error) return res.status(400).send(error.details[0].message);

     /*have to do manually but if using database, the database assigns this automatically; change later if database 
        is implemented. This may have issues since it isn't creating an actual song object. Since songs probably won't be added, will leave
        to fix later if time permits.*/
    const song = {
        id: songs.length + 1,
        name: req.body.name
    };
    songs.push(song);
    res.send(song);
});

/*
    Look up the song, if not existing, return 404

    //Validate
    //If invalid, return 400 -Bad Request

    //update song
    //Return the updated song
*/ 
app.put('/api/songs/:id', (req, res) => {
    let song = songs.find(c => c.id == parseInt(req.params.id));
    if (!song) return res.status(404).send('The song was not found');

    const {error} = validateSong(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    song.name = req.body.name;
    res.send(song);
 
});

/*
Look up the song
if doesn't exist, return 404
delete and return the deleted 
*/
app.delete('/api/songs/:id', (req, res) => {
    let song = songs.find(c => c.id == parseInt(req.params.id));
    if (!song) return res.status(404).send('The song was not found');

    const index = songs.indexOf(songs);
    songs.splice(index, 1);
    res.send(song);
});

/*
Validates that the song parameter has at least one character. Basic for now. Make more robust if time permits.
*/
function validateSong(song){
    const schema = Joi.object({
        name: Joi.string().min(1).required()
    });

    return schema.validate(song);
}

/* 
Song is a class for a song object which holds the id(aka the song ranking), the songTitle, and the artist 
methods exists to get the id, then song title, and the artist. There is also an outprintSong method to print out
all the data members.
*/
class Song{
    constructor(id, songTitle, artist){
        this.id=id;
        this.songTitle = songTitle;
        this.artist = artist;
    }
    getID(){
        return this.id;
    }
    getSongTitle(){
        return this.songTitle;
    }
    getArtist(){
        return this.artist;
    }
    outprintSong(){
        console.log('Id: ', this.id, '\nSongTitle: ', this.songTitle, '\nArtist: ', this.artist);
    }
}

/*Sets up port variable to be assigned dynamically; (useful for databases, will only be relevant if database is implemented) 
and if that doesn't work, is assigned to 5000*/
const port = process.env.PORT || 5000;

/*opens PORT
Can set port environment variable locally from terminal using export PORT = <portvalue> 
on mac or set PORT = <portvalue> on windows
*/
app.listen(port, () => console.log(`Listening on port ${port}...`))