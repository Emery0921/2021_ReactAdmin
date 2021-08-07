import React, { Component } from 'react'
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './css/index.less'
import logo from './images/logo.png'


export default class Login extends Component {
    onfinish = () => {
        alert("表单提交了")          
    }
    pwdValidator = (rule,value,callback) => {
        if(!value){
            callback('密码必须输入')
        }else if(value.length>12){
            callback('密码必须小于等于12位')
        }else if(value.length<4){
            callback('密码必须大于4位')
        }else if(!(/^\w+$/).test(value)){
            callback('密码必须由字母，数字，下划线组成')
        }else{
            callback()
        }
        
    }
    render() { 
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
                        <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                        </Button>
                    </Form.Item>
                    </Form>
             </section>
            </div>
        )
    }
}

 