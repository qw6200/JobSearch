import React, { Component } from 'react';
import { Modal, Table, Button, message } from 'antd';
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
            tracksToAdd: [],
            selectedRows: null,
            selectedTracksList: [],
            currentKey: -1
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
            message.warning('Preview is not available for this song');
        }
        return <ReactPlayer url={url}
            playing
            volume={0.1}
            height={0}
            width={0} />
    }
    triggerPreview(key) {
        if (this.state.currentKey !== key) {
            this.setState({
                currentKey: key
            }, () => {
                this.setState({
                    previewBool: true,
                    selectedPreview: this.state.playlists[key].preview
                })
            })
        } else if (this.state.currentKey === key) {
            this.setState({
                previewBool: false,
            })
        }

    }
    addToPlaylist(idArray) {
        spotifyApi.addTracksToPlaylist(this.state.userID, this.state.selectedPlaylistID, idArray)
            .then((data) => {
                message.success("Successfully added to your playlist!")
                this.props.alertHandler();
            })
    }
    createIDArray() {
        var idArray = [];
        if (this.state.selectedRows !== null) {
            for (var i = 0; i < this.state.selectedRows.length; i++) {
                idArray[i] = 'spotify:track:' + this.state.selectedRows[i].id
            }
            this.addToPlaylist(idArray);
        }

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
            // onSelect: (record, selected, selectedRows) => {
            //     console.log("Records that are clicked: " + JSON.stringify(record));
            // },
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows: selectedRows
                })
            },
            // onSelectAll: (selected, selectedRows, changeRows) => {
            //     console.log(selected, selectedRows, changeRows);
            // },
        };
        return (
            <Table rowSelection={rowSelection} pagination={{ pageSize: 7 }} locale={{ emptyText: 'Loading Tracks...'}} className='recom-table' dataSource={data} columns={columns} />
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
        this.createIDArray();
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
                    okText='Add'
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
