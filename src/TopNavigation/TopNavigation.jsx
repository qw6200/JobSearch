import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import './TopNavigation.css';

export default class TopNavigation extends Component {
    state = {
        current: 'mail',
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }

    render() {
        return (
            <div className="topNav">
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <Menu.Item key="melody">
                        <Icon type="customer-service" />Melody
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}
