import React, { Component } from 'react';
import { } from 'antd';
import './TopNavigation.css';

export default class TopNavigation extends Component {
    render() {
        return (
            <div class="nav">
                <div class="nav-header">
                    <div class="nav-title">
                        TuneBoon
                </div>
                </div>
                <div class="nav-btn">
                    <label for="nav-check">
                        <span></span>
                        <span></span>
                        <span></span>
                    </label>
                </div>
                <input type="checkbox" id="nav-check" />
                <div class="nav-links">
                    <a href="https://github.com/qw6200/TuneBoon">GitHub</a>
                    <a href="https://leejacob.me">Contact</a>
                    <a href="https://leejacob.me">Portfolio</a>
                </div>
            </div>
        );
    }
}
