import React, { Component } from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import { Icon, Dropdown, Menu, Modal } from 'antd';
import './style.less';
export default class extends Component {
    state = {
        icon: 'arrows-alt',
        count: 100,
        isLogin: window.localStorage.getItem('token') ? true : false,
        avatar: require('@/assets/img/defaultUser.jpg'),
        username: window.localStorage.getItem('username'),
        userInfo: {
            id: "",
            username: "",
            name: "",
            mobile: "",
            role: "",
            department: "",
            password: "",
        }
    }
    toggle = () => {
        this.props.onToggle()
    }
    logout = () => {
        window.localStorage.removeItem('token');
        router.push('/login');
    }
    componentDidMount() {
        if (!this.state.isLogin) {
            router.push('/login');
        }
    }
    render() {
        const { avatar, isLogin, username } = this.state;
        const notLogin = (
            <div>
                <Link to={{ pathname: '/home' }} style={{ color: 'rgba(0, 0, 0)' }}>请登录</Link>&nbsp;
            </div>
        )
        const menu = (
            <Menu className='li_menu'>
                <Menu.ItemGroup title='用户中心' className='menu_group'>
                    <Menu.Item>你好 - {username}</Menu.Item>
                    <Menu.Item><span onClick={() => {
                        router.push('/user')
                    }}>个人中心</span></Menu.Item>
                    <Menu.Item><span onClick={this.logout}>退出登录</span></Menu.Item>
                </Menu.ItemGroup>
            </Menu>
        )
        const login = (
            <div>
                <div style={{ 'position': 'absolute', right: '80px', fontSize: "14px" }}>
                    <span className="user_info">用户名:&nbsp;{username}</span>
                    {/* <span className="user_info">工区:&nbsp;{userInfo.work_area}</span>
                    <span className="user_info">班组:&nbsp;{userInfo.department}</span> */}
                </div>
                <Dropdown overlay={menu}>
                    <img src={avatar} alt="Faild" />
                </Dropdown>
            </div>

        )
        return (
            <div className="component_user" >
                <Icon
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    className='user_trigger'
                    onClick={this.toggle}
                />
                {/* <div style={{ lineHeight: '64px', float: 'right' }}>

                </div> */}
                <div style={{ lineHeight: '64px', float: 'right' }}>
                    <ul className='user_ul'>
                        <li>
                            {isLogin ? login : notLogin}
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}



