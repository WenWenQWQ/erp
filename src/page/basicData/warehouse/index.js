import React from 'react'
import { Row,Col,Table,Icon,Modal,Input,Form,Select,message,Divider,Button} from 'antd'
import './index.less'
export default class Warehouse extends React.Component{
    componentDidMount(){
        this.request();
    }
    state={
        selectedRowKeys:[],
        data:{},
        visible:false,
        _id:''
    };
    //增加仓库信息
    handleHouseAdd=()=>{
        this.setState({
            visible:true,
            title:'新增仓库信息'
        })
    };
    //编辑仓库信息
    handleHouseEdit=(record)=>{
        this.setState({
            title:'修改仓库信息',
            _id:record.key,
            visible:true,
            data:record,
        })
    };
    deleteHouse=()=>{
        fetch('/basicData/house/delete',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            credentials:'include',
            mode:"cors",
            body:JSON.stringify({_id:this.state._id})
        }).then(
            res=>res.json()
        ).then(data=>{
            this.setState({
                _id:''
            });
            this.request();
            message.info(data.tip);
        }).catch(function (err) {
            message.error(err);
        })
    };
    //删除仓库信息
    handleHouseDelete=(record)=>{
        this.setState({
            _id:record.key
        },function () {
            this.deleteHouse();
        })
    };
    //Modal确认添加仓库
    handleOk=()=>{
        let addHouse=this.refs.getFormValue;
        addHouse.validateFields((err,value)=>{
            if(!err){
                fetch('basicData/house/add',{
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
                addHouse.resetFields();//清除输入框内容
                this.setState({
                    visible:false,
                    _id:'',
                    data:{}
                })
            }
        })
    };
    //获取仓库信息
    request=()=>{
        fetch('/basicData/house/list',{
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
        const {visible }=this.state;
        const columns=[
            {
                title:'操作',
                dataIndex:'operation',
                width:150,
                render:(text,record)=>{
                    return <span>
                        <a onClick={()=>{this.handleHouseEdit(record)}}>编辑</a>
                        <Divider type="vertical"/>
                        <a onClick={()=>{this.handleHouseDelete(record)}}>删除</a>
                    </span>
                }
            },
            {
                title:'仓库名称',
                dataIndex:'name',
                width:150
            },
            {
                title:'仓库地址',
                dataIndex:'address',
                width:150
            },
            {
                title:'负责人',
                dataIndex:'director',
                width:150
            },
            {
                title:'电话',
                dataIndex:'tel',
                width:150
            },
            {
                title:'备注',
                dataIndex:'remark'
            }
        ];
        return (
            <Row className="warehouse">
                <Row className="header" style={{marginBottom:10}}>
                    <Col span={12} className="title">仓库列表</Col>
                    <Col span={12} className="add">
                        <a onClick={this.handleHouseAdd}>
                            <Icon type="plus"/>
                            <span>新增仓库</span>
                        </a>
                    </Col>
                </Row>
                <Modal
                    title={this.state.title}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <WarehouseForm
                        ref="getFormValue"
                        data={this.state.data}/>
                </Modal>
                <Row className="table">
                    <Table
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
class WarehouseForm extends React.Component{
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
                <Form.Item label="仓库名称">
                    {
                        getFieldDecorator("name",{
                            initialValue:this.props.data.name,
                            rules:[{
                                required:true,message:'请输入仓库名称'
                            }]
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="仓库地址">
                    {
                        getFieldDecorator("address",{
                            initialValue:this.props.data.address,
                            rules:[{
                                required:true,message:'请输入仓库地址'
                            }]
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="负责人">
                    {
                        getFieldDecorator("director",{
                            initialValue:this.props.data.director,
                            rules:[{
                                required:true,message:'请输入负责人'
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
                                required:true,message:'请输入电话'
                            }]
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
WarehouseForm=Form.create({})(WarehouseForm);
