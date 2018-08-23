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
                    <a href="https://github.com/qw6200/TuneBoon">GitHub</a>
                    <a href="https://leejacob.me">Contact</a>
                    <a href="https://leejacob.me">Portfolio</a>
                </div>
            </div>
        );
    }
}
