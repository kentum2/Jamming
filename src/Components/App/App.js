import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from  '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

    this.state = {
      searchResults: [
        {
        name: 'I Would Die 4 U',
        artist: 'Prince',
        album: 'Purple Rain',
        id: 'song1'
        },
        {
        name: 'Seven',
        artist: 'Artist Formerly Known As Prince',
        album: 'Diamonds and Pearls',
        id: 'song2'
        },
        {
        name: 'Jhonny Jhonny',
        artist: 'unknown',
        album: 'Not on an album',
        id: 'song3'
        }
      ],
    playlistName: 'Rebecca Playlist',
    playlistTracks: [
      {
      name: 'Jungle Love',
      artist: 'Morris Day',
      album: 'The Time',
      id: 'songA'}
      ]
    }
  };

  addTrack(track) {
    if(this.state.playlistTracks.find(playlistTrack =>playlistTrack.id===track.id)) {
      return;
    } else {
      this.state.playlistTracks.push(track);
    }
    this.setState ({
      playlistTracks: this.state.playlistTracks
    });
  }

  removeTrack(track) {
    this.state.playlistTracks.filter(playlistTrack=>playlistTrack.id !== track.id);
    this.setState({
      playlistTracks: this.state.playlistTracks
    });
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName:name
    });
  }
  
savePlaylist () {
 this.state.playlistTracks.map(track => track.uri);
 
 let trackURIs = this.state.playlistTracks.map(track => track.uri);
 Spotify.savePlaylist(this.state.playlistName, trackURIs).then(reset=> {
   this.setState ({
     playlistName: 'New Playlist',
     playlistTracks: []
   });
 });
}

search (term) {
  Spotify.search(term).then(searchResults => {
    this.setState ({
      searchResults:searchResults
    });
  });
}

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
         <SearchBar onSearch={this.search} /> 
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
                           onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist} />
          
          </div>
        </div>
      </div>
      
    );
  }
}

export default App;
