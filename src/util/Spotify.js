const clientID = "85d12631bce744e685100b5584d27167";
//const redirectURI = 'https://jammingexperiment.surge.sh/'; 
const redirectURI = 'http://localhost:3000/';

let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    //If access token not set yet, check the URL to see if it's there.
      const accessTokenArray = window.location.href.match(/access_token=([^&]*)/);
      const expiresInArray = window.location.href.match(/expires_in=([^&]*)/);
      if (accessTokenArray && expiresInArray) {
        accessToken = accessTokenArray[1];
        console.log("get method finds" + accessToken);
        const expiresIn = Number(expiresInArray[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
         //If there's no token and expiration in the URL, to to Spotify and get it.
      } else {
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        window.location = accessUrl;
      }

    /*else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/);
      let expiresIn = window.location.href.match(/expires_in=([^&]*)/);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }*/
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    console.log(accessToken);
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      } else {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      }
    })
  },

  savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris.length) {
      console.log('return from the beginning');
      return;
    }
  
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;
    //Get playlist ID for new
    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({playlistName: playlistName})
      }).then(response => response.json()
      ).then(jsonResponse => {
        console.log(jsonResponse)
        /*const playlistId = jsonResponse.id;
        let testFetch =  fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris}) 
          
        }) */
        /*console.log(testFetch);
        return testFetch;*/
        
        })
      })
    }
  };
  
  

export default Spotify;