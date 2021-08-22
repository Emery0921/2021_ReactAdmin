import axios from 'axios'
//引入qs.stringify()可以将对象{username:admin,password:admin}转换成username=admin&password=admin
import store from '../redux/store'
import qs from 'querystring'
import {message} from 'antd'
import Nprogress from 'nprogress'
import {deleteUserInfo} from '../redux/actions/login'
import 'nprogress/nprogress.css'
//配置拦截器
//1，用create创建axios实例
const instance = axios.create({
    timeout: 1000,
  });
//2,添加拦截器
//请求拦截器
instance.interceptors.request.use(config => {
    Nprogress.start()
    //在redux中获取token
    const {token} = store.getState().userInfo   
    //向请求头中添加token，用于校验身份
    //console.log('输出config',config)
    if(token)  config.headers.Authorization = token
    const {data,method} = config
    //若是post请求
    if(method.toLowerCase === 'post'){
        //若传递过来的对象是参数
        if(data instanceof Object){
            config.data=qs.stringify(data)
        }
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

//响应拦截器
instance.interceptors.response.use(
    //请求若成功，走这里 
    response => {
        Nprogress.done()
        //console.log('response',response)
        return response.data;
  }, 
   //请求若失败，走这里 
    error=> {
        Nprogress.done()
        console.log(error)
        //debugger;断点
        if(error.response.status===401){
          message.error('身份校验失败，请重新登录',1)
          store.dispatch(deleteUserInfo())
        }else{
          message.error(error.message,1)          
        }
        //中断promise量
        return new Promise(()=>{})
        
  });

export default instance