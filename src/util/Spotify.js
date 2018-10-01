const clientID = "85d12631bce744e685100b5584d27167";
//const redirectURI = 'https://jammingexperiment.surge.sh/'; 
const redirectURI = 'http://localhost:3000/';

let accessToken;

const Spotify = {

    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
        if (urlAccessToken && urlExpiresIn) {
            accessToken = urlAccessToken[1];
            const expiresIn = Number(urlExpiresIn[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const spotifyURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = spotifyURL;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        const searchURL = `https://api.spotify.com/v1/search?type=track&q=${term}`;
        return fetch(searchURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json()
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
        });
    },

    savePlaylist(playlistName, trackURIs) {
        if (!playlistName ||  !trackURIs.length) {
            return;
        }

        let accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userID;
        let playlistID;

        return fetch('https://api.spotify.com/v1/me', {
            headers: headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            userID = jsonResponse.id;

            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: playlistName})
            }).then(jsonResponse => {
                playlistID = jsonResponse.id;

                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackURIs})
                });
            });
        });
    }
}

export default Spotify;