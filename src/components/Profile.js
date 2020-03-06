import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';


const profileEndpoint = "https://api.spotify.com/v1/me";

function Profile(props) {
    const [profileName, setProfileName] = useState('');

    useEffect(() => {
        if (props.accessToken) {
            getProfileName(props.accessToken);
        }
    }, [props.accessToken]);

    const getProfileName = (token) => {
        const config = {
            headers: {Authorization: `Bearer ${token}`}
        };
        axios.get(
            profileEndpoint,
            config
        ).then(response => {
            setProfileName(response.data.display_name);
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <div>
            {profileName ? <p>Welcome, {profileName}</p> : <p>Please log in.</p>}
        </div>
    );
}

export default Profile;
