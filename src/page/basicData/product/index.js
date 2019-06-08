import React from 'react'
import { Row,Col,Table,Icon,Modal,Input,Form,Select,message,Divider,Button} from 'antd'
import './index.less'
import ProCate from './proCate'
export default class Product extends React.Component{
    componentDidMount(){
        this.request();
        this.cateList();
    }
    state={
        selectedRowKeys:[],
        data:{
            name:'',
            specification:'',
            unit:'',
            category:'',
            remark:''
        },
        categories:[],
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
            <Select defaultValue="产品名称">
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
    //增加产品信息
    handleProadd=()=>{
        this.cateList();
        this.setState({
            visible:true,
            title:'新增产品'
        })
    };
    //编辑产品信息
    handleProEdit=(record)=>{
        this.setState({
            title:'修改产品信息',
            _id:record.key,
            visible:true,
            data:record,
        })
    };
    deleteProduct=()=>{
        fetch('/basicData/product/deleteProduct',{
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
    //删除产品信息
    handleProDelete=(record)=>{
        this.setState({
            _id:record.key
        },function () {
            this.deleteProduct();
        })
    };
    //Modal确认添加产品
    handleOk=()=>{
        let addProdut=this.refs.getFormValue;
        addProdut.validateFields((err,value)=>{
            if(!err){
                fetch('basicData/product/addProduct',{
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
                addProdut.resetFields();//清除输入框内容
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
        fetch('/basicData/product/list',{
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
    //获取产品分类
    cateList=()=>{
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
                categories:data.map((item,index)=>{
                    return { name: item.name,key:item._id };
                })
            })
        })
    };
    render(){
        const {selectedRowKeys,visible }=this.state;

        const proColumns=[
            {
                title:'操作',
                dataIndex:'operation',
                width:150,
                render:(text,record)=>{
                    return <span>
                        <a onClick={()=>{this.handleProEdit(record)}}>编辑</a>
                        <Divider type="vertical"/>
                        <a onClick={()=>{this.handleProDelete(record)}}>删除</a>
                    </span>
                }
            },
            {
                title:'产品名称',
                dataIndex:'name',
                width:150
            },
            {
                title:'规格',
                dataIndex:'specification',
                width:150
            },
            {
                title:'单位',
                dataIndex:'unit',
                width:150
            },
            {
                title:'类别',
                dataIndex:'category',
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
            <Row className="product">
                <ProCate/>
                <Col span={18} className="pro-right">
                    <Row className="right-header">
                        <Col span={12} className="title">产品列表</Col>
                        <Col span={12} className="add-product">
                            <a onClick={this.handleProadd}>
                                <Icon type="plus"/>
                                <span>新增产品</span>
                            </a>
                        </Col>
                    </Row>
                    <Modal
                        title={this.state.title}
                        visible={visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <ProductForm
                            ref="getFormValue"
                            data={this.state.data}
                            categories={this.state.categories}/>
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
                                {this.renderSelect(proColumns)}
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
                            columns={proColumns}
                            dataSource={this.state.dataSource}
                            pagination={false}
                            scroll={{ y:300 }}
                        />
                    </Row>
                </Col>
            </Row>
        )
    }
}
class ProductForm extends React.Component{
    renderCate=(data)=>{
        return(
            <Select>
                {
                    data.map((item,index)=>{
                        return(
                            <Select.Option value={item.name} key={item.key}>{item.name}</Select.Option>
                        )
                    })
                }
            </Select>
        )
    };
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
                <Form.Item label="产品名称">
                    {
                        getFieldDecorator("name",{
                            initialValue:this.props.data.name,
                            rules:[{
                                required:true,message:'请输入产品名称'
                            }]
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="规格">
                    {
                        getFieldDecorator("specification",{
                            initialValue:this.props.data.specification
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="单位">
                    {
                        getFieldDecorator("unit",{
                            initialValue:this.props.data.unit,
                            rules:[{
                                required:true,message:'请输入产品单位'
                            }]
                        })(
                            <Input/>
                        )
                    }
                </Form.Item>
                <Form.Item label="类别">
                    {
                        getFieldDecorator("category",{
                            initialValue:this.props.data.category,
                            rules:[{
                                required:true,message:'请选择产品类别'
                            }]
                        })(
                            this.renderCate(this.props.categories)
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
ProductForm=Form.create({})(ProductForm);
