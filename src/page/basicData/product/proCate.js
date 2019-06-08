import React from 'react'
import { Row,Col,Table,Icon,Modal,Input,Form,Select,message,Divider,Button} from 'antd'
import './index.less'
export default class proCate extends React.Component{
    state={
        visible:false,
        confirmLoading:false,
        value:'',
        _id:'',
        selectedRowKeys:[]
    };
    componentDidMount(){
        this.request();
    }
    showModal=()=>{
        this.setState({
            visible:true,
            title:'新增产品分类',
            label:'新增分类',
        });
    };
    //添加/修改产品分类
    handleOk=()=>{
        let addCate=this.refs.getFormValue;
        addCate.validateFields((err,value)=>{
            if(!err){
                fetch('/basicData/product/addCate',{
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
                    this.request();
                    message.info(data.tip);
                }).catch(function (result) {
                    message.error(result.tip);
                })
            }
        });
        addCate.resetFields();//清除输入框内容
        this.setState({
            visible:false,
            value:'',
            _id:'',
            confirmLoading:false
        })
    };
    //获取产品分类信息
    request=()=>{
        fetch('/basicData/product/category',{
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
                    return { category: item.name,key:item._id };
                })
            })
        })
    };
    handleCancel=()=>{
        this.setState({
            visible:false,
            value:'',
            _id:''
        })
    };
    handleEdit=(record)=>{
        this.setState({
            title:'修改产品分类',
            label:'类别',
            value:record.category,
            visible:true,
            _id:record.key
        })
    };
    deleteCate=()=>{
        fetch('/basicData/product/deleteCate',{
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
    handleDelete=(record)=>{
        this.setState({
            _id:record.key
        },function () {
            this.deleteCate();
        });
    };
    render(){
        const {visible,confirmLoading,selectedRowKeys }=this.state;
        const columns=[
            {
                title:'操作',
                dataIndex:'handle',
                render:(text,record)=>
                    <span>
                        <a onClick={()=>{this.handleEdit(record)}}><Icon type="edit"/></a>
                        <Divider type="vertical"/>
                        <a onClick={()=>{this.handleDelete(record)}}><Icon type="delete"/></a>
                    </span>
            },
            {
                title:'类别',
                dataIndex:'category'
            }
        ];
        return (
            <Col span={6} className="pro-left">
                <Row className="left-header">
                    <Col span={12} className="title">产品分类</Col>
                    <Col span={12} className="add-category">
                        <a onClick={this.showModal}>
                            <Icon type="plus"/>
                            <span>新增分类</span>
                        </a>
                    </Col>
                </Row>
                <Modal
                    title={this.state.title}
                    visible={visible}
                    confirmLoading={confirmLoading}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <FilterForm
                        ref="getFormValue"
                        label={this.state.label}
                        value={this.state.value}/>
                </Modal>
                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={this.state.dataSource}
                ></Table>
            </Col>
        )
    }
}
class FilterForm extends React.Component{
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
            <Form {...formItemLayout} autoComplete="off">
                <Form.Item label={this.props.label}>
                    {
                        getFieldDecorator("category",{
                            initialValue:this.props.value,
                            rules:[{
                                required:true,message:'请输入类名'
                            }]
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
            </Form>
        );
    }
}
FilterForm=Form.create({})(FilterForm)