<template>
  <div class="list-header">
    <el-form v-model="search" :size="'mini'" :label-width="'60px'">
      <el-row :gutter="12">
        <el-col :span="6.5">
          <el-form-item :label="'日期'">
            <el-date-picker
              v-model="value"
              type="daterange"
              align="right"
              class="input-class"
              unlink-panels
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item :label="'关键字'">
            <el-input v-model="search.keyword" placeholder="输入关键字查询"/>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button :size="'mini'" type="success" icon="el-icon-search" @click="query">查询</el-button>
        </el-col>
        <el-col :span="4">
          <el-form-item :label="'平台'" prop="plaIdS">
            <el-select v-model="plaIdS"  placeholder="请选择" @change="selectChange">
              <el-option
                v-for="(t,i) in plaArray2"
                :key="i"
                :label="t.platformName"
                :value="t.plaId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-upload
            name="order"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            accept="xlsx,xls"
            ref="upload"
            :data="fileData"
            :headers="headers"
            :show-file-list="false"
            action="web/excel/order/import"
            class="upload-demo"
            multiple
            :auto-upload="false"
            :on-change="handleUpload"
            :limit="3"
          >
            <el-button size="mini" type="primary"  >点击上传</el-button>
            <el-button style="margin-left: 10px;display: none" size="mini" type="success" @click="submitUpload">上传到服务器</el-button>
          </el-upload>
        </el-col>
        <el-button-group style="float:right">
          <el-button :size="'mini'" type="primary" icon="el-icon-plus" @click.native="handleCreate">新增</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-edit" @click.native="handleAlter">修改</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-check" @click.native="handleConfirm">单据确认</el-button>
          <el-button :size="'mini'" type="warning" icon="el-icon-delete" @click.native="delSaleOrder">删除</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-refresh" @click.native="upload">刷新</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-download" @click="exportOrder">导出</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-edit" @click.native="returnRequest">退货申请</el-button>
        </el-button-group>
      </el-row>
    </el-form>
    <el-dialog
      :visible.sync="visible"
      title="选择"
      v-if="visible"
      :width="'30%'"
      destroy-on-close
    >
      <div style="text-align: center" >
        <el-radio v-model="plas"  border size="medium" v-for="(t,i) in plaArray" :label="t.plaId" :key="i">{{t.platformName}}</el-radio>
      </div>
      <div slot="footer" style="text-align:center;padding-top:15px;">
        <el-button type="success" @click="handleAdd">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import {getPlas, exportData} from "@/api/indent/sales"
  import {getToken} from '@/utils/auth'
  export default {
    components: {},
    computed: {
      ...mapGetters(["node", "clickData", "selections"])

    },
    data() {
            return {
                headers: {
                    'authorization': getToken('clrx'),
                },
                fileData:{
                    plaId:null
                },
              flag: true,
                plas: null,
                plaArray:[],
              plaIdS: null,
              plaArray2:[],
                visible: false,
                isUpload:null,
                search: {
                    keyword: null,
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value: ''
            };
        },
    mounted() {
      this.fetchFormat()
    },
    created() {
      document.addEventListener('keydown', this.handleKeyDown)
      document.addEventListener('keyup', this.handleKeyUp)
    },destroyed() {
      document.removeEventListener('keydown', this.handleKeyDown)
      document.removeEventListener('keyup', this.handleKeyUp)
    },
        methods: {
          handleKeyDown(e) {
            var key = window.event.keyCode ? window.event.keyCode : window.event.which
            if( key === 13 ) {
              if(this.flag) {
                this.$emit('queryOrder', this.qFilter())
                this.flag = false
              }
              e.preventDefault() //取消浏览器原有的ctrl+s操作
            }
          },
          handleKeyUp(e) {
            // enter
            var key = window.event.keyCode ? window.event.keyCode : window.event.which
            if( key === 13 ){
              this.flag = true
              e.preventDefault()
            }
          },
          getPlaId() {
            return {plaId: this.plaIdS}
          },
          fetchFormat() {
            getPlas().then(res => {
              if(res.flag) {
                this.plaArray2 = res.data
                this.plaIdS = res.data[0].plaId
                this.$emit('uploadList', {plaId: res.data[0].plaId})
              }
            });
          },
          selectChange(val) {
            this.$emit('queryOrder', {plaId: val, query: this.search.keyword })
          },
            handleCreate() {
                this.isUpload = false
                getPlas().then(res => {
                    this.plaArray = res.data;
                    this.plas = res.data[0].plaId;
                });
                this.visible = true;
                /*this.$emit('showDialog',{
                    oid :null,
                })*/
            },
            handleUpload(file, fileList){
                if(file.status=="ready"){
                    this.isUpload = true
                    getPlas().then(res => {
                        this.plaArray = res.data;
                        this.plas = res.data[0].plaId;
                    });
                    this.visible = true
                }

            },
            submitUpload() {
                this.$refs.upload.submit()
                this.visible = false
            },
            handleAdd() {
                if(this.isUpload){
                    this.fileData.plaId = this.plas
                    this.submitUpload()
                    this.visible = false
                }else{
                    this.$emit('showDialog', {
                        oid: null,
                        plas: this.plas
                    })
                    this.visible = false
                }

            },
            uploadError(res) {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });

                this.$emit('uploadList')

            },
            uploadSuccess(res) {
                if(res.flag){
                    this.$message({
                        message: res.msg,
                        type: "success"
                    });

                    this.$emit('uploadList')
                }else{
                    this.$message({
                        message: res.msg,
                        type: "warning"
                    });
                }
            },
          upload() {
            this.search.keyword = ''
            this.value = ''
            this.$emit('uploadList', {plaId: this.plaIdS})
          },
            query() {
                this.$emit('queryOrder', this.qFilter())
            },
          // 查询条件过滤
          qFilter() {
            let obj = {}
            this.search.keyword != null || this.search.keyword != undefined ? obj.query = this.search.keyword : null
            this.value[1] != null || this.value[1] != undefined ? obj.endDate = this.value[1] : null
            this.value[0] != null || this.value[0] != undefined ? obj.startDate = this.value[0] : null
            obj.plaId = this.plaIdS
            return obj
          },
          // 下载文件
          download(res) {
            if (!res.data) {
              return
            }
            let url = window.URL.createObjectURL(new Blob([res.data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', res.headers['content-disposition'].split('filename=')[1])
            document.body.appendChild(link)
            link.click()
          },
          exportOrder() {
            exportData(this.qFilter()).then(res => {
              this.download(res)
            })
          },
            returnRequest() {
                if (this.clickData.oid) {
                    console.log(this.clickData)
                    this.$emit('showReturn', {
                        oid: this.clickData.oid,
                        orderId: this.clickData.orderNum,
                    })
                } else {
                    this.$message({
                        message: "无选中行",
                        type: "warning"
                    });
                }
            },
            delSaleOrder() {
                if (this.clickData.oid) {
                  //if(this.clickData.auditStatus == '未审核') {
                    this.$emit('delOrder', this.clickData)
                 /* } else {
                    this.$message({
                      message: "订单已审核",
                      type: "warning"
                    })
                  }*/
                } else {
                    this.$message({
                        message: "无选中行",
                        type: "warning"
                    });
                }
            },
          handleConfirm() {
            if (this.clickData.oid) {
              this.$emit('confirm',  this.clickData.oid)
            } else {
              this.$message({
                message: "无选中行",
                type: "warning"
              });
            }
          },
            handleAlter() {
                if (this.clickData.oid) {
                  if (this.clickData.auditStatus == '已审核') {
                    this.$emit('showDialog', {
                      oid: this.clickData.oid,
                      plas: this.clickData.plas,
                      customerCode: this.clickData.customerCode,
                      customer: this.clickData.customer,
                      orderId: this.clickData.orderNum,
                      createTime: this.clickData.addTime,
                      remark: this.clickData.remark,
                      isAdd: false
                    })
                  } else {
                    this.$emit('showDialog', {
                      oid: this.clickData.oid,
                      plas: this.clickData.plas,
                      customerCode: this.clickData.customerCode,
                      customer: this.clickData.customer,
                      orderId: this.clickData.orderNum,
                      createTime: this.clickData.addTime,
                      remark: this.clickData.remark
                    })
                  }
                } else {
                    this.$message({
                        message: "无选中行",
                        type: "warning"
                    });
                }

            },
        }
    }
</script>
<style>
</style>
