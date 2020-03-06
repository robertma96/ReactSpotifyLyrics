import React, {Fragment} from 'react';

function Song(props) {
    return (
        <div>
            {Object.entries(props.currentlyPlayingSong.song).length ?
                <Fragment>
                    <p>Song: {props.currentlyPlayingSong.song.item.name}</p>
                    <p>Artist: {props.currentlyPlayingSong.song.item.artists.map((artist, id = 0) => {
                        if (id === props.currentlyPlayingSong.song.item.artists.length - 1) {
                            return (<span key={id + 1}>{artist.name}</span>)
                        } else {
                            return (<span key={id + 1}>{artist.name}, </span>)
                        }
                    })
                    }
                    </p>
                    <img src={props.currentlyPlayingSong.song.item.album.images[1].url} alt="Album Cover"/>
                </Fragment> : props.currentlyPlayingSong.statusCode === 204 ? <p>No song is currently playing!</p> :
                    <p>Ups! Something went wrong!</p>}
        </div>
    );
}

export default Song;