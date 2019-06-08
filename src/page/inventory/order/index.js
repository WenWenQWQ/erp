import React from 'react'
import {InputNumber,Row,Col,Table,Button,DatePicker,Input,Form,Icon,Divider,Modal,Select,message} from 'antd'
import moment from 'moment'
import './index.less'
import Ajax from './../../../ajax/index'
import Utils from './../../../utils/index'
const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
export default class BuyStorage extends React.Component{
    constructor(props) {
        super(props);
        Ajax.userInfo().then((data)=>{
            this.setState({
                userInfo:{
                    founderId:data.username,
                    founder:data.name,
                    createDate:Utils.formateDate((new Date().getTime()))
                }
            })
        })
        this.request();
        this.houseList();
        this.columns = [
            {
                title:'操作',
                dataIndex:'operation',
                width:100,
                fixed:'left',
                render:(text,record,index)=>{
                    if(index<this.state.count){
                        return <span>
                        <a onClick={()=>{this.handleAdd(index)}}><Icon type="plus-circle"/></a>
                        <Divider type="vertical"/>
                        <a onClick={()=>{this.handleDelete(record)}}><Icon type="delete"/></a>
                    </span>
                    }else{
                        return <span>总计：</span>
                    }

                }
            },{
                title: '产品名称',
                dataIndex: 'name',
                width:200,
                fixed:'left',
                render:(text,record,index)=> {
                    if (index < this.state.count) {
                        return <span>
                    <a style={{marginRight: '10px'}} onClick={() => this.handleSelect(record, index)}><Icon
                        type="ellipsis"/></a>{text}
                    </span>
                    }
                }
            }, {
                title: '产品规格',
                dataIndex: 'specification',
            }, {
                title: '单位',
                dataIndex: 'unit',
            },{
                title: '类别',
                dataIndex: 'category',
            },{
                title:'系统数量',
                dataIndex:'number',
            },{
                title:'盘点数量',
                dataIndex:'realNumber',
                editable: true,
            },{
                title:'盘盈',
                dataIndex:'overage'
            },{
                title:'盘亏',
                dataIndex:'shortage',
            },{
                title: '备注',
                dataIndex: 'remark',
            }];
        this.state = {
            dataSource: [
                {
                    key: '0',
                    number:0,
                    realNumber:0,
                    overage:0,
                    shortage:0,
                },
                {
                    key:'sum',
                    overage:0,
                    shortage:0
                }
            ],
            count: 1,
            visible:false,
            selectedRowKeys:[],//选中产品编号
            index:0 ,//要添加产品信息行号
            dataHouseSource:[]
        };
    }
    //删除表格
    handleDelete = (record) => {
        const {count}=this.state;
        if(this.state.count>1){
            const dataSource = [...this.state.dataSource];
            const newSource=dataSource.filter(item => item.key !== record.key);
            const sumData={
                key:'sum',
                number:0,
                amount:0,
                amount_rate:0
            };
            for(let i=0;i<newSource.length-1;i++){
                sumData.number=parseFloat(sumData.number)+parseFloat(newSource[i].number);
                sumData.amount=parseFloat(sumData.amount)+parseFloat(newSource[i].amount);
                sumData.amount_rate=parseFloat(sumData.amount_rate)+parseFloat(newSource[i].amount_rate);
            }
            newSource.pop();
            newSource.push(sumData);
            this.setState({
                dataSource:newSource ,
                count:count-1
            });
        }

    };
    //添加表格
    handleAdd = (index) => {
        const {count}=this.state;
        const newResult = [...this.state.dataSource];
        newResult.splice(index+1, 0, {
            key:Math.random(),
            number:0,
            price:0,
            rate:0
        });
        this.setState({
            dataSource: newResult,
            count:count+1
        });
    };
    //编辑保存表格
    handleSave = (row) => {
        if(row.number>=row.realNumber){
            row.shortage=row.number-row.realNumber;
            row.overage=0;
        }
        if(row.number<=row.realNumber){
            row.overage=row.realNumber-row.number;
            row.shortage=0;
        }
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        const sumData={
            key:'sum',
            overage:0,
            shortage:0
        };
        for(let i=0;i<newData.length-1;i++){
            sumData.overage=parseFloat(sumData.overage)+parseFloat(newData[i].overage);
            sumData.shortage=parseFloat(sumData.shortage)+parseFloat(newData[i].shortage);
        }
        newData.pop();
        newData.push(sumData);
        this.setState({ dataSource: newData });
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
    handleSelect=(record,index)=>{
        this.setState({
            visible:true,
            index
        })
    };
    onSelectChange=(selectedRowKeys)=>{
        this.setState({
            selectedRowKeys
        })
    };
    request=(_id)=>{
        if(_id&&_id!==''){
            fetch('/inventory/productStock',{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                credentials:'include',
                mode:"cors",
                body:JSON.stringify({_id:_id})
            }).then(
                res=>res.json()
            ).then(data=>{
                this.setState({
                    dataProductSource:data.map((item,index)=>{
                        return Object.assign(item,{key:item._id},{...item.productId},{...item.orderId});
                    })
                })
            })
        }
    };
    handleOk=()=>{
        const {index,count}=this.state;
        let newData=this.state.dataProductSource.filter(item=>this.state.selectedRowKeys.includes(item.key));
        const newResult = [...this.state.dataSource];
        newData.forEach((item,num)=>{
            item.realNumber=0;
            if(item.number>item.realNumber){
                item.shortage=item.number-item.realNumber;
            }
            item.overage=0;
            if(num===0){
                newResult.splice(index, 1, item);
            }else{
                newResult.splice(index+1, 0, item);
                this.setState({
                    index:index+1
                })
            }
        })
        let len=newData.length;
        const sumData={
            key:'sum',
            overage:0,
            shortage:0
        };
        for(let i=0;i<newResult.length-1;i++){
            sumData.overage=parseFloat(sumData.overage)+parseFloat(newResult[i].overage);
            sumData.shortage=parseFloat(sumData.shortage)+parseFloat(newResult[i].shortage);
        }
        newResult.pop();
        newResult.push(sumData);
        this.setState({
            dataSource: newResult,
            visible:false,
            count:count+len-1
        });
    };
    handleCancel=()=>{
        this.setState({
            visible:false
        })
    };
    //获取仓库信息
    houseList=()=>{
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
                dataHouseSource:data.map((item,index)=>{
                    return Object.assign(item,{key:item._id});
                })
            })
        })
    };
    //获取采购订单信息
    handleSubmit=()=>{
        const proInfos=[...this.state.dataSource];
        proInfos.pop();
        let orderHeader=this.refs.getFilterFormValue;
        orderHeader.validateFields((err,value)=>{
            if(!err) {
                let newData=this.state.dataHouseSource.filter(item=>value.warehouseId.includes(item.key));
                console.log(newData);
                let inventoryDate = moment(value.inventoryDate).format("YYYY-MM-DD");
                const orderHeader = {
                    ...value,
                    inventoryDate,
                    warehouse:newData[0].name
                };
                let orderFooter=this.refs.getDiscountFormValue;
                orderFooter.validateFields((ferr,fvalue)=> {
                    if(!ferr){
                        let total={...this.state.dataSource[this.state.count]};
                        const order=Object.assign(orderHeader,fvalue,total,{...this.state.userInfo},{proNumber:this.state.count});
                        fetch('/inventory/order',{
                            method:'POST',
                            headers:{
                                'Accept':'application/json',
                                'Content-Type':'application/json'
                            },
                            credentials:'include',
                            mode:"cors",
                            body:JSON.stringify(order)
                        }).then(
                            res=>res.json()
                        ).then(data=>{
                            message.info(data.tip);
                            this.setState({
                                detail:{
                                    orderId:data._id,
                                }
                            },()=>{
                                proInfos.forEach((item)=>{
                                    item.productId=item.productId._id;
                                    let proInfo={
                                        ...this.state.detail,
                                        ...item
                                    };
                                    fetch('/inventoryDetail',{
                                        method:'POST',
                                        headers:{
                                            'Accept':'application/json',
                                            'Content-Type':'application/json'
                                        },
                                        credentials:'include',
                                        mode:"cors",
                                        body:JSON.stringify(Object.assign(proInfo))
                                    });
                                })
                            })
                        }).catch(function (err) {
                            message.error(err);
                        });
                    }
                });
                orderFooter.resetFields();//清除输入框内容
            }
        });
        this.setState({
            dataSource: [
                {
                    key: '0',
                    number:0,
                    realNumber:0,
                    overage:0,
                    shortage:0,
                },
                {
                    key:'sum',
                    overage:0,
                    shortage:0
                }
            ],
            count: 1,
        });
        orderHeader.resetFields();//清除输入框内容
    };
    render(){
        const { dataSource,selectedRowKeys,visible } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const rowSelection={
            selectedRowKeys,
            onChange:this.onSelectChange
        };
        const proColumns=[
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
                title:'系统数量',
                dataIndex:'number'
            },
            {
                title:'备注',
                dataIndex:'remark'
            }
        ];
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return(
            <Row className="order">
                <Row className="header">
                    <Col span={12} className="title">盘点</Col>
                    <Col span={12} className="submit">
                        <Button>保存草稿</Button>
                        <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                    </Col>
                </Row>
                <Row className="body">
                    <Col className="body-header">
                        <FilterForm
                            ref="getFilterFormValue"
                            warehouse={this.state.dataHouseSource}
                            getId={this.request}
                        />
                    </Col>
                    <Col className="body-main">
                        <div>
                            <Table
                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered
                                dataSource={dataSource}
                                columns={columns}
                                scroll={{x:1000}}
                                pagination={false}
                            />
                        </div>
                        <Modal
                            title='选择产品'
                            visible={visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            width='1000px'
                        >
                            <Col className='select'>
                                <Input.Group compact>
                                    {this.renderSelect(proColumns)}
                                    <Input.Search
                                        placeholder="输入关键字"
                                        onSearch={value=>console.log(value)}
                                        style={{width:200}}
                                    />
                                </Input.Group>
                            </Col>
                            <Col>
                                <Table
                                    rowSelection={rowSelection}
                                    columns={proColumns}
                                    dataSource={this.state.dataProductSource}
                                    pagination={false}
                                    scroll={{ y:600 }}
                                />
                            </Col>
                        </Modal>
                    </Col>
                    <Col className="body-footer">
                        <DiscountForm
                            ref="getDiscountFormValue"
                        />
                    </Col>
                </Row>
            </Row>
        )
    }
}
//表格可编辑
class EditableCell extends React.Component {
    state = {
        editing: false,
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    }

