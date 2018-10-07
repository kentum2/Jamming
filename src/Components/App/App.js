import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from  '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

  }

  addTrack(track) {
    if (this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
      return;
    } else {
      let newList = this.state.playlistTracks.slice();
      newList.push(track);
      this.setState({playlistTracks: newList});
    }
  }
  
  removeTrack(track) {
    let updateTracks = this.state.playlistTracks;
    updateTracks = updateTracks.filter(removeTrack => removeTrack.id !== track.id);
    this.setState({ playlistTracks: updateTracks });
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({
        searchResults: searchResults
      });
    });
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                <small className="d1 copy">Spotify Library</small>
              </td>
              <td>
                <h1>J<span className="highlight">ammin</span>g</h1>
              </td>
              <td className="d3">
                <small><a href="https://open.spotify.com/collection/playlists" target="_blank" rel="noopener noreferrer" >Spotify Library</a></small>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="App">
          <SearchBar onSearch={this.search} /> 
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} 
                      onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onClick={this.savePlaylist} /> 
          </div>
        </div>
      </div>      
    );
  }
}

export default App;
