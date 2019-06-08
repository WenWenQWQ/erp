import React, { Component } from 'react'
import { Menu,Icon } from 'antd'
import {NavLink} from 'react-router-dom'
import MenuConfig from './../../config/menuConfig'
import PurMenuConfig from './../../config/purMenuConfig'
import SaleMenuConfig from './../../config/saleMenuConfig'
import HouseMenuConfig from './../../config/houseMenuConfig'
import './index.less'
const SubMenu=Menu.SubMenu;
const MenuItemGroup=Menu.ItemGroup;
export default class NavLeft extends Component{
    state={
        menuTreeNode:'',
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
            if(data.role==='采购'){
                const menuTreeNode=this.renderMenu(PurMenuConfig);
                this.setState({
                    menuTreeNode
                })
            }else if(data.role==='销售'){
                const menuTreeNode=this.renderMenu(SaleMenuConfig);
                this.setState({
                    menuTreeNode
                })
            }else if(data.role==='库存'){
                const menuTreeNode=this.renderMenu(HouseMenuConfig);
                this.setState({
                    menuTreeNode
                })
            }else if(data.role==='超级管理员'){
                const menuTreeNode=this.renderMenu(MenuConfig);
                this.setState({
                    menuTreeNode
                })
            }
        })
    };
    //菜单渲染
    renderMenu=(data)=>{
        return data.map((item)=>{
            if(item.children){
                return <SubMenu title={<span>{item.type?<Icon type={item.type}/>:''}<span>{item.title}</span></span>} key={item.key}>
                    {this.renderMenu(item.children)}
                </SubMenu>
            }else if(item.childrenItem){
                return  <SubMenu title={<span>{item.type?<Icon type={item.type}/>:''}<span>{item.title}</span></span>} key={item.key}>
                    {
                        item.childrenItem.map((sitem)=> {
                            return <MenuItemGroup title={sitem.title} key={sitem.key}>
                                {this.renderMenu(sitem.children)}
                            </MenuItemGroup>
                        })
                    }
                </SubMenu>
            }else{
                return (
                    <Menu.Item title={item.title} key={item.key}>
                        <NavLink to={item.key}>{<span>{item.type?<Icon type={item.type}/>:''}<span>{item.title}</span></span>}</NavLink>
                    </Menu.Item>
                )
            }
        });
    };
    render(){
        return (
            <div>
                <div className="logo">
                    <img src="logo.svg" alt=""/>
                    <h1>ERP System</h1>
                </div>
                <Menu theme="dark">
                    {this.state.menuTreeNode}
                </Menu>
            </div>
        )
    }
}