import React, { useEffect, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Layout, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import AppHeader from '../header/header';
import AppFooter from '../footer/footer';

const Login = () => {
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState(false);
  const [formLayout, setFormLayout] = useState('horizontal');
  const navigate = useNavigate();  // Initialize the useNavigate hook

  useEffect(() => {
    setClientReady(true);
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/account/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const { access, refresh } = data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      message.success('Login successful!');
      
      // Navigate to the home path ("/") after successful login
      navigate('/feed');
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Login failed. Please check your credentials and try again.');
    }
  };

  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };

  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: {
            span: 24,
          },
          wrapperCol: {
            span: 24,
          },
        }
      : null;

  const buttonItemLayout =
    formLayout === 'horizontal'
      ? {
          wrapperCol: {
            span: 24,
            offset: 4,
          },
        }
      : null;

  return (
    <>
      <AppHeader />

      <Layout style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90vh' }}>
        <Form
          {...formItemLayout}
          layout={formLayout}
          form={form}
          initialValues={{
            layout: formLayout,
          }}
          style={{
            maxWidth: formLayout === 'inline' ? 'none' : 800,
          }}
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <h1>Login</h1>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your Username!' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email" type='email'/>
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="/forgot-password">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
              Log in
            </Button>
            <br />
            Or <a href="/signup">register now!</a>
          </Form.Item>
        </Form>

        <AppFooter />
      </Layout>
    </>
  );
};

export default Login;
