import React from 'react'
import { Row,Col,Card,Select} from 'antd'
import './index.less'
import ReactEcharts from 'echarts-for-react'
import 'echarts/lib/chart/bar'
//引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
const Option=Select.Option;
export default class HomePage extends React.Component{
    state={
        stockNumber:0,
        purMark:'month',
        saleMark:'month',
        purSum:0,
        purNum:0,
        saleSum:0,
        saleNum:0,
        key: 'purchase',
        purInfo:[],
        saleInfo:[]
    };
    componentDidMount(){
        this.getStock();
        this.getPurNum();
        this.getSaleNum();
        this.getPurMonth();
        this.getSaleMonth();
    };
    getStock=()=>{
        fetch('/homePage/stock',{
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
                stockNumber:data[0].total
            })
        })
    };
    getPurMonth=()=>{
        let result=[];
        for(let i=1;i<=12;i++){
            fetch('/homePage/purchaseMonth',{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                credentials:'include',
                mode:"cors",
                body:JSON.stringify({month:i})
            }).then(
                res=>res.json()
            ).then(data=>{
                result[data.month-1]=data.total;
                this.setState({
                    purInfo:result
                })
            });
        }
    };
    getSaleMonth=()=>{
        let result=[];
        for(let i=1;i<=12;i++){
            fetch('/homePage/saleMonth',{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                credentials:'include',
                mode:"cors",
                body:JSON.stringify({month:i})
            }).then(
                res=>res.json()
            ).then(data=>{
                result[data.month-1]=data.total;
                this.setState({
                    saleInfo:result
                })
            });
        }
    };
    getPurNum=()=>{
        fetch('/homePage/purchaseSum',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            credentials:'include',
            mode:"cors",
            body:JSON.stringify({purMark:this.state.purMark})
        }).then(
            res=>res.json()
        ).then(data=>{
           this.setState({
               purSum:data[0].total
           })
        });
        fetch('/homePage/purchaseNum',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            credentials:'include',
            mode:"cors",
            body:JSON.stringify({purMark:this.state.purMark})
        }).then(
            res=>res.json()
        ).then(data=>{
            this.setState({
                purNum:data[0].total
            })
        });
    };
    handlePurChange = (value) => {
       this.setState({
           purMark:value
       },()=>{
           this.getPurNum();
       });
    };
    getSaleNum=()=>{
        fetch('/homePage/saleSum',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            credentials:'include',
            mode:"cors",
            body:JSON.stringify({saleMark:this.state.saleMark})
        }).then(
            res=>res.json()
        ).then(data=>{
            this.setState({
                saleSum:data[0].total
            })
        });
        fetch('/homePage/saleNum',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            credentials:'include',
            mode:"cors",
            body:JSON.stringify({saleMark:this.state.saleMark})
        }).then(
            res=>res.json()
        ).then(data=>{
            this.setState({
                saleNum:data[0].total
            })
        })
    };
    handleSaleChange = (value) => {
        this.setState({
            saleMark:value
        },()=>{
            this.getSaleNum();
        });
    };

    //
    onTabChange = (key, type) => {
        this.setState({ [type]: key });
    };
    getPurOption=()=>{
        let option= {
            title: {
                text: '采购对比分析'
            },
            //点击提示标签
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                data: [
                    '1月',
                    '2月',
                    '3月',
                    '4月',
                    '5月',
                    '6月',
                    '7月',
                    '8月',
                    '9月',
                    '10月',
                    '11月',
                    '12月'
                ]
            },
            yAxis: {
                type: 'value'
            },
            //内容数据
            series: [
                {
                    name: '订单量',
                    type: 'bar',
                    data: [...this.state.purInfo]
                }
            ]
        };
        return option;
    };
    getSaleOption=()=>{
        let option= {
            title: {
                text: '销售对比分析'
            },
            //点击提示标签
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                data: [
                    '1月',
                    '2月',
                    '3月',
                    '4月',
                    '5月',
                    '6月',
                    '7月',
                    '8月',
                    '9月',
                    '10月',
                    '11月',
                    '12月'
                ]
            },
            yAxis: {
                type: 'value'
            },
            //内容数据
            series: [
                {
                    name: '订单量',
                    type: 'bar',
                    data: [...this.state.saleInfo]
                }
            ]
        };
        return option;
    };
    render(){
        const tabList = [
            {
                key: 'purchase',
                tab: '采购',
            },
            {
                key: 'sale',
                tab: '销售',
            },
            {
                key: 'inventory',
                tab: '仓库',
            },
        ];

        const contentList= {
            purchase: <ReactEcharts option={this.getPurOption()} them="manager" notMerge={true} lazyUpdate={true} style={{height:500}}/>,
            sale:<ReactEcharts option={this.getSaleOption()} them="manager" notMerge={true} lazyUpdate={true} style={{height:500}}/>,
            inventory: <ReactEcharts option={this.getPurOption()} them="manager" notMerge={true} lazyUpdate={true} style={{height:500}}/>,
        };
        return (
            <div className="homePage">
                <Row className="head">
                    {/*<Col span={6}>
                        <Card className="card" title="库存预警" bordered={false}>
                            <span>0</span>
                        </Card>
                    </Col>*/}
                    <Col span={6}>
                        <Card className="card" title="采购" bordered={false} extra={
                            <Select
                                defaultValue='month'
                                style={{ width: 100 }}
                                onChange={this.handlePurChange}
                            >
                                <Option value="month">本月</Option>
                                <Option value="year">本年</Option>
                            </Select>
                        }>
                            <span>{this.state.purSum}</span>
                            <span className="num"> {this.state.purNum}笔</span>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="card" title="销售" bordered={false} extra={
                            <Select
                                defaultValue='month'
                                style={{ width: 100 }}
                                onChange={this.handleSaleChange}
                            >
                                <Option value="month">本月</Option>
                                <Option value="year">本年</Option>
                            </Select>
                        }>
                            <span>{this.state.saleSum}</span>
                            <span className="num"> {this.state.saleNum}笔</span>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="card" title="库存" bordered={false}>
                            <span>
                                {
                                    this.state.stockNumber
                                }
                            </span>
                        </Card>
                    </Col>
                </Row>
                <Row className="body">
                    <Card
                        style={{ width: '100%' }}
                        tabList={tabList}
                        activeTabKey={this.state.key}
                        onTabChange={key => {
                            this.onTabChange(key, 'key');
                        }}
                    >
                        {contentList[this.state.key]}
                    </Card>
                </Row>
            </div>
        )
    }
}