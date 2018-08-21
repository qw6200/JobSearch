import React, { Component } from 'react';
import { Modal, Table } from 'antd';
import './Recommendations.css';
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
                artist: ''
            }],
        }
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
                            artist: track.artists[0].name
                        })
                    });
                });
            })
            .then(() => {
                this.createTable();
            })
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
        }];
        const data = [];
        for (let i = 0; i < this.state.playlists.length; i++) {
            data.push({
                key: i,
                name: this.state.playlists[i].name,
                artist: this.state.playlists[i].artist
            })
        }
        const rowSelection = {
            onSelect: (record, selected, selectedRows) => {

            },
        };
        return (
            <Table rowSelection={rowSelection} className='table' dataSource={data} columns={columns} />
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
                >
                    {this.createTable()}
                </Modal>
            </div>
        );
    }
}
