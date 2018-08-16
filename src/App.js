import React, { Component } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import TopNavigation from './TopNavigation/TopNavigation';
import Playlists from './Playlists/Playlists';

const spotifyApi = new SpotifyWebApi();

class App extends Component {
	constructor() {
		super();
		const params = this.getHashParams();
		const token = params.access_token;
		if (token) {
			spotifyApi.setAccessToken(token);
		}
		this.state = {
			userID: 0,
			loggedIn: token ? true : false
		}
	}
	getHashParams() {
		var hashParams = {};
		var e, r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.hash.substring(1);
		e = r.exec(q)
		while (e) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
			e = r.exec(q);
		}
		return hashParams;
	}
	componentDidMount() {
		this.getUser();
	}
	renderPlaylist() {
		if (this.state.userID !== 0 && this.state.loggedIn) {
			return (
				<Playlists userID={this.state.userID} />
			);
		}
	}
	getUser() {
		spotifyApi.getMe()
			.then((data) => {
				this.setState({
					userID: data.id
				})
			})
	}
	render() {
		return (
			<div className="root">
				<TopNavigation />
				<div className="intro">
					{
						!this.state.loggedIn &&
						<a href='http://localhost:8888/login'> Login to Spotify </a>
					}
					{this.renderPlaylist()}
				</div>
			</div>
		);
	}
}

export default App;