    save = (e) => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            /*console.log(record,values);*/
            handleSave({ ...record, ...values });
        });
    }

    render() {
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                editing ? (
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `${title} is required.`,
                                            }],
                                            initialValue: record[dataIndex],
                                        })(
                                            <Input
                                                ref={node => (this.input = node)}
                                                onPressEnter={this.save}
                                                onBlur={this.save}
                                                style={{width:100}}
                                            />
                                        )}
                                    </FormItem>
                                ) : (
                                    <div
                                        className="editable-cell-value-wrap"
                                        style={{ paddingRight: 24 }}
                                        onClick={this.toggleEdit}
                                    >
                                        {restProps.children}
                                    </div>
                                )
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}
//头部信息时间
class FilterForm extends React.Component{
    renderData=(data)=>{
        return(
            <Select style={{width:150}} onChange={(value)=>this.props.getId(value)}>
                {
                    data.map((item)=>{
                        return(
                            <Select.Option value={item._id} key={item.key}>{item.name}</Select.Option>
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
                sm:10
            },
            wrapperCol:{
                xs:24,
                sm:14
            }
        };
        return (
            <Row>
                <Col className="date">
                    <Form {...formItemLayout} autoComplete="off" layout="inline">
                        <Form.Item label="盘点日期">
                            {
                                getFieldDecorator("inventoryDate",{
                                    initialValue:moment(new Date().getTime()),
                                    rules:[{
                                        required:true,message:'请选择盘点日期'
                                    }]
                                })(
                                    <DatePicker format="YYYY-MM-DD"/>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="仓库">
                            {
                                getFieldDecorator("warehouseId",{
                                    rules:[{
                                        required:true,message:'请选择仓库'
                                    }]
                                })(
                                    this.renderData(this.props.warehouse)
                                )
                            }
                        </Form.Item>
                        <Form.Item label="盘点人员">
                            {
                                getFieldDecorator("staff",{
                                    rules:[{
                                        required:true,message:'请输入盘点人员'
                                    }]
                                })(
                                    <Input/>
                                )
                            }
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        );
    }
}
FilterForm=Form.create({})(FilterForm);
//尾部信息 优惠
class DiscountForm extends React.Component{
    render(){
        const { getFieldDecorator }=this.props.form;
        const textLayout={
            labelCol:{
                xs:24,
                sm:2
            },
            wrapperCol:{
                xs:24,
                sm:22
            }
        }
        return (
            <Row>
                <Col className="remark">
                    <Form {...textLayout}>
                        <Form.Item>
                            {
                                getFieldDecorator("remark")(
                                    <Input.TextArea placeholder="请填写单据备注"/>
                                )
                            }
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        );
    }
}
DiscountForm=Form.create({})(DiscountForm);