import React from 'react'
import { Row,Col,Table,Icon,Modal,Input,Form,Select,message,Divider,Button} from 'antd'
import './index.less'
export default class Supplier extends React.Component{
    componentDidMount(){
        this.request();
    }
    state={
        selectedRowKeys:[],
        data:{},
        visible:false,
        _id:''
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
    handleSupplierAdd=()=>{
        this.setState({
            visible:true,
            title:'新增供应商信息'
        })
    };
    //编辑客户信息
    handleCustomerEdit=(record)=>{
        this.setState({
            title:'修改供应商信息',
            _id:record.key,
            visible:true,
            data:record,
        })
    };
    deleteCustomer=()=>{
        fetch('/basicData/supplier/delete',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            credentials:'include',
            mode:"cors",
            body:JSON.stringify({_id:this.state._id,ids:this.state.selectedRowKeys})
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
    //删除客户信息
    handleCustomerDelete=(record)=>{
        this.setState({
            _id:record.key
        },function () {
            this.deleteCustomer();
        })
    };
    //Modal确认添加产品
    handleOk=()=>{
        let addUpdate=this.refs.getFormValue;
        addUpdate.validateFields((err,value)=>{
            if(!err){
                fetch('basicData/supplier/add',{
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
                addUpdate.resetFields();//清除输入框内容
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
        fetch('/basicData/supplier/list',{
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
                    return <span>
                        <a onClick={()=>{this.handleCustomerEdit(record)}}>编辑</a>
                        <Divider type="vertical"/>
                        <a onClick={()=>{this.handleCustomerDelete(record)}}>删除</a>
                    </span>
                }
            },
            {
                title:'供应商名称',
                dataIndex:'name',
                width:150
            },
            {
                title:'联系人',
                dataIndex:'contact',
                width:150
            },
            {
                title:'电话',
                dataIndex:'tel',
                width:150
            },
            {
                title:'地址',
                dataIndex:'address',
                width:150
            },
            {
                title:'邮箱',
                dataIndex:'email',
                width:150
            },
            {
                title:'备注',
                dataIndex:'remark'
            }
        ];
        const rowSelection={
            selectedRowKeys,
            onChange:this.onSelectChange
        };
        return (
            <Row className="supplier">
                <Row className="header">
                    <Col span={12} className="title">供应商列表</Col>
                    <Col span={12} className="add">
                        <a onClick={this.handleSupplierAdd}>
                            <Icon type="plus"/>
                            <span>新增供应商</span>
                        </a>
                    </Col>
                </Row>
                <Modal
                    title={this.state.title}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <SupplierForm
                        ref="getFormValue"
                        data={this.state.data}/>
                </Modal>
                <Row className="operation">
                    <Col span={4} className="batch-delete">
                        <Button
                            type="primary"
                            onClick={this.deleteSupplier}
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
class SupplierForm extends React.Component{
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
                <Form.Item label="供应商名称">
                    {
                        getFieldDecorator("name",{
                            initialValue:this.props.data.name,
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="联系人">
                    {
                        getFieldDecorator("contact",{
                            initialValue:this.props.data.contact,
                            rules:[{
                                required:true,message:'请输入客户等级'
                            }]
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="电话">
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
                <Form.Item label="地址">
                    {
                        getFieldDecorator("address",{
                            initialValue:this.props.data.address
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
SupplierForm=Form.create({})(SupplierForm);
