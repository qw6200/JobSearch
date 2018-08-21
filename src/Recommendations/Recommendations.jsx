import React, { Component } from 'react';
import { Modal, Table, Button } from 'antd';
import './Recommendations.css';
import ReactPlayer from 'react-player';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

export default class Recommendations extends Component {
    constructor() {
        super();
        this.state = {
            visible: true,
            randomTracks: [],
            playlists: [{
                name: '',
                artist: '',
                popularity: 0,
                preview: ''
            }],
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
            randomTracks: this.props.randomTracks
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
                            popularity: track.popularity,
                            preview: track.preview_url
                        })
                    });
                });
            })
            .then(() => {
                this.createTable();
            })
    }
    playPreview() {
        console.log("RUN");
        return (<ReactPlayer url='https://p.scdn.co/mp3-preview/c6ffe28a78636b2f2e1651c5c4a8693b5ff5114b?cid=bbad4233e278492f9a14586b7f89c9b1'
            playing
            width={0}
            height={0} />
        )
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
            title: 'Popularity (1-100 scale)',
            dataIndex: 'popularity',
            key: 'popularity',
        }, {
            title: 'Play Preview',
            key: 'preview',
            render: (data, record) => (
                <div>
                    <Button icon="play-circle-o" onClick={this.playPreview} />
                </div>
            )
        }];
        const data = [];
        for (let i = 0; i < this.state.playlists.length; i++) {
            data.push({
                key: i,
                name: this.state.playlists[i].name,
                artist: this.state.playlists[i].artist,
                popularity: this.state.playlists[i].popularity
            })
        }
        const rowSelection = {
            onSelect: (record, selected, selectedRows) => {

            },
        };
        return (
            <Table rowSelection={rowSelection} pagination={{ pageSize: 6 }} className='table' dataSource={data} columns={columns} />
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
                    {this.playPreview()}
                </Modal>
            </div>
        );
    }
}
