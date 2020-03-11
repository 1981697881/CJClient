<template>
  <div>
    <list
       class="list-main"
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
import { mapGetters } from "vuex";
import { returnsList, delReturnOrder, returnsListT} from "@/api/indent/returns";
import List from "@/components/List";
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
      type: null,
      columns: [
        { text: "orderId", name: "orderId", default:false},
        { text: "reOdId", name: "reOdId",default:false},
        { text: "退货申请日期", name: "createTime" },
        { text: "原订单单号", name: "sourceOrderNum" },
        { text: "退货单号", name: "orderNum" },
        { text: "购货单位", name: "customer"},
        { text: "物料代码", name: "goodCode" },
        { text: "物料名称", name: "goodName" },
        { text: "规格型号", name: "standard" },
        { text: "单位", name: "unitOfMea" },
        { text: "原单数量", name: "sourceNum" },
        { text: "退货数量", name: "num" },
        { text: "单价", name: "sellPrice", default:false},
        { text: "金额", name: "totalPrice", default:false},
        { text: "发货仓库", name: "plaName" },
        { text: "退货原因", name: "reason" },
        { text: "商品图片", name: "" },
        { text: "状态", name: "isAudit" },
      ]
    };
  },
  /* watch: {
    node(val) {
      console.log(val)
      this.fid = val.data.fid;
      this.type =  val.data.type
      console.log(this.fid)
      console.log(this.type)
      this.fetchData();
    }
  }, */
  created() {
    // 判断价格权限
    if(unescape(getPer('per').replace(/\\u/gi, '%u')) === '价格') {
      for(let i in this.columns) {
        if(this.columns[i].name == 'sellPrice' || this.columns[i].name == 'totalPrice') {
          this.columns[i].default = true
        }
      }
    }
  },
  methods: {
    // 监听每页显示几条
    handleSize(val) {
      this.list.size = val
      this.fetchData();
    },
    // 监听当前页
    handleCurrent(val) {
      this.list.current = val;
      this.fetchData();
    },
    // 监听单击某一行
    rowClick(obj) {
      this.$store.dispatch("list/setClickData", obj.row);
    },
    dblclick(obj) {
      if (obj.row.isAudit == '已审核') {
        obj.row.isAdd = false
        this.$emit('showDialog',obj.row)
      }else{
        this.$emit('showDialog',obj.row)
      }
    },
    fetchData(val) {
      this.loading = true;
      const data = {
      /*  fid: fid,
        type: type,*/
        pageNum: this.list.current || 1,
        pageSize: this.list.size || 50
      }
      returnsListT(data, val).then(res => {
        this.loading = false;
        if(res.flag && res.data != null) {
          let record = res.data.records
          let obj = []
          for(const i in record) {
            for(const a in record[i].returnOrderDetailVOS) {
              record[i].returnOrderDetailVOS[a].image = record[i].img
              record[i].returnOrderDetailVOS[a].reId = record[i].reOdId
              record[i].returnOrderDetailVOS[a].reason = record[i].reason
              record[i].returnOrderDetailVOS[a].sourceOrderNum = record[i].sourceOrderNum
              record[i].returnOrderDetailVOS[a].isAudit = record[i].isAudit
              record[i].returnOrderDetailVOS[a].customer = record[i].customer
              record[i].returnOrderDetailVOS[a].customerCode = record[i].customerCode
              record[i].returnOrderDetailVOS[a].plaName = record[i].plaName
              record[i].returnOrderDetailVOS[a].isAudit = record[i].isAudit
              obj.push(record[i].returnOrderDetailVOS[a])
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
    },
      delOrder(val){
          this.loading = true;
          delReturnOrder(val).then(res => {
              this.loading = false;
          });
      },
  }
}
</script>
<style lang="scss" scoped>
.list-main {
  height: calc(100vh - 300px);
}
</style>
