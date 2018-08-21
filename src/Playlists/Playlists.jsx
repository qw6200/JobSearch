import React, { Component } from 'react';
import { Button, Table } from 'antd';
import './Playlists.css';
import Recommendations from '../Recommendations/Recommendations';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

export default class Playlists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            nowPlaying: { name: 'Not Checked', albumArt: '' },
            playlists: [{
                name: '',
                numOfTracks: 0,
            }],
            isRecommendations: false,
            tracksList: [],
            selectedPlaylistID: '',
            randomTracks: [],
        }
        this.getPlaylistTracks = this.getPlaylistTracks.bind(this);
        this.handleModal = this.handleModal.bind(this);
    }
    componentDidMount() {
        this.getNowPlaying();
        this.getUserPlaylists();
        this.state.playlists.splice(0, 1);
        this.setState({
            id: this.props.userID
        })
        this.createPlaylist();
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
    handleModal() {
        this.setState(prevState => ({
            isRecommendations: !prevState.isRecommendations
        }));
        this.setState({
            randomTracks: [],
            tracksList: []
        })
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    getRandomTracks(key) {
        for (var i = 0; i < 5; i++) {
            const randomID = this.state.tracksList[this.getRandomInt(this.state.tracksList.length-1)];
            this.setState({
                randomTracks: this.state.randomTracks.concat(randomID),
                selectedPlaylistID: this.state.playlists[key].id
            })
        }
    }
    getPlaylistTracks(data, key) {
        spotifyApi.getPlaylistTracks(this.state.id, data.ID)
            .then((data) => {
                data.items.forEach((item) => {
                    this.setState({
                        tracksList: this.state.tracksList.concat(item.track.id)
                    })
                })
            })
            .then(() => {
                this.getRandomTracks(key);
            })
            .then(() => {
                this.setState(prevState => ({
                    isRecommendations: !prevState.isRecommendations
                }));
            })
    }
    createPlaylist() {
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '# of Tracks',
            dataIndex: 'numOfTracks',
            key: 'numOfTracks',
        }, {
            title: 'Get Similar Songs',
            key: 'recommend',
            render: (data, record) => (
                <div>
                    <Button icon="play-circle-o" onClick={() => this.getPlaylistTracks(data, record.key)} />
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
        const rowSelection = {
            onSelect: (record, selected, selectedRows) => {

            },
            // onChange: (selectedRowKeys, selectedRows) => {
            //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            // },
            // onSelectAll: (selected, selectedRows, changeRows) => {
            //     console.log(selected, selectedRows, changeRows);
            // },
        };
        return (
            <Table rowSelection={rowSelection} className='table' dataSource={data} columns={columns} />
        )
    }
    render() {
        return (
            <div className="playlists">
                Now Playing: {this.state.nowPlaying.name}
                <div>
                    <img src={this.state.nowPlaying.albumArt} alt='album' style={{ height: 150, marginTop: '20px' }} />
                </div>
                <Button type="primary" onClick={() => this.getNowPlaying()} style={{ marginTop: '10px' }}>
                    Check Now Playing
                </Button>
                {this.createPlaylist()}
                {this.state.isRecommendations ? <Recommendations userID={this.state.id} 
                                                                 handler={this.handleModal} 
                                                                 handleOutside={this.handleOutsideClose} 
                                                                 randomTracks={this.state.randomTracks}
                                                                 selectedPlaylistID={this.state.selectedPlaylistID}/> : null}
            </div>
        );
    }
}

