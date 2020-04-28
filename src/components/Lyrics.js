import React, {useEffect, useState} from 'react';
import Spinner from "react-bootstrap/Spinner";

import {getLyrics} from 'genius-lyrics-api';

function Lyrics(props) {
    const [lyrics, setLyrics] = useState('');
    const [fetching, setFetching] = useState(true);

    const song = props.songInformation.song;
    const artist = props.songInformation.artist[0].name;

    useEffect(() => {
        const options = {
            apiKey: '',  // genius developer access token
            title: song,
            artist: artist,
            optimizeQuery: true
        };

        setFetching(true);
        setLyrics('');

        getLyrics(options).then(lyrics => {
            setLyrics(lyrics);
            setFetching(false);
        })

    }, [artist, song]);


    return (
        <div>
            {fetching ?
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner> : <p></p>}
            {lyrics ? <div className="lyrics">{lyrics}</div> : <p>Fetching lyrics</p>}
        </div>
    );
}

export default Lyrics;
