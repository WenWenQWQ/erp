import React,{ Component } from 'react';
import { Row,Col } from 'antd';
import './index.less';
import Utils from "./../../utils/index";
import {Redirect,NavLink} from 'react-router-dom'
export default class Header extends Component{
    constructor(props){
        super(props)
        this.state={
            userName:'',
            sign:false
        };
        this.interval=setInterval(()=>{
            let sysTime=Utils.formateDate(new Date().getTime());
            this.setState({
                sysTime
            })
        },1000);
        this.getUserInfo();
    }
    componentDidMount(){
        this.getUserInfo();
    }
    getUserInfo=()=>{
        fetch('/userInfo',{
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
                userName:data.name,
                sign:true
            })
        })
    };
    signOut=()=>{
        fetch('/signOut',{
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
            if(data==='true') {
                this.setState({
                    userName:'',
                    sign:false
                })
                clearInterval(this.interval);
                window.open('/#/signIn','_self')
            }
        })
    }
    render(){
        return (
            <div className="header">
                <Row className="header-top">
                    <Col span={ 24 }>
                        <NavLink className="userInfo" to='/admin/proInfo'>
                            <img src="/assets/logo-ant.svg"/>
                            <span>{this.state.userName}</span>
                        </NavLink>
                        <a className="signOut" onClick={this.signOut}>退出</a>
                    </Col>
                </Row>
                {
                    <Row className="breadcrumb">
                        <Col span={ 24 } className="time">
                            <span className="date">{this.state.sysTime}</span>
                        </Col>
                    </Row>
                }
            </div>
        )
    }
}