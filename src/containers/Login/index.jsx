import React, { Component } from 'react'
import {Form,Input,Button,message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {saveUserInfo} from '../../redux/actions/login'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {reqLogin} from '../../api'
import './css/index.less'
import logo from '../../static/imgs/xiaomi1.jpg'


//装饰器语法
@connect(
    state => ({isLogin:state.userInfo.isLogin}),
    {
      saveUserInfo  
    }
)
class Login extends Component {
    
    //values的值是{username:xxx,password:xxxx}
    onfinish = async(values) => {
        const {username,password} = values
        //axios的post请求默认将参数转成json形式，进而给服务器
       /*  reqLogin(username,password).then(
            (response)=>{console.log('成功了',response.data)}
        ).catch(
            (error)=>{console.log('失败了',error)}
        ) */
        let result = await reqLogin(username,password)
        const {status,msg,data} = result
        //console.log('result',result)
        if(status===0){
            //console.log(result)
            //1,服务器返回的user信息，还有token，交由redux管理
            this.props.saveUserInfo(data)
            //2,跳转到admin
            this.props.history.replace('/admin')
        }else{//弹窗提示登陆失败，用户名或密码错误
            message.warning(msg,1)

        }

    }
    pwdValidator = (rule,value,callback) => {//自定义验证
        if(!value){
            return Promise.reject('密码必须输入')
        }else if(value.length>12){
            return Promise.reject('密码必须小于等于12位')
        }else if(value.length<4){
            return Promise.reject('密码必须大于4位')
        }else if(!(/^\w+$/).test(value)){
            return Promise.reject('密码必须由字母，数字，下划线组成')
        }else{
            return Promise.resolve()
        }
        
    }
    render() { 
        const {isLogin} = this.props
        //如果已经登录了
        if(isLogin){
            return <Redirect to='/admin/home'/>
        }
        return (
            <div className='login'>
              <header>
                 <img src={logo} alt="logo" /> 
                 <h1>商品管理系统</h1>
             </header>  
              <section>
                 <h1>用户登录</h1>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.onfinish}
                    >
                    <Form.Item
                        name="username"
                        rules={[//声明式验证
                            { required: true, message: '请输入你的用户名!' },//必须输入
                            { max: 12, message: '用户名必须小于等于12位' },
                            { min: 4, message: '用户名必须大于等于4位' },
                            { pattern:/^\w+$/ , message: '用户名必须是字母，数字，下划线组成' },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" style={{color:'rgba(0,0,0,0.25)'}}/>} placeholder="用户名" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[//自定义验证
                            { validator: this.pwdValidator},
                           
                        ]}
                    >
                        <Input
                        prefix={<LockOutlined className="site-form-item-icon" style={{color:'rgba(0,0,0,0.25)'}}/>}
                        type="password"
                        placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                    </Form.Item>
                </Form>
             </section>
            </div>
        )
    }
}

export default Login


 