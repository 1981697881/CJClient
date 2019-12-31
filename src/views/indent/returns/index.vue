<template>
  <div class="app-list">
    <!--<Tree class="list-tree" @handler-node="handlerNode" />-->
    <div class="list-containerOther">
      <div>
        <tabs-bar @addUnit="handlerTabs" @showDialog="handlerDialog" @delOrder="delRequest"/>
      </div>
      <list ref="list" @showDialog="handlerDialog"/>
    </div>

    <el-dialog
      :visible.sync="visible"
      title="退货信息"
      v-if="visible"
      :width="'60%'"
      destroy-on-close
    >
      <returns @hideDialog="hideWindow" @uploadList="upload" :reOdId="reOdId"></returns>

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
                orderId: null,
                treeId: null, // null
                floorId: null
            };
        },
        mounted() {
            this.$refs.list.fetchData()
        },
        methods: {
            hideWindow(val) {
                this.visible = val
            },
            handlerDialog(obj) {
                if (obj) this.reOdId = obj.reOdId
                this.visible = true
            },
            handlerNode(node) {
                console.log(node.data)
                this.$refs.list.fetchData(node.data.fid, node.data.type)
            },
            handlerTabs(prId) {
                this.$refs.list.addUnit(prId);
            },
            delRequest(val){
                this.$refs.list.delOrder(val);
                this.$refs.list.fetchData()
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
