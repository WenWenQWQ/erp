import React from 'react'
import { Row,Col,Table,Icon,Modal,Input,Form,Select,message,Divider,Button} from 'antd'
import '../purchase/index.less'
export default class StorageDetail extends React.Component{
    componentDidMount(){
        this.request();
    }
    state={
        selectedRowKeys:[],
        data:{},
        visible:false,
        _id:'',
        dataSource:[]
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
    //获取产品信息
    request=()=>{
        fetch('/reportForm/inventory/deliveryDetail',{
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
            /*console.log(data);*/
            this.setState({
                dataSource:data.map((item)=>{
                    return Object.assign(item,{key:item._id},{...item.productId},{...item.saleDeliveryId});
                })
            })
        })
    };
    render(){
        const {selectedRowKeys }=this.state;
        const columns=[
            {
                title:'出库日期',
                dataIndex:'deliveryDate',
                fixed:'left',
                width:150
            },
            {
                title:'出库类型',
                dataIndex:'IRmark',
                width:150
            },
            {
                title:'出库人员',
                dataIndex:'manager',
                width:150
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
                title:'类别',
                dataIndex:'category',
                width:150
            },
            {
                title:'仓库',
                dataIndex:'warehouse',
                width:150
            },
            {
                title:'数量',
                dataIndex:'number',
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
                    <Col span={12} className="title">其他入库明细表</Col>
                </Row>
                <Row className="operation">
                    <Col span={24} className="select">
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
                        scroll={{ y:600,x:1500 }}
                    />
                </Row>
            </Row>
        )
    }
}