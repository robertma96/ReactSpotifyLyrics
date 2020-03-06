import React, {useEffect, useRef, useState} from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Button from "react-bootstrap/Button";
import Song from "./Song";
import ProgressBar from "react-bootstrap/ProgressBar";
import Lyrics from "./Lyrics";

// Endpoints
const StartResumePlaybackEndpoint = "https://api.spotify.com/v1/me/player/play";
const PausePlaybackEndpoint = "https://api.spotify.com/v1/me/player/pause";
const currentlyPlayingEndpoint = "https://api.spotify.com/v1/me/player";
const recentlyPlayedEndpoint = "https://api.spotify.com/v1/me/player/recently-played";
const skipNextSongEndpoint = "https://api.spotify.com/v1/me/player/next";
const skipPrevSongEndpoint = "https://api.spotify.com/v1/me/player/previous";

function Player(props) {
    const [currentlyPlayingSong, setCurrentlyPlayingSong] = useState({
        song: {},
        statusCode: "",
    });

    useInterval(() => {
        if (props.accessToken) {
            getCurrentlyPlayingSong(props.accessToken);
        }
    }, currentlyPlayingSong.song.is_playing ? 1000 : 5000);

    // Render the song when we obtain the access token
    useEffect(() => {
        if (props.accessToken) {
            getCurrentlyPlayingSong(props.accessToken);
        }


    }, [props.accessToken]);

    function playPauseCurrentTrack(token) {
        setCurrentlyPlayingSong({
            song: {
                ...currentlyPlayingSong.song,
                is_playing: !currentlyPlayingSong.song.is_playing
            }
        });
        $.ajax({
            url: currentlyPlayingSong.song.is_playing ? PausePlaybackEndpoint : StartResumePlaybackEndpoint,
            type: "PUT",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            },
            success: (data) => {
                console.log(data);
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    const skipNextSong = (token) => {
        console.log("Skipping song");
        $.ajax({
            url: skipNextSongEndpoint,
            type: "POST",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            },
            success: (data) => {
                console.log(data);
            },
            error: (error) => {
                console.log(error);
            }
        });
    };

    const skipPrevSong = (token) => {
        console.log("Skipping song");
        $.ajax({
            url: skipPrevSongEndpoint,
            type: "POST",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            },
            success: (data) => {
                console.log(data);
            },
            error: (error) => {
                console.log(error);
            }
        });
    };

    const getCurrentlyPlayingSong = (token) => {
        console.log("Currently playing:");
        const config = {
            headers: {Authorization: `Bearer ${token}`}
        };

        axios.get(
            currentlyPlayingEndpoint,
            config
        ).then(response => {
            if (response.status === 200) {
                setCurrentlyPlayingSong({
                    song: response.data,
                    statusCode: response.status
                });
            } else if (response.status !== 200) {
                // getRecentlyPlayedSong(token);
                console.log(response);
            }
        }).catch(error => {
            console.log(error);
        });
    };

    const getRecentlyPlayedSong = (token) => {
        console.log("Recently played:");
        const config = {
            headers: {Authorization: `Bearer ${token}`}
        };
        axios.get(
            recentlyPlayedEndpoint,
            config
        ).then(response => {
            console.log(response);
            if (response.status === 200) {
                setCurrentlyPlayingSong({
                    song: response.data.items[0],
                    statusCode: response.status
                });
            } else if (response.status !== 200) {
                setCurrentlyPlayingSong({
                    song: '',
                    statusCode: response.status
                });
            }
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <div>
            {props.accessToken && Object.entries(currentlyPlayingSong.song).length ?
                <div className="row align-items-center">
                    <div className="col-sm vw-100">
                        <Song currentlyPlayingSong={currentlyPlayingSong}/>
                        <ProgressBar className="progressBar" now={currentlyPlayingSong.song.progress_ms}
                                     max={currentlyPlayingSong.song.item.duration_ms}/>

                        <Button className="control-button" onClick={() => {
                            skipPrevSong(props.accessToken)
                        }}>
                            Previous
                        </Button>

                        <Button className="control-button"
                                onClick={() => playPauseCurrentTrack(props.accessToken)}>{currentlyPlayingSong.song.is_playing ?
                            <span>Stop</span> : <span>Play</span>}
                        </Button>

                        <Button className="control-button" onClick={() => {
                            skipNextSong(props.accessToken)
                        }}>
                            Next
                        </Button>
                    </div>

                    <div className="col-sm overflow-auto vw-100 vh-100">
                        <Lyrics songInformation={
                            {
                                song: currentlyPlayingSong.song.item.name,
                                artist: currentlyPlayingSong.song.item.artists
                            }
                        }/>
                    </div>
                </div>
                :
                <Button disabled={true}>Play</Button>}
        </div>
    );
}

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default Player;
