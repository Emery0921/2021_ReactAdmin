
import {SAVEUSERINFO,DELETEUSERINFO} from '../constant'
//保存用户信息
export const saveUserInfo = (data) => {
    localStorage.setItem('user',JSON.stringify(data.user))
    localStorage.setItem('token',data.token)
   return  {type:SAVEUSERINFO,data}
}
//删除用户信息
export const deleteUserInfo = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
   return  {type:DELETEUSERINFO}
}



