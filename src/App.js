import React, { Component } from 'react';
import { Card, Button } from 'antd';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import HttpsRedirect from 'react-https-redirect';
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
				<HttpsRedirect>
					<TopNavigation />
					<div className="intro">
						{
							!this.state.loggedIn &&
							<div>
								<div>
									<div className="card">
										<Card title="Welcome to TuneBoon!" bordered={true} style={{ width: '100%', height: 'auto', maxWidth: '600px' }}>
											<p>TuneBoon is a web application that allows Spotify users to explore and add songs that are closely
												related to their playlists' songs.
												</p>
											<p>To start discovering new songs, you must first login to Spotify.</p>
											<Button type="primary" className="loginButton">
												<a href='https://melody-server.herokuapp.com/login'>Login to Spotify</a>
											</Button>
										</Card>
									</div>
								</div>
							</div>
						}
						{this.renderPlaylist()}
					</div>
				</HttpsRedirect>
			</div>
		);
	}
}

export default App;
