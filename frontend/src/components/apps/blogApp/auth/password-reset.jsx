import React, { useState } from 'react';
import { Form, Input, Button, message, Row, Col, Layout } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import AppHeader from '../header/header';
import AppFooter from '../footer/footer';

const PasswordResetPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { token } = useParams(); // Extract token from URL path

  const onFinish = async (values) => {
    setLoading(true);
    const { email, newPassword } = values;

    try {
      const response = await fetch(`http://localhost:8000/account/update-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, email, new_password: newPassword  }), // Include token in the request body
      });

      if (response.ok) {
        message.success('Password reset successful');
        form.resetFields();
      } else {
        message.error('Failed to reset password. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred while resetting the password.');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
    <AppHeader/>
    <Layout>
      <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
        <Col xs={22} sm={12} md={9} lg={7} xl={6}>
          <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '3px 6px 5px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Password Reset</h2>
            <Form
              form={form}
              name="password_reset"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email address!' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: 'Please input your new password!' },
                  { min: 6, message: 'Password must be at least 6 characters long!' },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
              </Form.Item>

              <Form.Item
                name="confirmNewPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </Layout>

    <AppFooter/>
    </>
  );
};

export default PasswordResetPage;
