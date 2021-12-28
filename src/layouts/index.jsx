import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import React from 'react';
import { Logged, Login } from './layout';
import './style.less';

class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: ''
    };
  }

  getToken = () => {
    return window.localStorage.getItem('token')

  }

  render() {
    const Container = (this.getToken() && window.location.pathname.indexOf('/login') === -1) ? Logged : Login;
    return (
      <Container>
        {this.props.children}
      </Container>
    );
  }
}

export default withRouter(connect()(BasicLayout));

