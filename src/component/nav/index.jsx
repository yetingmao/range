import React, { Component } from 'react';
import Link from 'umi/link';
import withRouter from 'umi/withRouter'
import { Icon, Menu } from 'antd';
import Logo from '../../assets/img/logo.png';
import Logo_min from '../../assets/img/logo-min.png';
import './style.less';

const menus = [
    // {
    //     title: '基础信息管理',
    //     icon: 'apartment',
    //     key: 'base',
    //     auth: [1, 2, 3],
    //     subs: [
    //         { key: '/base/user', title: '用户管理', auth: 1 },
    //         { key: '/base/role', title: '角色管理', auth: 2 },
    //         { key: '/base/department', title: '部门管理', auth: 3 },
    //     ]
    // },
    {
        title: '摄像头管理',
        icon: 'video-camera',
        key: 'camera',
        auth: [4, 5, 13],
        subs: [
            { key: '/camera/info', title: '摄像头信息', auth: 4 },
            { key: '/camera/inspector', title: '摄像头实时显示', auth: 5 },
        ]
    },
    {
        title: '样本采集管理',
        icon: 'file-search',
        key: 'collect',
        auth: [6, 7],
        subs: [
            // { key: '/collect/tag', title: '标签管理' },
            { key: '/collect/video', title: '摄像头标签' },
            { key: '/collect/file', title: '视频抽帧管理' },
            { key: '/collect/job', title: '采集任务管理' },
            { key: '/collect/result', title: '结果数据集' },
            { key: '/collect/clean', title: '图片清洗管理' },
        ]
    },
    {
        title: '样本标注管理',
        icon: 'file-search',
        key: 'mark',
        auth: [6, 7],
        subs: [
            { key: '/mark/task', title: '标注任务管理' },
            { key: '/mark/tag', title: '标注标签字典' },
            { key: '/mark/list', title: '标注列表' },
            { key: '/mark/cist', title: '审核列表' },
        ]
    },
    {
        title: '样本管理',
        icon: 'setting',
        key: 'sample',
        auth: [8, 9, 10, 11],
        subs: [
            { key: '/sample/statistics', title: '数据统计' },
            { key: '/sample/flaw', title: '缺陷标签', auth: 9 },
            { key: '/sample/equipment', title: '设备管理', auth: 8 },
            { key: '/sample/catalog', title: '样本目录' },
            // { key: '/sample/check', title: '关联设备缺陷', auth: 10 },
        ]
    },
    {
        title: '模型应用',
        icon: 'database',
        key: 'model',
        auth: [8, 9, 10, 11],
        subs: [
            { key: '/model/upload', title: '模型管理' },
            { key: '/model/config', title: '服务配置' },
            { key: '/model/experience', title: '模型体验', auth: 8 },
            { key: '/model/warn', title: '告警管理', auth: 9 },
        ]
    },
    {
        title: '数据服务',
        icon: 'form',
        key: 'data',
        auth: [8, 9, 10, 11],
        subs: [
            { key: '/data/set', title: '数据集管理' },
            { key: '/data/group', title: '标签组管理' },
            { key: '/data/lable', title: '标签管理', auth: 8 },
            { key: '/data/relation', title: '标签关系管理', auth: 9 },
            // { key: '/data/relmark', title: '定时任务' },
        ]
    },
    // {
    //     title: '系统监控',
    //     icon: 'eye',
    //     key: 'watch',/data/relmark
    //     auth: [8, 9, 10, 11],
    //     subs: [
    //         { key: '/data/inspector', title: '定时任务' },
    //         { key: '/data/expert', title: '定时任务' },
    //         { key: '/data/mark', title: '服务监控', auth: 8 },
    //         { key: '/data/list', title: '数据监控', auth: 9 },
    //     ]
    // },
    // {
    //     title: '日志管理',
    //     icon: 'profile',
    //     key: 'log',
    //     auth: [8, 9, 10, 11],
    //     subs: [
    //         { key: '/data/inspector', title: '更新日志' },
    //         { key: '/data/expert', title: '登录日志' },
    //         { key: '/data/mark', title: '操作日志', auth: 8 },
    //     ]
    // },
    // {
    //     title: '采集管理',
    //     icon: 'tool',
    //     key: 'pick',
    //     auth: [8, 9, 10, 11],
    //     subs: [

    //     ]
    // },
    // {
    //     title: '训练管理',
    //     icon: 'api',
    //     key: 'train',
    //     auth: [8, 9, 10, 11],
    //     subs: [
    //         { key: '/data/inspector', title: '项目创建' },
    //         { key: '/data/expert', title: '可视化建模' },
    //     ]
    // },
]

@withRouter
class SiderNav extends Component {
    state = {
        openKeys: [],
        selectedKeys: []
    };

