<template>
  <div class="list-header">
    <el-form v-model="search" :size="'mini'" :label-width="'60px'">
      <el-row :gutter="10">
        <el-col :span="6.5">
          <el-form-item :label="'日期'">
            <el-date-picker
              v-model="value4"
              type="daterange"
              align="right"
              class="input-class"
              unlink-panels
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2">
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
            <el-select v-model="plaIdS" placeholder="请选择" @change="selectChange">
              <el-option
                v-for="(t,i) in plaArray"
                :key="i"
                :label="t.platformName"
                :value="t.plaId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-button-group style="float:right">
          <el-button :size="'mini'" type="primary" icon="el-icon-plus" @click.native="handleCreate">新增</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-edit" @click.native="handleAlter">修改</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-check" @click.native="handleConfirm">单据确认</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-download" @click="exportOrder">导出</el-button>
          <el-button :size="'mini'" type="primary" icon="el-icon-refresh" @click.native="upload">刷新</el-button>
          <el-button :size="'mini'" type="warning" icon="el-icon-delete" @click="delReturnOrder">删除</el-button>
        </el-button-group>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  // ---------------------------  新增客户没做完
  import {mapGetters} from "vuex";
  import {exportData} from "@/api/indent/returns";
  import {getPlas} from "@/api/indent/sales"
  export default {
    components: {},
    computed: {
      ...mapGetters(["node", "clickData", "selections"])
    },
    data() {
      return {
        plaIdS: null,
        flag: true,
        plaArray: [],
        search: {
          keyword: null
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
    mounted() {
      this.fetchFormat();
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
        if( key === 13 ){
          if(this.flag) {
            this.$emit('queryOrder', this.qFilter())
            this.flag = false
          }
          e.preventDefault() // 取消浏览器原有的ctrl+s操作
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
          if (res.flag) {
            this.$emit('uploadList', {plaId: res.data[0].plaId})
            this.plaArray = res.data;
            this.plaIdS = res.data[0].plaId;
          }
        });
      },
      selectChange(val) {
        this.$emit('queryOrder', {plaId: val, query: this.search.keyword})
      },
      handleCreate() {
        this.$emit('showDialog', {
          reOdId: null,
        })
      },
      delReturnOrder() {
        if (this.clickData.reId) {
          //if(this.clickData.isAudit == '未审核') {
            this.$emit('delOrder', this.clickData)
         /* } else {
            this.$message({
              message: "该单已审核",
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
        if (this.clickData.reId) {
          this.$emit('confirm', this.clickData.reId)
        } else {
          this.$message({
            message: "无选中行",
            type: "warning"
          })
        }
      },
      upload() {
        this.$emit('uploadList', {plaId: this.plaIdS})
        this.search.keyword = ''
        this.value4 = ''
      },
      query() {
        this.$emit('queryOrder', this.qFilter())
      },
      // 查询条件过滤
      qFilter() {
        let obj = {}
        this.search.keyword != null || this.search.keyword != undefined ? obj.query = this.search.keyword : null
        this.value4[1] != null || this.value4[1] != undefined ? obj.endDate = this.value4[1] : null
        this.value4[0] != null || this.value4[0] != undefined ? obj.startDate = this.value4[0] : null
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
          console.log(res)
          this.download(res)
        })
      },
      handleAlter() {
        if (this.clickData.reId) {
          if (this.clickData.isAudit == '已审核' || this.clickData.isAudit == '已驳回') {
            this.clickData.isAdd = false
            this.$emit('showDialog', this.clickData)
          } else {
            this.$emit('showDialog', this.clickData)
          }
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
