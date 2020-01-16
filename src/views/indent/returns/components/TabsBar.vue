<template>
  <div class="list-header">
    <el-form v-model="search" :size="'mini'" :label-width="'80px'">
      <el-row :gutter="10">
        <el-col :span="7">
        <el-form-item :label="'日期'">
            <el-date-picker
              v-model="value4"
              type="datetimerange"
              :picker-options="pickerOptions2"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
        </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button :size="'mini'" type="success" icon="el-icon-search">查询</el-button>
        </el-col>
          <el-button-group style="float:right">

            <el-button :size="'mini'" type="primary" icon="el-icon-plus" @click.native="handleCreate">新增</el-button>
            <el-button :size="'mini'" type="primary" icon="el-icon-edit" @click.native="handleAlter">修改</el-button>
            <el-button :size="'mini'" type="warning" icon="el-icon-delete" @click="delReturnOrder">删除</el-button>
          </el-button-group>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// ---------------------------  新增客户没做完

import { mapGetters } from "vuex";
export default {
    components: {},
    computed: {
        ...mapGetters(["node","clickData","selections"])
    },
  data() {
    return {
      search: {
        name: ""
      },
        pickerOptions2: {
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
        value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        value4: ''
    };
  },
  methods:{
      handleCreate(){
        this.$emit('showDialog',{
            reOdId :null,
        })
    },
      delReturnOrder(){
          if (this.clickData.reOdId) {
              this.$emit('delOrder',this.clickData.reOdId)
          } else {
              this.$message({
                  message: "无选中行",
                  type: "warning"
              });
          }
      },
      handleAlter(){
          if (this.clickData.reOdId) {
              this.$emit('showDialog',this.clickData)
          } else {
              this.$message({
                  message: "无选中行",
                  type: "warning"
              });
          }
      }
  }
};
</script>

<style>
</style>
