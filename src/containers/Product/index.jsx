import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Button, Card, Select,Input,Table, message} from 'antd'
import {PlusCircleOutlined,SearchOutlined} from '@ant-design/icons'
import {reqProductList,reqUpdateProdState,reqSearchProduct} from '../../api'
import {PAGE_SIZE} from '../../config'
import {saveProdInfo} from '../../redux/actions/product'
const {Option} = Select

//装饰器语法
@connect(
    state=>({}),
    {saveProdInfo}
)
class Product extends Component {
    //初始化状态
    state = {
        List:[],//返回的分页商品数据
        total:'',//商品的总数
        current:1,//当前所在的页数
        isLoading:true,//是否处于加载中
        keyWord:'',//搜索关键词
        searchType:'productName',//搜索类型
    }
    //组件一挂载就发送商品分页请求
    componentDidMount(){
        this.getProductList()
    }
    //获取商品分页的数据
    getProductList = async(number=1) => {
        let result
        const {searchType,keyWord} = this.state  
       if(this.isSearch) result = await reqSearchProduct(number,PAGE_SIZE,searchType,keyWord)
       else result = await reqProductList(number,PAGE_SIZE)
       this.setState({isLoading:false})
       const {status,data,msg} = result
       if(status===0){
           this.setState({
               List:data.list,
               total:data.total,
               current:data.pageNum
            })
       //把获取的商品信息放到redux中
       this.props.saveProdInfo(data.list)
        }
       else{
           message.warning(msg,1)
       }
    }
    //更新商品状态的回调（是在售还是以停售）
    updateProdState = async(item) => {
       let {List} = this.state
       let {_id,status} = item
        if(status===1){
            status=2
        }else{
            status=1
        }
        let result = await reqUpdateProdState(_id,status)
        if(result.status===0) {
            message.success('更新商品状态成功',1)
            let newArr=List.map((item) => {//通过map方法加工List数组，根据Id，改变其status
                if(item._id===_id){
                    item.status=status
                }
                return item
            })
            this.setState({List:newArr})
        }
        else message.warning('更新商品状态失败',1)      
    }
    //搜索商品的回调
    search = () => {
        this.isSearch=true
        this.getProductList()
    }
    render() {
        const {List,total,current} =this.state
        const dataSource = List
          
          const columns = [
            {
              title: '商品名称',
              width:'15%',
              align:'center',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '商品描述',
              align:'center',
              dataIndex: 'desc',
              key: 'desc',
            },
            {
              title: '价格',
              width:'8%',
              align:'center',
              dataIndex: 'price',
              key: 'price',
              render:price=>"￥"+price
            },
            {
              title: '操作',
              width:'10%',
              align:'center',
              //dataIndex: 'status',
              key: 'status',
              render:item=>{
                  return(
                      <div>
                          <Button 
                              type={item.status===1?'danger':'primary'}
                              onClick={()=>{this.updateProdState(item)}}
                          >
                              {item.status===1?'下架':'上架'}
                          </Button><br/>
                          <span>{item.status===1?'在售':'已停售'}</span>
                      </div>
                  )
              }
            },
            {
              title: '状态',
              width:'10%',
              align:'center',
              //dataIndex: 'status',
              key: 'status',
              render:(item)=>{
                  return(
                    <div>
                    <Button type='link' onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}}>详情</Button><br/>
                    <Button type='link' onClick={()=>{this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`)}}>修改</Button>
                </div>
                  )
                  
              } 
            },
          ];
        return (
            <div>
                 <Card  
                    title={
                        <div>
                             <Select defaultValue="productName" onChange={(value)=>{this.setState({searchType:value})}}>
                                <Option value="productName">按名称搜索</Option>
                                <Option value="productDesc">按描述搜索</Option>
                            </Select>    
                            <Input 
                                placeholder='请输入关键字'
                                style={{width:'20%',margin:'0px 10px'}}
                                allowClear
                                onChange={(e)=>{this.setState({keyWord:e.target.value})}}
                            />
                            <Button type='primary' onClick={this.search}><SearchOutlined/>搜索</Button>
                        </div>                                         
                    }
                    extra={<Button type='primary'onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}}><PlusCircleOutlined />添加商品</Button>} 
                 >
                    <Table 
                        dataSource={dataSource} 
                        columns={columns}
                        bordered 
                        rowKey={'_id'}
                        loading={this.state.isLoading}
                        pagination={{
                            pageSize:PAGE_SIZE,
                            total,
                            current,
                            onChange:this.getProductList
                        }}
                    />;
                </Card>
            </div>
        )
    }
}
export default Product
