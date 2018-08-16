import React, { Component } from 'react';
import { Modal } from 'antd';
import './Recommendations.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

export default class Recommendations extends Component {
    constructor() {
        super();
        this.state = {
            visible: true
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    componentDidMount() {
        console.log("TracksList: " + this.props.tracksList);

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
    }

    render() {
        return (
            <div>
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </div>
        );
    }
}
