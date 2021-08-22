import {SAVECATEGORYINFO} from '../constant'

//初始化title
const initState = []
export default function menu(preState=initState,action){
    const {type,data} = action
    switch (type) {
        case SAVECATEGORYINFO:
            return data
        default:
            return preState
    }
}