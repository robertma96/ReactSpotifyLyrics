import React, {useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import Player from "./components/Player";

const queryString = require('querystring');
const cookies = new Cookies();

const authEndpoint = "https://accounts.spotify.com/authorize";


// Secrets
const clientId = "a6edcec27c8b4ca5b8f5f91287a63ee8";
const redirectUri = "http://localhost:3000";
const scopes = [
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-read-private",
    "user-modify-playback-state",
    "user-read-recently-played"
];

// const cookieAccessToken = cookies.get('access_token');

function App() {
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const parsedAccessToken = queryString.parse(window.location.hash)['#access_token'];
        const expiresIn = queryString.parse(window.location.hash)['expires_in'];
        const cookie_token = cookies.get('access_token');

        if (cookie_token !== undefined || "undefined") {
            console.log('got it from cookies');
            setAccessToken(cookie_token);
        }
        else if (parsedAccessToken) {
            setAccessToken(parsedAccessToken);
            // Calculating the expire time for the cookie
            let d = new Date();
            d.setTime(d.getTime() + (expiresIn / 60 * 60 * 1000));
            cookies.set('access_token', parsedAccessToken, {path: '/', expires: d});
        }

    }, [accessToken]);


    return (
        <div className="App">
            <header className="App-header container-fluid">
                {accessToken ? <Player accessToken={accessToken}/> :
                    <a href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>Login
                        to Spotify</a>}
            </header>
        </div>
    );
}

export default App;
