import React, { Component } from 'react';
import { Button, Table } from 'antd';
import './Recommendations.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

export default class Recommendations extends Component {
    constructor() {
        super();
        this.state = {
            nowPlaying: { name: 'Not Checked', albumArt: '' },
            playlistNames: [],
            numOfTracks: [],
        }
    }
    componentDidMount() {
        this.getNowPlaying();
        this.getUserPlaylists();
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
            .then((data) => {
                return data.items.forEach((item) => {
                    this.setState({
                        playlistNames: this.state.playlistNames.concat(item.name),
                        numOfTracks: this.state.numOfTracks.concat(item.tracks.total)
                    });
                });
            })

    }
    render() {
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '# of Tracks',
            dataIndex: 'numOfTracks',
            key: 'numOfTracks',
        }];
        const data = [];
        for (let i = 0; i < this.state.playlistNames.length; i++) {
            data.push({
                key: i,
                name: this.state.playlistNames[i],
                numOfTracks: this.state.numOfTracks[i]
            })
        }
        return (
            <div className="recommendations">
                Now Playing: {this.state.nowPlaying.name}
                <div>
                    <img src={this.state.nowPlaying.albumArt} alt='album' style={{ height: 150 }} />
                </div>
                <Button type="primary" onClick={() => this.getNowPlaying()}>
                    Check Now Playing
                </Button>
                <Table className='table' dataSource={data} columns={columns} />
            </div>
        );
    }
}
