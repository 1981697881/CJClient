<template>
  <div class="list-header">
    <el-form v-model="search" :size="'mini'" :label-width="'80px'">
      <el-row :gutter="10">
        <el-col :span="7" >
          <div class="block">
            <span class="demonstration">日期筛选:</span>
            <el-date-picker
              v-model="value4"
              type="datetimerange"
              :picker-options="pickerOptions2"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="2">
          <el-button :size="'medium'" type="success" icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="2" >
          <el-button :size="'medium'" type="primary" icon="el-icon-plus" @click.native="handleTab">新增</el-button>
        </el-col>
        <el-col :span="2" >
          <el-button :size="'medium'" type="primary" icon="el-icon-edit" @click.native="handleTab">修改</el-button>
        </el-col>
        <el-col :span="2" >
          <el-button :size="'medium'" type="warning" icon="el-icon-delete" @click.native="handleTab">删除</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// ---------------------------  新增客户没做完

import { mapGetters } from "vuex";
export default {
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
  computed: {
    ...mapGetters(["node"])
  },
  methods:{
    handleTab(node){
        this.$emit('showDialog')
    }
  }
};
</script>

<style>
</style>
