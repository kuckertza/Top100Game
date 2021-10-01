//This is the class that uses axios fra,mework to connect the react 
//frontend to the Node.js backend.

import React, { Component } from "react";
import axios from "axios";


export default class Songs extends React.Component{
    //react constructor, sets default songs to null array and show rto false
    constructor(props){
        super(props);
        this.state = {
            songs: [],
            show: false
        };
        //binds the various methods to this to ensure they are acting on the
        //the constructor this and not the local this of the various methods that 
        //call this
        this.getSongsData = this.getSongsData.bind(this);
        this.getRandomSongs = this.getRandomSongs.bind(this);
        this.showSongs = this.showSongs.bind(this);
    }

    //picks three songs objects at random from the array and sets the new array to state.songs
     getRandomSongs() {
        let allItems = this.state.songs
        const randomCount = 3;
        const randomItems = [];
        for (let i = 0; i < randomCount; i++) {
          const randomIndex = Math.floor(Math.random() * allItems.length);
          const randomItem = allItems[randomIndex];
          randomItems.push(randomItem);
        }
        this.setState({
            songs: randomItems,
            show: false
        });
      };

    //sets state.show to true when called
    showSongs(){
        this.setState({
            songs: this.songs,
            show: true
        });
    }

    //retrives the array of webscraped songs from the backend and calls
    //getRandomSongs on it, to get three random songs
    getSongsData() {
        axios
            .get(`/api/songs`, {})
            .then(res => {   
                this.state.songs.setState({
                    songs: res.data,
                    show: false
                });
                const items = this.getRandomSongs()
                this.setState({
                    songs: items,
                    show:false
                });
                return items;
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //calls getSongsData to communicate with the Node.js backend
    componentDidMount = () => {
        this.getSongsData()
    };

    render(){
        return(
            <div>
                <h1>
                    Click the first button to fetch your songs and the second to see them!
                </h1>
            {/*button that when clicked calls getSongData */}
            <button onClick={this.getSongsData} >Fetch me my songs!</button>
             {/*button that when clicked calls showSongs. Ideally the map function could then 
             be called to get and display data that was fetched from the previous button click
             but map is throwing an exception of "TypeError Cannot read properties of undefined 
             (reading 'map')" which means that it thinks this.state.songs is still undefined for some 
             reason; something that needs to be fixed before game can be finished. But code would have
             ben written so that game gets new songs each time the Fetch me my songs button is clicked, 
             resetting the game, and everytime the show me my songs button is clicked diplays the three 
             songs and three buttons saying (1,2, and 3) under each one. And then the user clicks the
             the button of the ranking they think is correct. But sadly, map is leading the code astray :(
             */}
            <button onClick={this.showSongs} >Show me my songs!</button>
            {/* {
                this.state.show && this.state.songs.map( ( {id} ) => {
                    return <p key={id}>{id.rank} -{id.songTitle}- {id.artist}</p>
        
                })
        } */}

        </div>
        )}
}