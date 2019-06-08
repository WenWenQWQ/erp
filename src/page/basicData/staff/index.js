import React from 'react'
import { Row,Col,Table,Icon,Modal,Input,Form,Select,message,Divider,Button} from 'antd'
import './index.less'
export default class Customer extends React.Component{
    componentDidMount(){
        this.request();
    }
    state={
        selectedRowKeys:[],
        data:{},
        visible:false,
        _id:'',
        userInfo:'',
    };
    onSelectChange=(selectedRowKeys)=>{
        this.setState({
            selectedRowKeys
        })
    };
    //搜索框下拉菜单渲染
    renderSelect=(data)=>{
        return(
            <Select defaultValue="客户名称">
                {
                    data.map((item)=>{
                        return <Select.Option
                            value={item.dataIndex}
                            style={{width:80}}
                            key={item.dataIndex}
                        >
                            {item.title}
                        </Select.Option>
                    })
                }
            </Select>
        )
    };
    //增加客户信息
    handleCustomerAdd=()=>{
        this.setState({
            visible:true,
            title:'新增客户信息'
        })
    };
    //编辑客户信息
    handleCustomerEdit=(record)=>{
        this.setState({
            title:'修改客户信息',
            _id:record.key,
            visible:true,
            data:record,
        })
    };
    handleForbidden=(record)=>{
        fetch('/basicData/staff/forbidden',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            credentials:'include',
            mode:"cors",
            body:JSON.stringify({_id:record.key})
        }).then(
            res=>res.json()
        ).then(data=>{
            this.setState({
                _id:'',
                selectedRowKeys:[]
            });
            this.request();
            message.info(data.tip);
        }).catch(function (err) {
            message.error(err);
        })
    };
    handleOperation=(record)=>{
        fetch('/basicData/staff/Operation',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            credentials:'include',
            mode:"cors",
            body:JSON.stringify({_id:record.key})
        }).then(
            res=>res.json()
        ).then(data=>{
            this.setState({
                _id:'',
                selectedRowKeys:[]
            });
            this.request();
            message.info(data.tip);
        }).catch(function (err) {
            message.error(err);
        })
    };
    //Modal确认添加产品
    handleOk=()=>{
        let addCustomer=this.refs.getFormValue;
        addCustomer.validateFields((err,value)=>{
            if(!err){
                fetch('basicData/customer/add',{
                    method:'POST',
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json'
                    },
                    credentials:'include',
                    mode:"cors",
                    body:JSON.stringify(Object.assign(value,{_id:this.state._id}))
                }).then(
                    res=>res.json()
                ).then(data=>{
                    message.info(data.tip);
                    this.request();
                }).catch(function (err) {
                    message.error(err);
                });
                addCustomer.resetFields();//清除输入框内容
                this.setState({
                    visible:false,
                    _id:'',
                    data:{}
                })
            }
        })
    };
    //获取产品信息
    request=()=>{
        fetch('/basicData/staff',{
            method:'GET',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            credentials:'include',
            mode:"cors",
        }).then(
            res=>res.json()
        ).then(data=>{
            this.setState({
                dataSource:data.map((item,index)=>{
                    return Object.assign(item,{key:item._id});
                })
            })
        })
    };
    handleCancel=()=>{
        this.setState({
            visible:false,
            _id:'',
            data:{}
        })
    };
    render(){
        const {selectedRowKeys,visible }=this.state;
        const columns=[
            {
                title:'操作',
                dataIndex:'operation',
                width:150,
                render:(text,record)=>{
                    if(record.status||record.status===null){
                        return <span>
                            <a onClick={()=>{this.handleForbidden(record)}}>禁用</a>
                        </span>
                    }else{
                        return <span>
                            <a onClick={()=>{this.handleOperation(record)}}>启用</a>
                        </span>
                    }
                }
            },
            {
                title:'用户名',
                dataIndex:'username',
                width:150
            },
            {
                title:'密码',
                dataIndex:'password',
                width:150
            },
            {
                title:'姓名',
                dataIndex:'name',
                width:150
            },
            {
                title:'性别',
                dataIndex:'sex',
                width:150
            },
            {
                title:'电话',
                dataIndex:'tel',
                width:150
            },
            {
                title:'角色',
                dataIndex:'role',
                width:150
            },
            {
                title:'用户状态',
                dataIndex:'status'
            }
        ];
        const rowSelection={
            selectedRowKeys,
            onChange:this.onSelectChange
        };
        return (
            <Row className="customer">
                <Row className="header">
                    <Col span={12} className="title">客户列表</Col>
                    <Col span={12} className="add">
                        <a onClick={this.handleCustomerAdd}>
                            <Icon type="plus"/>
                            <span>新增客户</span>
                        </a>
                    </Col>
                </Row>
                <Modal
                    title={this.state.title}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <CustomerForm
                        ref="getFormValue"
                        data={this.state.data}/>
                </Modal>
                <Row className="operation">
                    <Col span={4} className="batch-delete">
                        <Button
                            type="primary"
                            onClick={this.deleteProduct}
                        >批量删除</Button>
                    </Col>
                    <Col span={20} className="select">
                        <Input.Group compact>
                            {this.renderSelect(columns)}
                            <Input.Search
                                placeholder="输入关键字"
                                onSearch={value=>console.log(value)}
                                style={{width:200}}
                            />
                        </Input.Group>
                    </Col>
                </Row>
                <Row className="table">
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        pagination={false}
                        scroll={{ y:600 }}
                    />
                </Row>
            </Row>
        )
    }
}
class CustomerForm extends React.Component{
    render(){
        const { getFieldDecorator }=this.props.form;
        const formItemLayout={
            labelCol:{
                xs:24,
                sm:4
            },
            wrapperCol:{
                xs:24,
                sm:12
            }
        };
        return (
            <Form {...formItemLayout} autoComplete="off" layout="horizontal">
                <Form.Item label="客户名称">
                    {
                        getFieldDecorator("name",{
                            initialValue:this.props.data.name,
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="客户等级">
                    {
                        getFieldDecorator("grade",{
                            initialValue:this.props.data.grade,
                            rules:[{
                                required:true,message:'请输入客户等级'
                            }]
                        })(
                            <Select>
                                <Select.Option value="零售" key="零售">零售</Select.Option>
                                <Select.Option value="批发" key="批发">批发</Select.Option>
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item label="联系人">
                    {
                        getFieldDecorator("contact",{
                            initialValue:this.props.data.contact,
                            rules:[{
                                required:true,message:'请输入联系人'
                            }]
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="客户电话">
                    {
                        getFieldDecorator("tel",{
                            initialValue:this.props.data.tel,
                            rules:[{
                                required:true,message:'请输入客户电话'
                            }]
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="邮箱">
                    {
                        getFieldDecorator("email",{
                            initialValue:this.props.data.email
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="地址">
                    {
                        getFieldDecorator("address",{
                            initialValue:this.props.data.address
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="备注">
                    {
                        getFieldDecorator("remark",{
                            initialValue:this.props.data.remark
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
            </Form>
        );
    }
}
CustomerForm=Form.create({})(CustomerForm);
