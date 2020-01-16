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
import { returnsList,delReturnOrder} from "@/api/indent/returns";
import List from "@/components/List";

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
          { text: "退货单号", name: "returnOrderNum" },
          { text: "申请时间", name: "createTime" },
          { text: "退货原因", name: "reason" },
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
  methods: {
    //监听每页显示几条
    handleSize(val) {
        this.list.size = val
        this.fetchData(this.node.data.fid,this.node.data.type);
    },
      //监听当前页
      handleCurrent(val) {
          this.list.current = val;
          this.fetchData(this.node.data.fid,this.node.data.type);
    },
      //监听单击某一行
      rowClick(obj) {
          this.$store.dispatch("list/setClickData", obj.row);
      },
    dblclick(obj) {

      this.$emit('showDialog',obj.row)
    },
    fetchData() {
      this.loading = true;
      const data = {
      /*  fid: fid,
        type: type,*/
        pageNum: this.list.current || 1,
        pageSize: this.list.size || 50
      };
        returnsList(data).then(res => {
        this.loading = false;
        if(res.flag&&res.data!=null){
            this.list = res.data;
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
};
</script>

<style lang="scss" scoped>
.list-main {
  height: calc(100vh - 300px);
}
</style>
