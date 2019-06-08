import React from 'react'
import { HashRouter,Route,Switch,Redirect} from 'react-router-dom'
import App from './App'
import SignIn from './signIn'
import SignUp from './signUp'
import Admin from './admin'
import Product from './page/basicData/product/index'
import Customer from './page/basicData/customer/index'
import Warehouse from './page/basicData/warehouse/index'
import Supplier from './page/basicData/supplier/index'
import BuyOrder from './page/purchasing/order/index'
import BuyOrderList from './page/purchasing/orderList/index'
import BuyOrderDetail from './page/reportForm/purchase/detail'
import BuyStorage from './page/purchasing/storage/index'
import BuyStorageList from './page/purchasing/storageList/index'
import BuyRefund from './page/purchasing/refund/index'
import BuyRefundList from './page/purchasing/refundList/index'
import BuyRefundDetail from './page/reportForm/purchase/refundDetail'
import BuyStorageDetail from './page/reportForm/purchase/storageDetail'
import InventoryOrder from './page/inventory/order/index'
import InventoryOrderList from './page/inventory/orderList/index'
import InventoryDetail from './page/reportForm/Inventory/detail'
import OtherEntry from './page/inventory/entry/index'
import EntryList from './page/inventory/entryList/index'
import EntryDetail from './page/reportForm/Inventory/entryDetail'
import Stock from './page/reportForm/Inventory/stock'
import SaleOrder from './page/sale/order'
import SaleOrderList from './page/sale/orderList'
import SaleOrderDetail from './page/reportForm/sale/detail'
import SaleDelivery from './page/sale/delivery'
import SaleDeliveryList from './page/sale/deliveryList'
import SaleDeliveryDetail from './page/reportForm/sale/deliveryDetail'
import SaleRefund from './page/sale/return/index'
import SaleRefundList from './page/sale/returnList/index'
import SaleRefundDetail from './page/reportForm/sale/refundDetail'
import OtherDelivery from './page/inventory/delivery/index'
import DeliveryList from './page/inventory/deliveryList/index'
import DeliveryDetail from './page/reportForm/Inventory/deliveryDetail'
import ProInfo from './page/proInfo/index'
import Staff from './page/basicData/staff/index'
import HomePage from './page/homePage/index'
import ajax from "./ajax";
export default class Router extends React.Component{
    state={
        status:false,
        title:''
    };
    componentDidMount(){
        this.getUserInfo();
    }
    getUserInfo=()=>{
        ajax.userInfo().then(() => {
            this.setState({
                status:true
            })
        }, () => {
            this.setState({
                status:false
            })
        });
    };
    render(){
        return(
            <HashRouter>
                <App>
                    <Switch>
                        <Route path='/signIn' render={()=>
                            <SignIn/>
                        }/>
                        <Route path='/signUp' render={()=>
                            <SignUp/>
                        }/>
                        <Route path='/admin' render={() =>{
                            if(this.state.status){
                                return  <Admin>
                                    <Switch>
                                        <Route path="/admin/basicData/product" component={Product}/>
                                        <Route path="/admin/basicData/customer" component={Customer}/>
                                        <Route path="/admin/basicData/warehouse" component={ Warehouse}/>
                                        <Route path="/admin/basicData/supplier" component={Supplier}/>
                                        <Route path="/admin/purchasing/order" component={ BuyOrder}/>
                                        <Route path="/admin/purchasing/orderList" component={ BuyOrderList}/>
                                        <Route path="/admin/reportForm/purchase/detail" component={ BuyOrderDetail}/>
                                        <Route path="/admin/purchasing/receive" component={ BuyStorage}/>
                                        <Route path="/admin/purchasing/receiveList" component={ BuyStorageList}/>
                                        <Route path="/admin/reportForm/purchase/storageDetail" component={ BuyStorageDetail}/>
                                        <Route path="/admin/purchasing/return" component={ BuyRefund}/>
                                        <Route path="/admin/purchasing/returnList" component={ BuyRefundList}/>
                                        <Route path="/admin/reportForm/purchase/refundDetail" component={ BuyRefundDetail}/>
                                        <Route path="/admin/reportForm/Inventory/stock" component={ Stock}/>
                                        <Route path="/admin/inventory/order" component={ InventoryOrder}/>
                                        <Route path="/admin/reportForm/Inventory/detail" component={ InventoryDetail}/>
                                        <Route path="/admin/inventory/orderList" component={ InventoryOrderList}/>
                                        <Route path="/admin/inventory/entry" component={ OtherEntry}/>
                                        <Route path="/admin/inventory/entryList" component={ EntryList}/>
                                        <Route path="/admin/reportForm/Inventory/entryDetail" component={ EntryDetail}/>
                                        <Route path="/admin/sale/order" component={ SaleOrder}/>
                                        <Route path="/admin/sale/orderList" component={ SaleOrderList}/>
                                        <Route path="/admin/reportForm/sale/detail" component={ SaleOrderDetail}/>
                                        <Route path="/admin/sale/delivery" component={ SaleDelivery}/>
                                        <Route path="/admin/sale/deliveryList" component={ SaleDeliveryList}/>
                                        <Route path="/admin/reportForm/sale/deliveryDetail" component={ SaleDeliveryDetail}/>
                                        <Route path="/admin/sale/refund" component={ SaleRefund}/>
                                        <Route path="/admin/sale/refundList" component={ SaleRefundList}/>
                                        <Route path="/admin/reportForm/sale/refundDetail" component={ SaleRefundDetail}/>
                                        <Route path="/admin/inventory/delivery" component={ OtherDelivery}/>
                                        <Route path="/admin/inventory/deliveryList" component={ DeliveryList}/>
                                        <Route path="/admin/reportForm/Inventory/deliveryDetail" component={ DeliveryDetail}/>
                                        <Route path="/admin/proInfo" component={ ProInfo}/>
                                        <Route path="/admin/basicData/staff" component={ Staff}/>
                                        <Route path="/admin/homePage" component={ HomePage}/>
                                    </Switch>
                                </Admin>
                            }else{
                                return <Redirect to='/signIn'/>
                            }
                        }
                        }/>
                        <Route path='/' render={()=>
                            <SignIn/>
                        }/>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}
