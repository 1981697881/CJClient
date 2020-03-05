<template>
  <div class="app-list">
    <!--<Tree class="list-tree" @handler-node="handlerNode" />-->
    <div class="list-containerOther">
      <div>
        <tabs-bar @queryOrder="query" @uploadList="upload" @showDialog="handlerDialog"  @showReturn="returnRequest" @delOrder="delRequest"/>
      </div>
      <list ref="list" @showDialog="handlerDialog"/>
    </div>
    <el-dialog
      :fullscreen="isfullscreen"
      :visible.sync="visible"
      title="基本信息"
      v-if="visible"
      :width="'70%'"
      destroy-on-close
    >
      <info @hideDialog="hideWindow" @uploadList="upload" :oid="oid" :plas="plas" :isAdd="isAdd" :orderId="orderId" :createTime="createTime" @operation="operation"></info>
    </el-dialog>
    <el-dialog
      :visible.sync="isSh"
      :fullscreen="isrfullscreen"
      title="退货信息"
      v-if="isSh"
      :width="'70%'"
      destroy-on-close
    >
      <returns @hideDialog="hideWindow" @uploadList="upload" :oid="oid"  :orderId="orderId" @operation="rOperation"></returns>
    </el-dialog>
  </div>
</template>

<script>
    import {TabsBar, List} from "./components";
    import {Info} from "./form";
    import {Returns} from "../returns/form";

    export default {
        components: {
            TabsBar,
            List,
            Info,
            Returns
        },
        data() {
            return {
                visible: null,
                isSh: null,
              isAdd: null,
              isfullscreen: null,
              isrfullscreen: null,
                oid: null,
                createTime:null,
                plas:null,
                orderId:null,
                treeId: null, // null
                floorId: null
            };
        },
        mounted() {
            this.$refs.list.fetchData()
        },
        methods: {
            hideWindow(val){
                this.isSh = val
                this.visible = val
            },
            handlerDialog(obj) {
                console.log(obj)
                if (obj) this.oid = obj.oid;this.plas=obj.plas;this.orderId=obj.orderId;this.createTime=obj.createTime;this.isAdd=obj.isAdd;
                this.visible = true
                this.$store.dispatch("list/setClickData", '')
            },
          returnRequest(obj) {
                if (obj) this.oid = obj.oid; this.orderId = obj.orderId
                this.isSh = true
                this.$store.dispatch("list/setClickData", '')
            },
            delRequest(val){
                this.$refs.list.delOrder(val)
                this.$refs.list.fetchData()
            },
            // 查询
            query(val){
                this.$refs.list.fetchData(val)
            },
          // 操作窗口
          operation(val) {
            if(val == 1) {
              this.isfullscreen = true
            }else {
              this.isfullscreen = false
            }
          },
          rOperation(val) {
            if(val == 1) {
              this.isrfullscreen = true
            }else {
              this.isrfullscreen = false
            }
          },
            // 更新列表
            upload() {

                this.$refs.list.fetchData()
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
