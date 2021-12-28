import React, { Component } from 'react';
import './style.less';
import router from 'umi/router';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd'
import { login } from "../../../api";

@Form.create() //经 Form.create() 包装过的组件会自带 this.props.form 属性
class Login extends Component {
  state = {
    collapsed: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const body = {
          username: values.username,
          password: values.password,
          rememberMe: values.remember
        };
        const data = await login({ body });
        if (data) {
          const { code, token, msg } = data;
          if (code === 200) {
            localStorage.setItem('username', values.username);
            localStorage.setItem('token', token);
            router.push('/home');
          } else {
            message.error(msg);
          }
        } else {
          message.error("登陆失败");
        }
      }
    })
  }


  register = () => {
    this.props.switchShowBox('register');
    setTimeout(() => this.props.form.resetFields(), 500)
  }

  render() {
    // console.log(this.props, 1)
    const { getFieldDecorator } = this.props.form

    return (
      <div id='login-page' style={{ minHeight: '100vh' }}>

        <div className="container">
          <div className="container_img">
          </div>
          <div className="container_data">
            <div className="login_title">人工智能管理系统</div>
            <div className="container_data_bottom">
              <h3 className='data_title'>登录</h3>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入用户名!' }],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="用户名"
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码!' }],
                  })(
                    <Input
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="密码"
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(<Checkbox style={{ color: '#1890ff' }}>记住密码</Checkbox>)}
                  {/* <a className="login-form-forgot" href="">
                  Forgot password
          </a> */}
                  <div>
                    <Button style={{ width: "100%" }} type="primary" htmlType="submit" className="login-form-button">
                      登录
                </Button>
                  </div>
                </Form.Item>
              </Form>
              <div className='footer'>
                <div>欢迎人工智能管理系统</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Login


