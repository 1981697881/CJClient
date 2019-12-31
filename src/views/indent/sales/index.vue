<template>
  <div class="app-list">
    <!--<Tree class="list-tree" @handler-node="handlerNode" />-->
    <div class="list-containerOther">
      <div>
        <tabs-bar @queryOrder="query" @uploadList="upload" @showDialog="handlerDialog" @showReturn="returnRequest" @delOrder="delRequest"/>
      </div>
      <list ref="list" @showDialog="handlerDialog"/>
    </div>
    <el-dialog
      :visible.sync="visible"
      title="基本信息"
      v-if="visible"
      :width="'70%'"
      destroy-on-close
    >
      <info :oid="oid"></info>
    </el-dialog>
    <el-dialog
      :visible.sync="isSh"
      title="退货信息"
      v-if="isSh"
      :width="'70%'"
      destroy-on-close
    >
      <returns @hideDialog="hideWindow" @uploadList="upload" :oid="oid" :orderId="orderId"></returns>
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
                oid: null,
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
                console.log(123)
                this.isSh = val
            },
            handlerDialog(obj) {
                if (obj) this.oid = obj.oid
                this.visible = true
                this.$store.dispatch("list/setClickData", '')
            }, returnRequest(obj) {
                if (obj) this.oid = obj.oid; this.orderId = obj.orderId
                this.isSh = true
                this.$store.dispatch("list/setClickData", '')
            },
            delRequest(val){
                this.$refs.list.delOrder(val)
                this.$refs.list.fetchData()
            },
            //查询
            query(val){
                this.$refs.list.fetchData(val)
            },
            //更新列表
            upload(){
                this.$refs.list.fetchData()
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
