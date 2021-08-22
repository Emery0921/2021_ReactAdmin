import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect,Route,Switch} from 'react-router-dom'
import { Layout} from 'antd';
import Home from '../../components/Home'
import Category from '../Category'
import Product from '../Product'
import AddUpdate from '../Product/add_update'
import Detail from '../Product/detail'
import User from '../User'
import Role from '../Role'
import Bar from '../Bar'
import Line from '../Line'
import Pie from '../Pie'
import Header from './header'
import LeftNav from './left_nav'
import './css/admin.less'
const { Footer, Sider, Content } = Layout;
//装饰器语法
@connect(
    state => ({userInfo:state.userInfo}),
    {}
)
class Admin extends Component { 
    //在render方法里要想实现跳转，必须借助Redirect
    render() {
            const {isLogin} = this.props.userInfo
            if(!isLogin){
                return <Redirect to='/login'/>
            }else{
                return (
                        <Layout className='admin'>
                            <Sider className='sider'>
                                <LeftNav/>
                            </Sider>
                            <Layout>
                                <Header/>
                                <Content className='content'>
                                    <Switch>
                                        <Route path='/admin/home' component={Home}/>
                                        <Route path='/admin/prod_about/category' component={Category}/>
                                        <Route path='/admin/prod_about/product' component={Product} exact/>
                                        <Route path='/admin/prod_about/product/detail/:id' component={Detail}/>
                                        <Route path='/admin/prod_about/product/add_update' component={AddUpdate} exact/>
                                        <Route path='/admin/prod_about/product/add_update/:id' component={AddUpdate}/>
                                        <Route path='/admin/user' component={User}/>
                                        <Route path='/admin/role' component={Role}/>
                                        <Route path='/admin/charts/bar' component={Bar}/>
                                        <Route path='/admin/charts/line' component={Line}/>
                                        <Route path='/admin/charts/pie' component={Pie}/>
                                        <Redirect to='admin/home'/>
                                    </Switch>
                                </Content>
                                <Footer className='footer'>
                                    推荐使用谷歌浏览器，可以获得更加页面操作体验
                                </Footer>
                            </Layout>
                        </Layout>
                )
            }
        
    }
}

export default Admin
