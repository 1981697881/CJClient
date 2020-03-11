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
      @handle-size="handleSize"
      @handle-current="handleCurrent"
      @dblclick="dblclick"
      @row-click="rowClick"
    />

  </div>
</template>

<script>
  import { mapGetters } from "vuex"
  import {delSaleOrder, salesListT} from "@/api/indent/sales"
  import List from "@/components/List"
  import {
    getPer
  } from '@/utils/auth'
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
                  {text: "日期", name: "createTime"},
                    {text: "订单单号", name: "orderNum"},
                  {text: "购货单位", name: "customer"},
                  {text: "物料代码", name: "goodCode"},
                  {text: "物料名称", name: "goodName"},
                  {text: "规格型号", name: "standard"},
                  {text: "单位", name: "unitOfMea"},
                  {text: "订单数量", name: "num"},
                  {text: "实发数量", name: "actualNum"},
                  {text: "单价", name: "sellPrice", default: false },
                    {text: "金额", name: "totalPrice", default: false },
                  {text: "发货仓库", name: "plaName"},
                  {text: "商品图片", name: "img"},
                    {text: "审核状态", name: "auditStatus"},
                    //{text: "状态", name: "status"},
                ]
            };
        },
      created() {
          //判断价格权限
        if(unescape(getPer('per').replace(/\\u/gi, '%u')) === '价格') {
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
                this.fetchData();
            },
            //监听当前页
            handleCurrent(val) {
                this.list.current = val;
                this.fetchData();
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
                }
                this.$emit('showDialog', data)

              }

            },
            //监听单击某一行
            rowClick(obj) {
                this.$store.dispatch("list/setClickData", obj.row);
            },
            delOrder(val) {
                this.loading = true;
                delSaleOrder(val).then(res => {
                    if(res.flag){
                      this.loading = false;
                      this.fetchData();
                    }
                });
            },
            fetchData(val) {
                this.loading = true
                const data = {
                    /*  fid: fid,
                      type: type,*/
                    pageNum: this.list.current || 1,
                    pageSize: this.list.size || 50
                }
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
                            record[i].orderDetails[a].customerCode = record[i].customerCode
                            record[i].orderDetails[a].auditStatus = record[i].auditStatus
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