    componentDidMount() {
        // 防止页面刷新侧边栏又初始化了
        const pathname = this.props.location.pathname
        //获取当前所在的目录层级
        const rank = pathname.split('/')
        switch (rank.length) {
            case 2:  //一级目录
                this.setState({
                    selectedKeys: [pathname]
                })
                break;
            case 4: //三级目录，要展开两个subMenu
                this.setState({
                    selectedKeys: [pathname],
                    openKeys: [rank.slice(0, 2).join('/'), rank.slice(0, 3).join('/')]
                })
                break;
            default:
                this.setState({
                    selectedKeys: [pathname],
                    openKeys: [pathname.substr(0, pathname.lastIndexOf('/'))]
                })
        }
    }

    componentWillReceiveProps(nextProps) {
        //当点击面包屑导航时，侧边栏要同步响应
        const pathname = nextProps.location.pathname
        if (this.props.location.pathname !== pathname) {
            this.setState({
                selectedKeys: [pathname],
            })
        }
    }

    onOpenChange = (openKeys) => {
        //此函数的作用只展开当前父级菜单（父级菜单下可能还有子菜单）
        if (openKeys.length === 0 || openKeys.length === 1) {
            this.setState({
                openKeys
            })
            return
        }

        //最新展开的菜单
        const latestOpenKey = openKeys[openKeys.length - 1]
        //判断最新展开的菜单是不是父级菜单，若是父级菜单就只展开一个，不是父级菜单就展开父级菜单和当前子菜单
        //因为我的子菜单的key包含了父级菜单，所以不用像官网的例子单独定义父级菜单数组，然后比较当前菜单在不在父级菜单数组里面。
        //只适用于3级菜单
        if (latestOpenKey.includes(openKeys[0])) {
            this.setState({
                openKeys
            })
        } else {
            this.setState({
                openKeys: [latestOpenKey]
            })
        }
    }

    renderMenuItem = ({ key, icon, title, auth }) => {
        // let auths = window.localStorage.getItem('auth') || [];
        // if (typeof auths === 'string') {
        //     auths = auths.split(",");
        // }
        // return auths.includes(`${auth}`) ? (
        //     <Menu.Item key={key}>
        //         <Link to={key}>
        //             {icon && <Icon type={icon} />}
        //             <span>{title}</span>
        //         </Link>
        //     </Menu.Item>
        // ) : ""
        return (
            <Menu.Item key={key}>
                <Link to={key}>
                    {icon && <Icon type={icon} />}
                    <span>{title}</span>
                </Link>
            </Menu.Item>
        )
    }
    renderSubMenu = ({ key, icon, title, subs, auth }) => {
        // let auths = window.localStorage.getItem('auth') || [];
        // if (typeof auths === 'string') {
        //     auths = auths.split(",");
        // }
        // let look = false;
        // for (const a of auth) {
        //     if (auths.includes(`${a}`)) {
        //         look = true;
        //         break;
        //     }
        // }
        // return look ? (
        //     < Menu.SubMenu key={key} title={< span > {icon && <Icon type={icon} />
        //     } <span> {title}</span ></span >}>
        //         {
        //             subs && subs.map(item => {
        //                 return item.subs && item.subs.length > 0 ? this.renderSubMenu(item) : this.renderMenuItem(item)
        //             })
        //         }
        //     </Menu.SubMenu >
        // ) : ""

        return < Menu.SubMenu key={key} title={< span > {icon && <Icon type={icon} />
        } <span> {title}</span ></span >}>
            {
                subs && subs.map(item => {
                    return item.subs && item.subs.length > 0 ? this.renderSubMenu(item) : this.renderMenuItem(item)
                })
            }
        </Menu.SubMenu >

    }

    render() {
        const { openKeys, selectedKeys } = this.state
        return (
            <div className="component_nav" >
                {/* <div className="nav_logo" ><img src={this.props.collapsed ? Logo_min : Logo} alt="LOGO" /></div> */}
                <div className="nav_logo" >
                    <div className="logo_text">
                        {
                            this.props.collapsed ? <div className="text_min">智能平台</div> : "人工智能平台"
                        }
                    </div>
                </div>

                <Menu
                    onOpenChange={this.onOpenChange}
                    onClick={({ key }) => this.setState({ selectedKeys: [key] })}
                    openKeys={openKeys}
                    selectedKeys={selectedKeys}
                    // theme={this.props.theme ? this.props.theme : 'dark'}
                    mode='inline'>
                    {
                        menus && menus.map(item => {
                            return item.subs && item.subs.length > 0 ? this.renderSubMenu(item) : this.renderMenuItem(item)
                        })
                    }
                </Menu>
            </div >
        );
    }
}
export default SiderNav
