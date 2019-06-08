import React from 'react'
import { Row,Col,Upload,Icon,Input,Form,Select,message,Button} from 'antd'
import './index.less'
export default class Customer extends React.Component{
    componentDidMount(){
        this.getUserInfo();
    }
    state={
        selectedRowKeys:[],
        data:{},
        visible:false,
        _id:'',
        userInfo:''
    };
    getUserInfo=()=> {
        fetch('/userInfo', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: "cors",
        }).then(
            res => res.json()
        ).then(data => {
            if (data !== '') {
                this.setState({
                    userInfo:data
                })
            }
        })
    }
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
        fetch('/basicData/customer/list',{
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
        return (
            <Row className="customer">
                <Row className="header" style={{marginBottom:10}}>
                    <Col span={12} className="title">账号信息</Col>
                    <Col span={12} className="add">
                        <a onClick={this.handleCustomerAdd}>
                            <Icon type="plus"/>
                            <span>修改信息</span>
                        </a>
                    </Col>
                </Row>
                <Row className="body">
                    <CustomerForm
                        ref="getFormValue"
                        data={this.state.userInfo}/>
                </Row>
            </Row>
        )
    }
}
class CustomerForm extends React.Component{

    getBase64=(img, callback)=> {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    beforeUpload=(file)=> {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJPG && isLt2M;
    }

    state = {
        loading: false,
    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
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
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        return (
            <Form {...formItemLayout} autoComplete="off" layout="horizontal">
                <Form.Item label="当前头像">
                    {
                        getFieldDecorator("avater",{
                            initialValue:this.props.data.name,
                        })(
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                            </Upload>
                        )
                    }
                </Form.Item>
                <Form.Item label="用户名">
                    {
                        getFieldDecorator("username",{
                            initialValue:this.props.data.username,
                        })(
                            <Input disabled={true} style={{width:200}}/>
                        )
                    }
                </Form.Item>
                <Form.Item label="密码">
                    {
                        getFieldDecorator("password",{
                            initialValue:this.props.data.password,
                            rules:[{
                                required:true,message:'请输入新密码'
                            }]
                        })(
                            <Input type="password" style={{width:200}} />
                        )
                    }
                </Form.Item>
                <Form.Item label="性别">
                    {
                        getFieldDecorator("sex",{
                            initialValue:this.props.data.sex
                        })(
                            <Input style={{width:200}}/>
                        )
                    }
                </Form.Item>
                <Form.Item label="电话">
                    {
                        getFieldDecorator("tel",{
                            initialValue:this.props.data.tel
                        })(
                            <Input style={{width:200}}/>
                        )
                    }
                </Form.Item>
                <Form.Item label="角色">
                    {
                        getFieldDecorator("role",{
                            initialValue:this.props.data.role
                        })(
                            <Input disabled={true} style={{width:200}}/>
                        )
                    }
                </Form.Item>
            </Form>
        );
    }
}
CustomerForm=Form.create({})(CustomerForm);
