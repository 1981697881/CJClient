<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" :size="'mini'">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'reOdId'">
            <el-input v-model="form.reOdId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'oid'">
            <el-input v-model="form.oid"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'源订单号'">
            <el-input v-model="form.orderId" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-button :size="'mini'" type="success" icon="el-icon-search" @click="queryOrder" :disabled="disabled">查询
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="退货原因" prop="reason">
            <el-input type="textarea" v-model="form.reason"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" style="text-align: center">
          <el-upload
            action="#"
            list-type="picture-card"
            accept="png,jpg,jpeg"
            :headers="headers"
            :data="imgData"
            :limit="5"
            :http-request="uploadFile"
            name="imgS"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :auto-upload="false"
            :class="{hide:hideUpload}"
            :on-preview="handlePictureCardPreview"
            :on-change="handleChange"
            :file-list="fileList"
            ref="upload"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-table class="list-main" :height="'250px'" :data="list" border size="mini"
                    :highlight-current-row="true">
            <el-table-column prop="date" label="序号" type="index" sortable></el-table-column>
            <el-table-column
              v-for="(t,i) in columns1"
              :key="i"
              align="center"
              :prop="t.name"
              v-if="t.default!=undefined?t.default:true"
              :label="t.text"
              :width="t.width?t.width:''"
            ></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native="handleAdd(scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-table class="list-main" :height="'250px'" :data="tList" border size="mini"
                    :highlight-current-row="true">
            <el-table-column prop="date" label="序号" type="index" sortable></el-table-column>
            <el-table-column
              v-for="(t,i) in columns2"
              :key="i"
              align="center"
              :prop="t.name"
              v-if="t.default!=undefined?t.default:true"
              :label="t.text"
              :width="t.width?t.width:''"
            ></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index,tList)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      :visible.sync="visible"
      title="退货信息"
      v-if="visible"
      :width="'30%'"
      destroy-on-close
      append-to-body
    >
      <el-form>
        <el-row :gutter="20" type="flex" justify="center">
          <el-col :span="12">
            <el-form-item :label="'退货数量'">
              <el-input-number v-model="num1" @change="handleChange" :min="0" :max='max' label="描述文字"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align:center">
        <el-button type="primary" @click.native="saveNum">确定</el-button>
      </div>
    </el-dialog>
    <div slot="footer" style="text-align:center;padding-top:15px;">
      <el-button type="primary" @click="saveData('form')">保存</el-button>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    import {
        getToken
    } from '@/utils/auth'
    import {getSaleOrder} from "@/api/indent/sales";
    import {saveReturn, getReturnOrder, alterReturn,uploadImgs} from "@/api/indent/returns";
    import List from "@/components/List";

    export default {
        components: {
            List
        },
        props: {
            oid: {
                type: Number,
                default: null
            },
            reOdId: {
                type: Number,
                default: null
            },
            orderId: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                headers:{
                    'authorization': getToken('rx'),
                },
                imgData:{
                    ro_id :null
                },
                hideUpload: false,
                dialogImageUrl: '',
                dialogVisible: false,
                visible: null,
                disabled: false,
                tVisible: null,
                num1: 1,
                formDate:'',
                fileList:[],
                limitCount:5,
                max: 0,
                form: {
                    oid: null,
                    reOdId: null,
                    orderId: null,
                    name: null, // 客户名称
                    reason: null, // 客户编号
                },
                rules: {
                    reason: [
                        {required: true, message: '请输入退货原因', trigger: 'blur'},
                    ],
                },
                loading: false,
                list: [],
                tList: [],
                type: null,
                columns1: [
                    {text: "gid", name: "gid"},
                    {text: "商品名称", name: "goodCode"},
                    {text: "编码", name: "goodName"},
                    {text: "型号", name: "contact"},
                    {text: "计量单位", name: "phone"},
                    {text: "数量", name: "num"},
                    {text: "单价", name: "phone"},
                ],
                columns2: [
                    {text: "shopId", name: "shopId"},
                    {text: "商品名称", name: "name"},
                    {text: "数量", name: "number"},
                ],
            };
        },
        created() {

        },
        mounted() {
            this.form.reOdId = this.reOdId
            this.form.oid = this.oid
            this.form.orderId = this.orderId
            //this.tableData();
            //订单页面进入
            if (typeof (this.orderId) != undefined && this.orderId != null) {
                this.tableData(this.form.orderId);
            }
            //退货修改
            if (typeof (this.reOdId) != undefined && this.reOdId != null) {
                this.fetchData(this.form.reOdId);
            }
        },
        methods: {
            uploadFile(file){
                this.formDate.append('imgS', file.file);
            },
            //批量上传图片
            submitUpload(val) {
                this.formDate = new FormData();
                this.$refs.upload.submit();
                this.formDate.append('ro_id', val);
                let config = {
                    headers: {
                        'authorization': getToken('rx'),
                        'Content-Type': 'multipart/form-data'
                    }
                }
                axios.post("/file/returnOrder/imgUpload", this.formDate,config).then( res => {
                    console.log(res)
                }).catch( res => {
                    console.log(res)
                })

            },
            //添加数量->待确认区
            saveNum() {
                if (this.num1 > 0) {
                    this.$set(this.obj, 'number', this.num1);
                    this.$set(this.obj, 'shopId', this.obj.gid);
                    var tList = this.tList,
                        number = 0,
                        obj = this.obj;
                    //判断添加到待确认的数据是否重复
                    for (var i in tList) {
                        //判断id是否== 是数量加 否添加添加一行
                        if (obj['gid'] == tList[i]['shopId']) {
                            console.log(parseFloat(tList[i].number) + parseFloat(obj['number']))
                            this.$set(tList, i, {
                                ...tList[i],
                                number: parseFloat(tList[i].number) + parseFloat(obj['number'])
                            });
                            number++;
                            break;
                        }
                    }
                    //false
                    if (number == 0) {
                        //查询窗口插入数据
                        this.tList.push(obj)
                    }
                    //数量添加后 数量输入框还原默认1
                    this.num1 = 1;
                    this.visible = false;
                } else {
                    return this.$message({
                        message: "不可超出可退数",
                        type: "warning"
                    });
                }

            },
            uploadError(res){
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
                this.$emit('uploadList')
            },
            uploadSuccess(res){
                console.log(123)
                this.$message({
                    message: res.msg,
                    type: "success"
                });
                this.$emit('uploadList')
            },
            handleRemove(file, fileList) {
                this.loading = true;
                alterCommodity({
                    gid:this.imgData.gid,
                    img:''
                }).then(res => {
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });
                    if(res.flag){
                        this.hideUpload = fileList.length >= this.limitCount;
                        this.$emit('uploadList')
                        this.loading = false;
                        this.visible=false;
                    }
                });
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleChange(file, fileList) {
                this.hideUpload = fileList.length >= this.limitCount;
            },
            //删除带确认区 单行删除
            deleteRow(index, rows) {
                rows.splice(index, 1);
            },
            handleBack() {
                this.visible = true;
            },
            //添加退货
            handleAdd(val) {
                this.obj = JSON.parse(JSON.stringify(val))
                this.visible = true
                var list = this.tList;
                if (list.length == 0) {
                    this.max = this.obj['num']
                } else {
                    //控制数量输入最大限度
                    for (var i in list) {
                        if (list[i]['shopId'] == this.obj['gid']) {
                            this.max = parseInt(this.obj['num']) - parseInt(list[i]['number'])
                        }
                    }
                }
            },
            //保存退货单
            saveData(form) {
                this.$refs[form].validate((valid) => {
                    //判断必填项
                    if (valid) {
                        let list = this.tList,
                            obj = {},
                            array = [];
                        if (list.length > 0) {
                            for (const i in list) {
                                var jbj = {}
                                jbj.shopId = list[i].shopId
                                jbj.number = list[i].number
                                array.push(jbj)
                            }
                            //判断修改或新增
                            if (typeof (this.reOdId) != undefined && this.reOdId != null) {
                                obj.order = {
                                    orderId: this.form.oid,
                                    reason: this.form.reason,
                                    reOdId: this.form.reOdId
                                }
                                obj.returnOrders = array
                                alterReturn(obj).then(res => {
                                    this.$emit('hideDialog', false)
                                    this.$emit('uploadList')
                                });
                            } else {
                                obj.order = {
                                    orderId: this.form.oid,
                                    reason: this.form.reason
                                }
                                obj.returnOrders = array
                                saveReturn(obj).then(res => {
                                    if(res.flag){
                                        this.submitUpload(res.data['reOdId'])
                                        this.$emit('hideDialog', false)
                                        this.$emit('uploadList')
                                    }
                                })
                            }
                        } else {
                            return this.$message({
                                message: "无退货商品",
                                type: "warning"
                            })
                        }
                    } else {
                        return false;
                    }
                });
            },
            //查询
            queryOrder() {
                this.tableData(this.form.orderId)
            },
            tableData(orderNum) {
                getSaleOrder(orderNum).then(res => {
                    this.list = res.data
                })
            },
            fetchData(val) {
                getReturnOrder(val).then(res => {
                    console.log(res)
                    this.disabled = true;
                    this.tableData(res.data['sourceOrderNum']);
                    this.form.orderId = res.data['sourceOrderNum'];
                    this.form.oid = res.data.order['orderId'];
                    this.tList = res.data['returnOrders']
                })
            },
        }
    };
</script>

<style lang="scss" >
  .hide .el-upload--picture-card {
    display: none;
  }
</style>
