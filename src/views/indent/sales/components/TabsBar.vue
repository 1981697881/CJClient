<template>
  <div class="list-header">
    <el-form v-model="search" :size="'mini'" :label-width="'80px'">
      <el-row :gutter="10">
        <el-col :span="7" >
          <div class="block">
            <span class="demonstration">日期筛选:</span>
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
          </div>
        </el-col>
        <el-col :span="3">
          <div class="block">
            <el-input v-model="search.keyword" placeholder="输入单号查询"/>
          </div>
        </el-col>
        <el-col :span="2">
          <el-button :size="'medium'" type="success" icon="el-icon-search" @click="query">查询</el-button>
        </el-col>
        <el-col :span="2" >
          <el-button :size="'medium'" type="primary" icon="el-icon-plus" @click.native="handleCreate">新增</el-button>
        </el-col>
        <el-col :span="2" >
         <!-- <el-upload
            class="upload-demo"
            ref="upload"

            :auto-upload="false">
            <el-button :size="'medium'" type="primary" icon="el-icon-plus" @click="importorder">导入</el-button>
          </el-upload>-->
          <el-upload
            name="order"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            accept="xlsx,xls"
            :headers="headers"
            :show-file-list="false"
            action="excel/order/import"
            class="upload-demo"
            multiple
            :limit="3"
            >
            <el-button size="medium" type="primary">点击上传</el-button>
          </el-upload>
        </el-col>
        <el-col :span="2" >
          <el-button :size="'medium'" type="primary" icon="el-icon-edit" @click.native="handleAlter">修改</el-button>
        </el-col>
        <el-col :span="2" >
          <el-button :size="'medium'" type="warning" icon="el-icon-delete" @click.native="delSaleOrder">删除</el-button>
        </el-col>
        <el-col :span="2" >
          <el-button :size="'medium'" type="primary" icon="el-icon-edit" @click.native="returnRequest">退货申请</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// ---------------------------  新增客户没做完
import { mapGetters } from "vuex";
import {
    getToken
} from '@/utils/auth'
export default {
    components: {},
    computed: {
        ...mapGetters(["node","clickData","selections"])

    },
  data() {
    return {
        headers:{
            'authorization': getToken('rx'),
        },
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
  methods:{
      handleCreate(){
          this.$emit('showDialog',{
              oid :null,
          })
      },
      uploadError(res){
          this.$message({
              message: res.msg,
              type: "warning"
          });
          this.$emit('uploadList')
      },
      uploadSuccess(res){
          this.$message({
              message: res.msg,
              type: "success"
          });
          this.$emit('uploadList')
      },
      query(){
          this.$emit('queryOrder',{
                query: this.search.keyword || '',
                endDate: this.value[1] || '',
                startDate: this.value[0] || '',
          })
      },
      returnRequest(){
          if (this.clickData.oid) {
              console.log(this.clickData)
              this.$emit('showReturn', {
                  oid : this.clickData.oid,
                  orderId : this.clickData.orderId,
              })
          } else {
              this.$message({
                  message: "无选中行",
                  type: "warning"
              });
          }
      },
      delSaleOrder(){
          if (this.clickData.oid) {
              this.$emit('delOrder',this.clickData.oid)
          } else {
              this.$message({
                  message: "无选中行",
                  type: "warning"
              });
          }
      },
      handleAlter(){
        if (this.clickData.oid) {
            this.$emit('showDialog',{
                oid : this.clickData.oid,
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
