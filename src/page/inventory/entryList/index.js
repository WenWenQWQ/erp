import React from 'react'
import { Row,Col,Table,Icon,Input,Form,Select,message,Divider,Button} from 'antd'
import './index.less'
export default class EntryList extends React.Component{
    componentDidMount(){
        this.request();
    }
    state={
        selectedRowKeys:[],
        data:{},
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
    deleteInfo=()=>{
        fetch('/purchasing/order/delete',{
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
    handleDelete=(record)=>{
        this.setState({
            _id:record.key
        },function () {
            this.deleteInfo();
        })
    };
    //获取产品信息
    request=()=>{
        fetch('/inventory/entry/list',{
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
           /* console.log(data);*/
            this.setState({
                dataSource:data.map((item,index)=>{
                    return Object.assign(item,{key:item._id});
                })
            })
        })
    };
    render(){
        const {selectedRowKeys }=this.state;
        const columns=[
            {
                title:'操作',
                dataIndex:'operation',
                width:150,
                fixed:'left',
                render:(text,record)=>{
                    return <span>
                        <a onClick={()=>{this.handleCustomerEdit(record)}}>编辑</a>
                        <Divider type="vertical"/>
                        <a onClick={()=>{this.handleDelete(record)}}>删除</a>
                    </span>
                }
            },
            {
                title:'入库日期',
                dataIndex:'storageDate',
                width:150
            },
            {
                title:'入库人员',
                dataIndex:'storager',
                width:150
            },
            {
                title:'入库总数',
                dataIndex:'number',
                width:150
            },
            {
                title:'单据创建日期',
                dataIndex:'createDate',
                width:150
            },
            {
                title:'单据创建人工号',
                dataIndex:'founderId',
                width:150
            },
            {
                title:'单据创建人',
                dataIndex:'founder',
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
            <Row className="customer">
                <Row className="header">
                    <Col span={12} className="title">其他入库列表</Col>
                    <Col span={12} className="add">
                        <a onClick={this.handleCustomerAdd}>
                            <Icon type="plus"/>
                            <span>新增其他入库</span>
                        </a>
                    </Col>
                </Row>
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
                        scroll={{ y:600,x:1300 }}
                    />
                </Row>
            </Row>
        )
    }
}
