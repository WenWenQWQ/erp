import React, { Component }from 'react';
import { Row,Col,Form,Icon,Input,Button,message } from 'antd';
import {NavLink} from 'react-router-dom'
import './style/common.less'
import './style/sign.less'

class SignIn extends Component{
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                fetch('signIn',{
                    method:'POST',
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                    },
                    credentials:'include',
                    mode:"cors",
                    body:JSON.stringify(values)
                }).then(
                    res=>res.json()
                ).then(data=>{
                    message.info(data.tip);
                    if(data.sign){
                        window.open('/#/admin/homePage','_self');
                    }
                }).catch(function (err) {
                    message.error(err);
                });
                this.props.form.resetFields();//清除输入框内容
            }else{
                console.log(err);
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout={
            labelCol:{
                xs:24,
                sm:5
            },
            wrapperCol:{
                xs:24,
                sm:16
            }
        };
        const buttonLayout={
            wrapperCol:{
               span:5,
                offset:5
            }
        };
        return (
            <Row className="sign_body">
                <Col className="InOrUp">
                    <NavLink to='/signUp'>注册</NavLink>
                </Col>
                <Col className="signForm">
                    <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item label="用户名">
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                            )}
                        </Form.Item>
                        <Form.Item label="密码">
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                            )}
                        </Form.Item>
                        <Form.Item {...buttonLayout}>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        );
    }
}
export default Form.create()(SignIn);
