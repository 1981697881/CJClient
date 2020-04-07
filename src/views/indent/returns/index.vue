<template>
  <div class="app-list">
    <!--<Tree class="list-tree" @handler-node="handlerNode" />-->
    <div class="list-containerOther">
      <div>
        <tabs-bar ref="tabs" @queryOrder="query" @confirm="confirm" @uploadList="upload" @showDialog="handlerDialog" @delOrder="delRequest"/>
      </div>
      <list ref="list" @showDialog="handlerDialog" @uploadList="upload"/>
    </div>
    <el-dialog
      :fullscreen="isfullscreen"
      :visible.sync="visible"
      title="退货信息"
      v-if="visible"
      :width="'70%'"
      destroy-on-close
    >
      <returns @hideDialog="hideWindow" @uploadList="onUpload" :isAdd="isAdd" :reOdId="reOdId" :img="img" :customer="customer" :customerCode="customerCode" @operation="operation"></returns>
    </el-dialog>
  </div>
</template>
<script>
  import {TabsBar, List} from "./components";
  import {Returns} from "./form";

  export default {
    components: {
      TabsBar,
      List,
      Returns
    },
    data() {
      return {
        visible: null,
        fid: null,
        reOdId: null,
        isAdd: null,
        isfullscreen: null,
        img: null,
        customerCode: null,
        customer: null,
        orderId: null,
        treeId: null, // null
        floorId: null
      };
    },
    mounted() {
      //this.$refs.list.fetchData()
    },
    methods: {
      hideWindow(val) {
        this.visible = val
      },
      handlerDialog(obj) {
        if (obj) this.reOdId = obj.reId;
        this.img = obj.image;
        this.isAdd = obj.isAdd;
        this.customerCode = obj.customerCode;
        this.customer = obj.customer
        this.visible = true
        this.$store.dispatch("list/setClickData", '')
      },
      handlerNode(node) {
        this.$refs.list.fetchData(node.data.fid, node.data.type)
      },
      delRequest(val) {
        this.$refs.list.delOrder({reId: val.reId, orderNum: val.orderNum, plaId: this.$refs.tabs.getPlaId()});
      },
      confirm(val) {
        this.$refs.list.confirmOrder(val, this.$refs.tabs.getPlaId());
      },
      //查询
      query(val) {
        this.$refs.list.uploadPr(val)
      },
      //操作窗口
      operation(val) {
        if (val == 1) {
          this.isfullscreen = true
        } else {
          this.isfullscreen = false
        }
      },
      //更新列表
      upload(val = this.$refs.tabs.getPlaId()) {
        this.$refs.list.fetchData(val)
      },
      onUpload() {
        this.$refs.list.fetchData(this.$refs.tabs.getPlaId())
      },
    }
  }
</script>
<style lang="scss" scoped>
</style>
