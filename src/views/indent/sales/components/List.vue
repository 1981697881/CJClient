<template>
  <div>
    <!-- <el-table :data="list.list" border size="mini" :highlight-current-row="true" @row-dblclick="dblclick">
      <el-table-column prop="date" label="序号" type="index" sortable></el-table-column>
      <el-table-column
        v-for="(t,i) in columns"
        :key="i"
        :prop="t.name"
        :label="t.text"
        :width="t.width?t.width:''"
      ></el-table-column>
    </el-table>
    <div class="text-center" v-if="list.total && list.total!=0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        :page-count="list.pages?list.pages:0"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.total?list.total:0"
      ></el-pagination>
    </div>-->
    <list
      class="list-main box-shadow"
      :columns="columns"
      :loading="loading"
      :list="list"
      index
      show-summary
      @handle-size="handleSize"
      @handle-current="handleCurrent"
      @dblclick="dblclick"
      @row-click="rowClick"
    />

  </div>
</template>

<script>
  import { mapGetters } from "vuex"
  import {delSaleOrder, salesListT, confirmSaleOrder} from "@/api/indent/sales"
  import List from "@/components/List"
  import {getPer} from '@/utils/auth'
    export default {
        components: {
            List
        },
        computed: {
            ...mapGetters(["node"])
        },
        data() {
            return {
                loading: false,
                list: {},
                field: false,
                columns: [
                    {text: "oid", name: "oid", default: false},
                  {text: "日期", name: "createTime", width: '150'},
                  {text: "审核日期", name: "auditTime", width: '150'},
                    {text: "订单单号", name: "orderNum", width: '150'},
                  {text: "购货单位", name: "customer", width: '110'},
                  {text: "物料代码", name: "goodCode", width: '110'},
                  {text: "物料名称", name: "goodName", width: '150'},
                  {text: "规格型号", name: "standard", width: '100'},
                  {text: "单位", name: "unitOfMea", width: '70'},
                  {text: "订单数量", name: "num", width: '70'},
                  {text: "实发数量", name: "actualNum", width: '70'},
                  {text: "退货数量", name: "retNum", width: '70'},
                  {text: "单价", name: "sellPrice", default: false, width: '80' },
                  {text: "金额", name: "totalPrice", default: false, width: '80' },
                  {text: "发货仓库", name: "plaName", width: '80'},
                  {text: "备注", name: "remark", width: '120'},
                  { text: "审核人", name: "auditor", width: '80' },
                  {text: "审核状态", name: "auditStatus", width: '80'},
                  {text: "状态", name: "status", width: '80'},
                  {text: "审核反馈", name: "reasonOfDis", width: '100'},
                ]
            };
        },
      created() {
          //判断价格权限
        if(unescape(getPer('clper').replace(/\\u/gi, '%u')) === '价格') {
          for(let i in this.columns) {
              if(this.columns[i].name == 'sellPrice' || this.columns[i].name == 'totalPrice') {
                this.columns[i].default = true
              }
          }
        }
      },
        methods: {
            //监听每页显示几条
            handleSize(val) {
                this.list.size = val
              this.$emit('uploadList')
            },
            //监听当前页
            handleCurrent(val) {
                this.list.current = val;
              this.$emit('uploadList')
            },
            dblclick(obj) {
              if(obj.row.auditStatus == '已审核'){
                const data = {
                  oid: obj.row.oid,
                  plas: obj.row.plas,
                  customerCode: obj.row.customerCode,
                  customer: obj.row.customer,
                  orderId: obj.row.orderNum,
                  createTime: obj.row.addTime,
                  remark: obj.row.remark,
                  isAdd: false
                }
                this.$emit('showDialog', data)
              }else{
                const data = {
                  oid: obj.row.oid,
                  plas: obj.row.plas,
                  customerCode: obj.row.customerCode,
                  customer: obj.row.customer,
                  orderId: obj.row.orderNum,
                  createTime: obj.row.addTime,
                  remark: obj.row.remark,
                }
                this.$emit('showDialog', data)

              }

            },
            //监听单击某一行
            rowClick(obj) {
                this.$store.dispatch("list/setClickData", obj.row);
            },
          open(val) {
            this.$confirm('是否删除' + val.orderNum + '整张单据，删除后将无法恢复?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.loading = true;
              delSaleOrder(val.oid).then(res => {
                this.loading = false;
                if(res.flag) {
                  this.fetchData(val.plaId);
                }
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          },
            delOrder(val) {
              this.open(val)
            },
          confirmOrder(val, id) {
            this.loading = true
            confirmSaleOrder(val).then(res => {
              this.loading = false
              if(res.flag) {
                this.fetchData(id)
              }
            });
          },
          uploadPr(val) {
            this.fetchData(val, {
              pageNum: 1,
              pageSize: this.list.size || 50
            })
          },
            fetchData(val, data = {
              pageNum: this.list.current || 1,
              pageSize: this.list.size || 50
            }) {
                this.loading = true
               /* const query = {
                    query: typeof (val) == "undefined" ? '' : val.query,
                    endDate: typeof (val) == "undefined" ? '' : val.endDate,
                    startDate: typeof (val) == "undefined" ? '' : val.startDate
                }*/
              salesListT(data, val).then(res => {
                    this.loading = false
                    if(res.flag && res.data != null) {
                      let record = res.data.records
                      let obj = []
                        for(const i in record) {
                          for(const a in record[i].orderDetails) {
                            record[i].orderDetails[a].oid = record[i].oid
                            record[i].orderDetails[a].addTime = record[i].createTime
                            record[i].orderDetails[a].plas = record[i].plaId
                            record[i].orderDetails[a].plaName = record[i].plaName
                            record[i].orderDetails[a].customer = record[i].customer
                            record[i].orderDetails[a].auditor = record[i].auditor
                            record[i].orderDetails[a].auditTime = record[i].auditTime
                            record[i].orderDetails[a].customerCode = record[i].customerCode
                            record[i].orderDetails[a].auditStatus = record[i].auditStatus
                            record[i].orderDetails[a].reasonOfDis = record[i].reasonOfDis
                            record[i].orderDetails[a].remark = record[i].remark
                            obj.push(record[i].orderDetails[a])
                          }
                        }
                      this.list= {
                        current: res.data.current,
                        pages: res.data.pages,
                        size: res.data.size,
                        total: res.data.total,
                        records: obj
                      }
                        console.log(this.list)
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
  .list-main {
    height: calc(100vh - 300px);
  }
</style>
