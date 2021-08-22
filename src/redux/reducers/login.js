import {SAVEUSERINFO,DELETEUSERINFO} from '../constant'

const user = JSON.parse(localStorage.getItem('user'))
const token = localStorage.getItem('token')
const initState = {
    user:user||'',
    token:token||'',
    isLogin:user?true:false
}
export default function test(preState=initState,action){
    const {type,data} = action
    switch (type) {
        case SAVEUSERINFO:
            return {user:data.user,token:data.token,isLogin:true}
        case DELETEUSERINFO:
            return {user:'',isLogin:false}
        default:
            return preState
    }

}