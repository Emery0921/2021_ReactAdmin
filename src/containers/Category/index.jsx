import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Button,Card,message,Table,Modal,Input,Form} from 'antd';
import {PlusCircleOutlined} from '@ant-design/icons'
import {reqCategoryList,reqAddCategory,reqUpdateCategory} from '../../api'
import {PAGE_SIZE} from '../../config'
import {saveCategoryInfo} from '../../redux/actions/category'

//装饰器语法
@connect(
  state => ({}),
  {saveCategoryInfo}
)
class Category extends Component {
  //初始化状态
  state = {
    categoryList:[],//商品分类列表
    isVisible:false,//控制弹窗的展示或隐藏
    operType:'',//操作类型（新增还是修改）
    isLoading:true,//是否处于加载中
    modalCurrentValue:'',//弹窗显示值-----用于数据回显
    modalCurrentId:''
  }
  //生命周期钩子
  componentDidMount(){
    this.getReqCategory()
  }
  //获取商品分类请求
  getReqCategory = async()=>{
    let result = await reqCategoryList()
    this.setState({isLoading:false})
    const {status,data,msg} = result
    if(status===0){
        this.setState({categoryList:data.reverse()})
        //将商品分类信息存入redux中
        this.props.saveCategoryInfo(data.reverse())
    }else{
      message.error(msg,1)
    }
  }
  //Modal框的可见性
  //是否是新增分类
  showAdd = () => {
    this.setState({
      operType:'add',
      isVisible:true,
      modalCurrentValue:'',
      modalCurrentId:''
    },()=>{this.form.resetFields()})//重置表单
}
  //是否是修改分类
  showUpdate = (item) => {
    const {name,_id} = item
    this.setState({
      modalCurrentValue:name,
      modalCurrentId:_id,
      operType:'update',
      isVisible:true, 
    },()=>{this.form.resetFields()}) //重置表单
  }
  //新增分类方法
  toAdd = async(values) => {
    let result= await reqAddCategory(values)
    const {status,data,msg}= result
    if(status===0){
      message.success('新增商品分类成功')
      let newCategoryList = [data,...this.state.categoryList]
      this.setState({categoryList:newCategoryList})
      this.form.resetFields()//重置表单
      this.setState({isVisible:false})//隐藏弹窗  
    }
    else{
      message.warning(msg,1)
    }
  }
  //修改分类方法
  toUpdate = async(id,name) => {
    let result = await reqUpdateCategory(id,name)
    const {status,msg} = result
    if(status===0){
      this.getReqCategory()
      this.form.resetFields()//重置表单
      this.setState({isVisible:false})//隐藏弹窗
      message.success('修改成功',1)
    }else{
      message.error(msg,1)
    }
  }
  //点击弹窗Ok成功的回调
  handleOk = () => {
    this.form.validateFields().then((values) => {
      const {operType,modalCurrentId} = this.state
      if(operType==='add') this.toAdd(values.categoryName)
      if(operType==='update') this.toUpdate(modalCurrentId,values.categoryName)
    }).catch(err=>{
      if(err) {
        message.warning('表单输入有误，请检查',1)
        return
      }
    })
  }
  //点击弹窗cancel成功的回调
  handleCancel = () => {
    this.form.resetFields()//重置表单
    this.setState({isVisible:false})
  }


    render() {
          const dataSource =this.state.categoryList
          const columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '操作',
              //dataIndex: 'operate',
              key: 'operate',
              render:(item)=>{return <Button type='link' onClick={()=>{this.showUpdate(item)}}>修改分类</Button>},//这个render可以接受参数，参数的值为：dataIndex，
              //如果不写dataIndex，就把整个对象传过去
              width:'25%',
              align:'center'
            }
          ];
        return (
          <div>
            <Card 
             extra={<Button type='primary' onClick={this.showAdd}><PlusCircleOutlined />添加</Button>}>,
                <Table 
                  dataSource={dataSource} 
                  columns={columns} 
                  bordered={true} 
                  rowKey='_id'
                  pagination={{pageSize:PAGE_SIZE,showQuickJumper:true}}
                  loading={this.state.isLoading}
                />                  
            </Card>
            <Modal 
              title={this.state.operType==='add'?'新增分类':'修改分类'}
              okText='确定'
              cancelText='取消'
              visible={this.state.isVisible} 
              onOk={this.handleOk} 
              onCancel={this.handleCancel}
            >
              <Form ref={a=>{this.form=a}} initialValues={{categoryName:this.state.modalCurrentValue}}>
                  <Form.Item
                            name="categoryName"
                            rules={[//声明式验证
                                { required: true, message: '分类名必须输入' },//必须输入          
                            ]}            
                  >
                            <Input placeholder='请输入商品分类名' />
                  </Form.Item>
              </Form>      
            </Modal>
          </div>
        )
    }
}
export default Category
