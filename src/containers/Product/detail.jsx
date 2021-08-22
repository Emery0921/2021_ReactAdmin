import React, { Component } from 'react'
import {Button,Card,List, message} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import {connect} from 'react-redux'
import {BASE_URL} from '../../config/index'
import {reqProdById,reqCategoryList} from '../../api'
import './detail.less'
const {Item} = List

//装饰器语法
@connect(
    state=>({
        prodInfo:state.saveProdInfo,
        categoryInfo:state.saveCategoryInfo
    }),
)
class Detail extends Component {
    //初始化状态
    state = {
        categoryId:'',
        desc:'',
        detail:'',
        imgs:[],
        name:'',
        price:'',
        categoryName:'',
        isLoading:true
    }
    componentDidMount(){
        const {id} = this.props.match.params
        const reduxProdList = this.props.prodInfo
        const reduxCateList = this.props.categoryInfo
        if(reduxProdList.length){
            let result=reduxProdList.find(arrObj => arrObj._id===id)
            if(result){
                const {categoryId,desc,detail,imgs,name,price}=result
                this.categoryId = categoryId
                this.setState({categoryId,desc,detail,imgs,name,price})
            }
        }else this.getProdById(id)   
        if(reduxCateList.length)  {
            //console.log(this.categoryId)
            let result =reduxCateList.find(arrObj => arrObj._id===this.categoryId)
            this.setState({categoryName:result.name,isLoading:false}) 
        }else this.getCategoryList()
    }
    //根据id获取商品信息
    getProdById = async(id) => {
        let result = await reqProdById(id)
        const {status,data,msg} = result
        if(status===0){
            const {categoryId,desc,detail,imgs,name,price} =data
            this.categoryId = categoryId
            this.setState({categoryId,desc,detail,imgs,name,price})
        }else{
            message.warning(msg,1)
        }
    }
    //获取商品分类列表
    getCategoryList = async() => {
        let result = await reqCategoryList()
        const {status,data,msg} = result
        if(status===0){
            let result =data.find(arrObj => arrObj._id===this.categoryId)
            this.setState({categoryName:result.name,isLoading:false})
        }else{
            message.warning(msg,1)
        }
    }
    render() {
        const {categoryName,desc,detail,imgs,name,price}=this.state
        return (
            <div>
                <Card 
                    title={
                    <div className='left-top'>
                        <Button 
                        type='link' 
                        size='small'
                        onClick={()=>{this.props.history.goBack()}}><ArrowLeftOutlined />
                        </Button>
                        <span>商品详情</span>
                    </div>
                    }
                    loading={this.state.isLoading}
                >   
                    <List className='list-name'>
                        <Item>
                            <span className='prod-name'>商品名称：</span>
                            <span>{name}</span>
                        </Item>
                        <Item>
                            <span className='prod-name'>商品描述：</span>
                            <span>{desc}</span>
                        </Item>
                        <Item>
                            <span className='prod-name'>商品价格：</span>
                            <span>{price}</span>
                        </Item>
                        <Item>
                            <span className='prod-name'>所属分类：</span>
                            <span>{categoryName}</span>
                        </Item>
                        <Item>
                            <span className='prod-name'>商品图片：</span>
                            {
                                imgs.map((item,index) => <img key={index} src={`${BASE_URL}/upload/${item}`} alt="商品图片" style={{width:200}}/>)
                            }
                        </Item>
                        <Item>
                            <span className='prod-name'>商品详情：</span>
                            <span dangerouslySetInnerHTML={{__html:detail}}></span>
                        </Item>
                    </List>
                </Card>
            </div>
        )
    }
}
export default Detail