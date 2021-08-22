// 项目中的所有请求
import myaxios from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'
import {BASE_URL,WHERTHER_KEY,CITY} from '../config'


//登录请求-------axios的post请求默认将参数转成json形式，进而给服务器
export const reqLogin = (username,password) => myaxios.post(`${BASE_URL}/login`,{username,password})   

//获取商品分类请求
export const reqCategoryList = () => myaxios.get(`${BASE_URL}/manage/category/list`) 
  
//获取天气请求（高德接口）
export const reqWeather = () => {
    return new Promise((resolve,reject) => {
        jsonp(
            `https://restapi.amap.com/v3/weather/weatherInfo?city=${CITY}&output=json&extensions=base&key=${WHERTHER_KEY}`,
            (err,data) => {
                if(err){
                    message.error('请求天气接口失败，请联系管理员')
                    return new Promise(()=>{})
                }else{
                    const {city,temperature,weather} = data.lives[0]
                    let wheatherObj ={city,temperature,weather}
                    resolve(wheatherObj)
                }
                
            }
        )
    })
}

//新增商品分类的请求
export const reqAddCategory = categoryName => myaxios.post(`${BASE_URL}/manage/category/add`,{categoryName})

//更新商品分类的请求
export const reqUpdateCategory = (categoryId,categoryName) => myaxios.post(`${BASE_URL}/manage/category/update`,{categoryId,categoryName})

//获取商品分页列表请求
export const reqProductList = (pageNum,pageSize) => myaxios.get(`${BASE_URL}/manage/product/list`,{params:{pageNum,pageSize}}) 
        
//更新商品请求(对商品进行上架和下架处理)
export  const reqUpdateProdState = (productId,status) =>myaxios.post(`${BASE_URL}/manage/product/updateStatus`,{productId,status})

//搜索商品请求
export const reqSearchProduct = (number,pageSize,searchType,keyword) => myaxios.get(`${BASE_URL}/manage/product/search`,{
    params:{
        pageNum:number,
        pageSize:pageSize,
        [searchType]:keyword
}}) 

//根据id获取商品信息请求
export const reqProdById = productId => myaxios.get(`${BASE_URL}/manage/product/info`,{params:{productId}})

//根据图片删除图片
export  const reqDeletePicture= name =>myaxios.post(`${BASE_URL}/manage/img/delete`,{name})

//添加商品
export const reqAddProduct = (productObj) => myaxios.post(`${BASE_URL}/manage/product/add`,{...productObj})

//更新商品
export const reqUpdateProduct = (productObj) => myaxios.post(`${BASE_URL}/manage/product/update`,{...productObj})

//请求所有角色列表
export const reqRolePaginationList = (pageNum, pageSize) => myaxios.get(`${BASE_URL}/manage/role/list`, {
    params: {
        pageNum,
        pageSize
    }
})

//添加角色
export const reqAddRole = roleName => myaxios.post(`${BASE_URL}/manage/role/add`,{roleName})

//给角色添加权限
export const reqAuthRole = roleObj => myaxios.post(`${BASE_URL}/manage/role/update`,{...roleObj,authTime:Date.now()})

//获取用户列表请求（顺带返回了角色列表）
export const reqUserList = () => myaxios.get(`${BASE_URL}/manage/user/list`)

//添加用户
export const reqAddUser = (userObj) => myaxios.post(`${BASE_URL}/manage/user/add`,{...userObj})

//删除用户
export const reqDeleteUser = userId => myaxios.post(`${BASE_URL}/manage/user/delete`,{userId})