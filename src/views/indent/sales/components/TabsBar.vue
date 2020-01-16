<template>
  <div class="list-header">
    <el-form v-model="search" :size="'mini'" :label-width="'80px'">
      <el-row :gutter="12">
        <el-col :span="7">
          <el-form-item :label="'日期'">
            <el-date-picker
              v-model="value"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item :label="'单号'">
            <el-input v-model="search.keyword" placeholder="输入单号查询"/>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button :size="'mini'" type="success" icon="el-icon-search" @click="query">查询</el-button>
        </el-col>
        <el-col :span="2">
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
          <el-button :size="'mini'" type="warning" icon="el-icon-delete" @click.native="delSaleOrder">删除</el-button>
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
        <el-radio v-model="plas"  border size="medium" v-for="t in plaArray"
                  :label="t.plaId"
                >{{t.platformName}}</el-radio>
      </div>
      <div slot="footer" style="text-align:center;padding-top:15px;">
        <el-button type="success" @click="handleAdd">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

    import {mapGetters} from "vuex";
    import {getPlas} from "@/api/indent/sales";
    import {
        getToken
    } from '@/utils/auth'

    export default {
        components: {},
        computed: {
            ...mapGetters(["node", "clickData", "selections"])

        },
        data() {
            return {
                headers: {
                    'authorization': getToken('rx'),
                },
                fileData:{
                    plaId:null
                },
                plas: null,
                plaArray:[],
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
        methods: {
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
                    this.visible = true;
                }

            },
            submitUpload(){
                this.$refs.upload.submit();
                this.visible = false;
            },
            handleAdd() {
                if(this.isUpload){
                    this.fileData.plaId = this.plas
                    this.submitUpload()
                    this.visible = false;
                }else{
                    this.$emit('showDialog', {
                        oid: null,
                        plas: this.plas
                    })
                    this.visible = false;
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
            query() {
                this.$emit('queryOrder', {
                    query: this.search.keyword || '',
                    endDate: this.value[1] || '',
                    startDate: this.value[0] || '',
                })
            },
            returnRequest() {
                if (this.clickData.oid) {
                    console.log(this.clickData)
                    this.$emit('showReturn', {
                        oid: this.clickData.oid,
                        orderId: this.clickData.orderId,
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
                    this.$emit('delOrder', this.clickData.oid)
                } else {
                    this.$message({
                        message: "无选中行",
                        type: "warning"
                    });
                }
            },
            handleAlter() {
                if (this.clickData.oid) {
                    this.$emit('showDialog', {
                        oid: this.clickData.oid,
                        plas: this.clickData.plaId,
                        orderId:this.clickData.orderId,
                        createTime:this.clickData.createTime
                    })
                } else {
                    this.$message({
                        message: "无选中行",
                        type: "warning"
                    });
                }

            },
        }
    };
</script>

<style>
</style>
