import React, { Component }from 'react';
import { Row,Col,Form,Icon,Input,Button,Radio,Select,message } from 'antd';
import {NavLink} from 'react-router-dom'
import './style/common.less'
import './style/sign.less'
const Option=Select.Option;
class SignIn extends Component{
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                /*Object.assign(values,{status:false})*/
                fetch('signUp',{
                    method:'POST',
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                    },
                    credentials:'include',
                    mode:"cors",
                    body:JSON.stringify(Object.assign(values,{status:false}))
                }).then(
                    res=>res.json()
                ).then(data=>{
                    message.info(data.tip);
                }).catch(function (err) {
                    message.error(err);
                });
                this.props.form.resetFields();//清除输入框内容
                window.open('/#/signIn','_self');
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
                    <NavLink to='/signIn'>登录</NavLink>
                </Col>
                <Col className="signForm">
                    <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item label="用户名">
                            {
                                getFieldDecorator('username',{
                                    initialValue:'',
                                    rules:[
                                        {
                                            required:true,
                                            message:"用户名不能为空"
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入用户名"/>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="密码">
                            {
                                getFieldDecorator('password',{
                                    initialValue:'',
                                    rules:[
                                        {
                                            required:true,
                                            message:"密码不能为空"
                                        }
                                    ]
                                })(
                                    <Input type="password" placeholder="请输入密码"/>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="姓名">
                            {
                                getFieldDecorator('name',{
                                    initialValue:'',
                                    rules:[
                                        {
                                            required:true,
                                            message:"姓名不能为空"
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入姓名"/>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="性别">
                            {
                                getFieldDecorator('sex',{
                                    initialValue:'男',
                                })(
                                    <Radio.Group>
                                        <Radio value="男">男</Radio>
                                        <Radio value="女">女</Radio>
                                    </Radio.Group>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="电话">
                            {
                                getFieldDecorator('tel',{
                                    rules:[
                                        {
                                            required:true,
                                            message:"电话不能为空"
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入联系电话"/>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="角色" {...formItemLayout}>
                            {
                                getFieldDecorator('role',{
                                    initialValue:'普通用户',
                                    rules:[
                                        {
                                            required:true,
                                            message:"请选择角色"
                                        }
                                    ]
                                })(
                                    <Select>
                                        <Option value="采购">采购</Option>
                                        <Option value="销售">销售</Option>
                                        <Option  value="库存">库存</Option>
                                        <Option value="超级管理员">超级管理员</Option>
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item {...buttonLayout}>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                注册
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        );
    }
}
export default Form.create()(SignIn);
