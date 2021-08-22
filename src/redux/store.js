
//用createStore创建store,引入中间架用于异步action
import {createStore,applyMiddleware} from 'redux'
//引入为store服务的汇总的reducers
import allReducers from './reducers'
//引入redux-thunk用于异步action
import thunk from 'redux-thunk'
//引入redux-devtools-extension，用于redux开发者工具的调试
import {composeWithDevTools} from 'redux-devtools-extension'

export default createStore(allReducers,composeWithDevTools(applyMiddleware(thunk)))