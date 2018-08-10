import React, { Component } from 'react';
import { Button, Table  } from 'antd';
import './Playlists.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

export default class Playlists extends Component {
    constructor() {
        super();
        this.state = {
            id: this.props.userID,
            nowPlaying: { name: 'Not Checked', albumArt: '' },
            playlists: [{
                name: '',
                numOfTracks: 0,
            }]
        }
        this.getPlaylist = this.getPlaylist.bind(this);
    }
    componentDidMount() {
        this.getNowPlaying();
        this.getUserPlaylists();
        this.state.playlists.splice(0, 1);
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
                        playlists: this.state.playlists.concat({
                            name: item.name,
                            numOfTracks: item.tracks.total,
                            id: item.id
                        })
                    });
                });
            })

    }
    getPlaylist() {
        console.log("UserID: " + this.state.userID);
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
        }, {
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
        }, {
            title: 'Get Similar Songs',
            key: 'recommend',
            render: (text, record) => (
                <div>
                    <Button icon="play-circle-o" onClick={this.getPlaylist} />
                </div>
            )
        }];
        const data = [];
        for (let i = 0; i < this.state.playlists.length; i++) {
            data.push({
                key: i,
                name: this.state.playlists[i].name,
                numOfTracks: this.state.playlists[i].numOfTracks,
                ID: this.state.playlists[i].id,
            })
        }
        return (
            <div className="playlists">
                Now Playing: {this.state.nowPlaying.name}
                <div>
                    <img src={this.state.nowPlaying.albumArt} alt='album' style={{ height: 150, marginTop: '20px'}} />
                </div>
                <Button type="primary" onClick={() => this.getNowPlaying()} style={{marginTop: '10px'}}>
                    Check Now Playing
                </Button>
                <Table className='table' dataSource={data} columns={columns} />
            </div>
        );
    }
}