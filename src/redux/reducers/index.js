import {combineReducers} from 'redux'
import loginReducer from '../reducers/login'
import leftNav from '../reducers/left_nav'
import product from '../reducers/product'
import category from '../reducers/category'

export default combineReducers({
    //对象中的key和value决定着store里保存状态的key和value
    userInfo:loginReducer,
    saveTitle:leftNav,
    saveProdInfo:product,
    saveCategoryInfo:category
})