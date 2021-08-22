import React, { Component } from 'react'
import { Menu} from 'antd';
import {Link,withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {saveTitle} from '../../../redux/actions/left_nav'
import menuList from '../../../config/menuConfig'
import logo from '../../../static/imgs/xiaomi1.jpg'
import * as Icon from '@ant-design/icons';
import './index.less'
const { SubMenu } = Menu;

//装饰器语法
@connect(
    state =>({
        menus:state.userInfo.user.role.menus,
        username:state.userInfo.user.username
    }),
    {saveTitle}
)
@withRouter
class LeftNav extends Component { 
    //将title信息保存到redux中 
    //用于创建菜单的方法
    createMenu = target => {
       return target.map(menuObj => {
            const icon=React.createElement(Icon[menuObj.icon])//{}里面可以修改图标的样式
            if(this.hasAuth(menuObj)){
                if(!menuObj.children){
                    return (
                        <Menu.Item key={menuObj.key} icon={icon} onClick={()=>{this.props.saveTitle(menuObj.title)}}>
                            <Link to={menuObj.path}>
                                    <span>{menuObj.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                }
                else{
                    return(
                        <SubMenu key={menuObj.key} icon={icon} title={menuObj.title}>
                            {this.createMenu(menuObj.children)}
                        </SubMenu>
                    )
                }
            }else return []
        })
    } 
    //校验菜单权限
    hasAuth = (item) => {
        //获取当前用户可以看到的菜单
        const {menus,username} = this.props
        if(username==='admin') return true
        else if(!item.children){
            return menus.find(menu=> menu===item.key)
        }else if(item.children){
            return item.children.some(child=>{return menus.indexOf(child.key)!==-1})
        }
    }
    /* componentDidMount(){
        const pathArr =this.props.location.pathname.split('/')
        console.log(pathArr[pathArr.length-1])
    } */    
    render() {
        //接收地址拆分后返回的数组
        //const pathArr =this.props.location.pathname.split('/')
        const {pathname} = this.props.location
        //截取拆分后返回的数组
        //const spliceArr=pathArr.splice(2)
        return (
              <div>
                    <header className='nav_header'>
                        <img src={logo} alt="logo"/>
                        <h1>商品管理系统</h1>
                    </header>
                    <Menu
                    className='nav_menu'
                    defaultSelectedKeys={pathname.indexOf('product')!==-1?'product':pathname.split('/').reverse()}
                    defaultOpenKeys={pathname.split('/').splice(2)}
                    mode="inline"
                    theme="dark"
                    >
                    {this.createMenu(menuList)}
                    </Menu>
              </div>
        )
    }
}
export default LeftNav
