import React, { Component } from 'react';
import { } from 'antd';
import './TopNavigation.css';

export default class TopNavigation extends Component {
    render() {
        return (
            <div className="nav">
                <div className="nav-header">
                    <div className="nav-title">
                        TuneBoon
                    </div>
                </div>
                <div className="nav-btn">
                </div>
                <div className="nav-links">
                    <a href="//github.io/jo_geek" target="_blank">GitHub</a>
                    <a href="http://stackoverflow.com/users/4084003/" target="_blank">Contact</a>
                </div>
            </div>
        );
    }
}
