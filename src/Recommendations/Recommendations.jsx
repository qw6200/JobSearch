import React, { Component } from 'react';
import { Modal, Table, Button } from 'antd';
import './Recommendations.css';
import SpotifyWebApi from 'spotify-web-api-js';
import ReactPlayer from 'react-player'
const spotifyApi = new SpotifyWebApi();

export default class Recommendations extends Component {
    constructor() {
        super();
        this.state = {
            userID: '',
            visible: true,
            randomTracks: [],
            playlists: [{
                name: '',
                artist: '',
                id: ''
            }],
            previewBool: false,
            selectedPreview: '',
            selectedPlaylistID: '',
            tracksToAdd: []
        }
        this.playPreview = this.playPreview.bind(this);
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    componentDidMount() {
        this.state.playlists.splice(0, 1);
        this.setState({
            randomTracks: this.props.randomTracks,
            userID: this.props.userID,
            selectedPlaylistID: this.props.selectedPlaylistID
        }, () => {
            this.getRecommendations();
        });
    }
    getRecommendations() {
        spotifyApi.getRecommendations({ seed_tracks: this.state.randomTracks })
            .then((data) => {
                data.tracks.forEach((track) => {
                    this.setState({
                        playlists: this.state.playlists.concat({
                            name: track.name,
                            artist: track.artists[0].name,
                            preview: track.preview_url,
                            id: track.id
                        })
                    });
                });
            })
            .then(() => {
                this.createTable();
            })
    }
    playPreview(url) {
        if (url === null) {
            alert("Preview is not available for this song.");
        }
        return <ReactPlayer url={url}
                            playing
                            height={0}
                            width={0} />
    }
    triggerPreview(key) {
        this.setState({
            previewBool: true,
            selectedPreview: this.state.playlists[key].preview
        })
    }
    addToPlaylist() {
        spotifyApi.addTracksToPlaylist()
    }
    createTable() {
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'Artist',
            dataIndex: 'artist',
            key: 'artist',
        }, {
            title: 'Play Preview',
            key: 'preview',
            render: (data, record) => (
                <div>
                    <Button icon="play-circle-o" onClick={() => this.triggerPreview(record.key)} />
                </div>
            )
        }];
        const data = [];
        for (let i = 0; i < this.state.playlists.length; i++) {
            data.push({
                key: i,
                name: this.state.playlists[i].name,
                artist: this.state.playlists[i].artist,
                id: this.state.playlists[i].id
            })
        }
        const rowSelection = {
            onSelect: (record, selected, selectedRows) => {
                console.log("Records that are clicked: " + JSON.stringify(record));
            },
            // onChange: (selectedRowKeys, selectedRows) => {
            //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            // },
            // onSelectAll: (selected, selectedRows, changeRows) => {
            //     console.log(selected, selectedRows, changeRows);
            // },
        };
        return (
            <Table rowSelection={rowSelection} loading pagination={{ pageSize: 6 }} className='table' dataSource={data} columns={columns} />
        )
    }
    deleteList() {
        this.setState({
            randomTracks: [],
            playlists: []
        })
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
        this.props.handler();
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
        this.props.handler();
    }
    render() {
        return (
            <div>
                <Modal
                    title="Recommended Tracks"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={800}
                    bodyStyle={{ height: 'auto' }}
                >
                    {this.createTable()}
                    {this.state.previewBool ? this.playPreview(this.state.selectedPreview) : null}
                </Modal>
            </div>
        );
    }
}
