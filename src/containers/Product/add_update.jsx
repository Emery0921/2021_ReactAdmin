import React, { Component ,Fragment} from 'react'
import {connect} from 'react-redux'
import {Button, Card, Form, Input, message, Select} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {reqCategoryList,reqAddProduct,reqProdById,reqUpdateProduct} from '../../api'
import PicturesWall from './picture_wall'
import RichTextEditor from './rich_text_editor';


const {Option} = Select;


//装饰器语法
@connect(
    state=>({
        categoryInfo:state.saveCategoryInfo,
        productInfo:state.saveProdInfo
    }),
    {}
)
class AddUpdate extends Component {
    state = {
        categoryList: [], //商品分类的列表
        categoryId: '',//分类的id
        name: '',//商品名称
        desc: '',//商品描述
        price: '',//商品价格
        detail: '',//商品详情
        imgs: [], //图片
        _id:'',
        operaType:'add'//新增或修改
    }
    componentDidMount(){
        const {categoryInfo,productInfo} = this.props
        const {id} =this.props.match.params
        if(categoryInfo.length){
            this.setState({categoryList:categoryInfo})
        }else this.getCategoryList()
        if(id)  {
            this.setState({operaType:'update'})
            if(productInfo.length){
                let result= productInfo.find(item => {
                    return item._id===id
                })
                if(result) {
                    this.setState({...result},()=>{this.form.resetFields()})
                    this.picture.setFileList(result.imgs)
                    this.richText.setRichText(result.detail)
                }
            }else this.getProdById(id)
        }
    }
    //根据Id获取商品
    getProdById = async(id) => {
        let result = await reqProdById(id)
        console.log(result)
        const {status,data,msg} = result
        if(status===0) {
            this.setState({...data},()=>{this.form.resetFields()})
            this.picture.setFileList(data.imgs)
            this.richText.setRichText(data.detail)
        }
        else message.warning(msg,1)
    }
    //获取商品分类列表
    getCategoryList = async() => {
        let result = await reqCategoryList()
        const {status,data,msg} = result
        if(status===0) this.setState({categoryList:data})
        else message.warning(msg,1)
    }
    //表单提交的回调
    handleFinish = () => {
        //从上传组件中获取已经上传的图片数组
        let imgs=this.picture.getImgsArr()
        //从富文本组件中获取用户输入的文字转换为富文本的字符串
        let detail =this.richText.getRichText()
        const {operaType,_id} = this.state
        this.form.validateFields()//表单的统一验证
        .then(async response => {
            let result
            if(operaType==='add'){
                result = await reqAddProduct({...response,imgs,detail})
            }else{
                result= await reqUpdateProduct({...response,imgs,detail,_id})
            }
            const {status,msg} = result
            if(status ===0){
                this.props.history.replace('/admin/prod_about/product')
                message.success('操作成功')
            }else message.warning(msg,1)
        })
        .catch(error=> console.log(error)) 
    }
    render() {
        const {operaType, name, desc, price, categoryId,categoryList} = this.state
        console.log(name,price)
        return (
            <Fragment>
                <Card title={
                    <Fragment>
                        <ArrowLeftOutlined style={{marginRight: '20px', color: '#1DA57A'}} onClick={() => {
                            this.props.history.goBack()
                        }}/>
                        {operaType==='add'?'商品添加':'商品修改'}
                    </Fragment>
                }>
                    <Form labelCol={{md: 2}} wrapperCol={{md: 7}} onFinish={this.handleFinish} ref={a=>this.form=a}>
                        <Form.Item label="商品名称" name="name"
                                   initialValue={name || ''}
                                   rules={[{required: true, whitespace: true, message: '请输入商品名称'}]}>
                            <Input autoComplete="off" placeholder="请输入商品名称"/>
                        </Form.Item>
                        <Form.Item label="商品描述" name="desc"
                                   initialValue={desc || ''}
                                   rules={[{required: true, whitespace: true, message: '请输入商品描述'}]}>
                            <Input autoComplete="off" placeholder="请输入商品描述"/>
                        </Form.Item>
                        <Form.Item label="商品价格" name="price"
                                   initialValue={price || ''}
                                   rules={[{required: true, message: '请输入商品价格'}]}>
                            <Input type="number" autoComplete="off" addonBefore="￥" addonAfter="元"
                                   placeholder="请输入商品价格，必须是数值"/>
                        </Form.Item>
                        <Form.Item label="商品分类" name="categoryId"
                                   initialValue={categoryId || ''}
                                   rules={[{required: true, message: '请选择商品分类'}]}>
                            <Select allowClear placeholder={"请选择商品分类"}>
                                {
                                    categoryList.map(category => (
                                        <Option key={category._id} value={category._id}>{category.name}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="商品图片" wrapperCol={{md: 12}}>
                            {/* <PicturesWall ref={this.picturesWall}/> */}
                            <PicturesWall ref={a=>this.picture=a}/>
                        </Form.Item>
                        <Form.Item label="商品详情" wrapperCol={{md: 16}}>
                           {/*  <RichTextEditor ref={this.richTextEditor}/> */}
                           <RichTextEditor ref={a=>this.richText=a}/>
                        </Form.Item>
                        <Form.Item wrapperCol={{offset: 8}}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Fragment>
        );
    }       
}
export default AddUpdate

