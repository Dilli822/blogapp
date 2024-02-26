import React from 'react';
import { Layout, Form, Input, Button, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import AppHeader from '../header/header';
import AppFooter from '../footer/footer';


const ForgotPassword = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Finish:', values);
  };

  return (

    <> 

    <Layout style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Form
        form={form}
        name="forgot_password_form"
        className="forgot-password-form"
        onFinish={onFinish}
        style={{ maxWidth: 500 }}
      >
        <Typography.Title level={6} style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Forgot Password
        </Typography.Title>

        <Typography.Paragraph style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <LockOutlined style={{ fontSize: '34px', marginRight: '8px', color: "red" }} />
          Forgetting passwords is not a good practice.
        </Typography.Paragraph>

        <Typography.Paragraph style={{ textAlign: 'center', marginBottom: '1rem' }}>

           Please enter your email to reset your password.
        </Typography.Paragraph>
        <Form.Item
          name="email"
          rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
        >
          <Input prefix={<MailOutlined className="site-form-item-mail" />} placeholder="Email" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="forgot-password-form-button" style={{ minWidth: '100%' }}>
            Reset Password
          </Button>
        </Form.Item>
      </Form>


      <AppFooter/>

    </Layout>


</>

  );
};

export default ForgotPassword;
