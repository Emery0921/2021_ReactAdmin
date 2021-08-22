import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Button,Modal} from 'antd'
import {withRouter} from 'react-router-dom'
import {FullscreenOutlined,FullscreenExitOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import {deleteUserInfo} from '../../../redux/actions/login'
import screenfull from 'screenfull'
import dayjs from 'dayjs'
import {reqWeather} from '../../../api'
import menuArr from '../../../config/menuConfig'
import './css/header.less'
const {confirm} = Modal;

//在非路由组件，使用路由组件的API使用withRoute，它是高阶组件，接收一个组件为参数，然后返回一个组件
//装饰器语法
@connect(//高阶函数
    state => ({userInfo:state.userInfo,title:state.saveTitle}),
    {deleteUserInfo}
)
@withRouter//高阶组件
class Head extends Component {
    state = {
        isFull:false,
        date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss '), // 展示时间
        weatherInfo:{},
        title:''
    }
    componentDidMount(){
        //给screenfull绑定全屏监听
        screenfull.on('change', () => {
            const {isFull} = this.state
            this.setState({isFull:!isFull})
        });
        this.timeId=setInterval(() => {
            this.setState({date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss ')})
        },1000)
        //获取天气
        this.getWheather()
        //获取title
        this.getTitle()
    }
    componentWillUnmount(){
        clearInterval(this.timeId)
    }
    //获取天气信息的回调
    getWheather = async() => {
        let result = await reqWeather()
        //console.log(result)
        this.setState({ weatherInfo:result})
    }
    //获取标题的回调
    getTitle = () => {
        const {pathname} = this.props.location
        const pathKey = pathname.indexOf('product')!==-1?'product': pathname.split('/').reverse()[0]
        let title = ''
          menuArr.forEach((arrObj) => {
            if(arrObj.children instanceof Array){
            const  temper=  arrObj.children.find((arrChildrenObj) => {
                    return arrChildrenObj.key===pathKey
                })
                if(temper){
                    title= temper.title
                }
                //return title
                
            }else{
                if(pathKey===arrObj.key)
                title= arrObj.title
                //return title
            } 
        })
        this.setState({title})
    }
    //全屏和退出全屏切换的回调
    fullScreen = () => {
        screenfull.toggle();
    }
    //退出登录的回调
    logOut = () => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            title:'确认退出？',
            content:'如果退出，需要重新登录',
            okText:'确认',
            cancelText:'取消',
            onOk:() =>{
                //console.log(this.props)
                 //删除localStorage和redux中存储的数据
                 this.props.deleteUserInfo()
            },
          });
       
    }
    
    render() {
        const {isFull,weatherInfo} = this.state
        const {user} = this.props.userInfo
        return (
            <div>
                 <header className='header'>
                    <div className='header_top'>
                        <Button size='small' onClick={this.fullScreen} >{isFull?<FullscreenOutlined />:<FullscreenExitOutlined />}</Button>
                        <span className='username'>欢迎你，{user.username}</span>
                        <Button type='link' onClick={this.logOut}>退出登录</Button>
                    </div>
                    <div className='header_bottom'>
                        <div className='header-bottom-left'>
                            <span>
                                {this.props.title||this.state.title}     
                            </span>
                        </div>
                        <div className='header-bottom-right'>
                            <span>{this.state.date}</span>
                            <span>{weatherInfo.city}&nbsp;&nbsp;{weatherInfo.weather}&nbsp;&nbsp;温度:{weatherInfo.temperature}&nbsp;&nbsp;</span>
                        </div>
                    </div>
                 </header>
            </div>
        )
    }
}
export default Head
