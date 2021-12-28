import React, { Component } from 'react';
import { User, Nav } from "../../../component";
import { Layout } from 'antd';
import './style.less';
const { Content, Footer, Sider } = Layout;

export default class extends Component {
  state = {
    collapsed: false
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
  render() {
    return (
      <Layout style={{ height: '100%' }}>
        <Sider collapsible
          trigger={null}
          collapsed={this.state.collapsed}>
          <Nav collapsed={this.state.collapsed} />
        </Sider>
        <Layout>
          <User collapsed={this.state.collapsed} onToggle={this.toggle} />
          <Content className="content-container">
            {this.props.children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>人工智能平台</Footer>
        </Layout>
      </Layout>
    );
  }
}



