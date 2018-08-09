import React, { Component } from 'react';
import { Button } from 'antd';
import './Recommendations.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

export default class Recommendations extends Component {
    constructor() {
        super();
        this.state = {
            nowPlaying: { name: 'Not Checked', albumArt: '' },
            playlistNames: []
        }
        this.getUserPlaylists = this.getUserPlaylists.bind(this);
    }
    getNowPlaying() {
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                this.setState({
                    nowPlaying: {
                        name: response.item.name,
                        albumArt: response.item.album.images[0].url
                    }
                });
            })
    }
    getUserPlaylists() {
        spotifyApi.getUserPlaylists()
            .then(function (data) {
                return data.items.map(function (item) { return item.name });
            })
            .then((names) => {
                console.log(names);
                this.setState({
                    playlistNames: this.state.playlistNames.concat(names)
                });
            })

    }
    render() {
        return (
            <div>
                Now Playing: {this.state.nowPlaying.name}
                {this.getNowPlaying()}
                <div>
                    <img src={this.state.nowPlaying.albumArt} alt='album' style={{ height: 150 }} />
                </div>
                <Button type="primary" onClick={() => this.getNowPlaying()}>
                    Check Now Playing
                </Button>
                <Button type="primary" onClick={this.getUserPlaylists}>
                    User Playlists
                </Button>
                {
                    this.state.playlistNames.map((item, i) => {
                        return (
                            <div key={i}>
                                <p> {item} </p>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
