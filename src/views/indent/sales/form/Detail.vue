<template>
  <div>
    <el-form v-model="form" label-width="100px" :size="'mini'">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'订单号'">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'下单日期'">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'客户名称'">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'下单仓库'">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'商品'">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button :size="'mini'" type="success" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <!--<list
            class="list-main box-shadow"
            :columns="columns"
            :loading="loading"
            :list="list"
            index
            :height="'250px'"
            type
            @handle-size="handleSize"
            @handle-current="handleCurrent"
          />-->
          <el-table :data="Tlist"  :height="'250px'" border stripe size="mini" :highlight-current-row="true" >
            <el-table-column
              v-for="(t,i) in columns"
              :key="i"
              :prop="t.name"
              :label="t.text"
              :width="t.width?t.width:'120px'"
            ></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button  type="text" size="small"  @click.native="handleBack">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-table :data="Tlist"  :height="'250px'" border stripe size="mini" :highlight-current-row="true" >
              <el-table-column
                v-for="(t,i) in columns"
                :key="i"
                :prop="t.name"
                :label="t.text"
                :width="t.width?t.width:'120px'"
              ></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button  type="text" size="small"  @click.native.prevent="deleteRow(scope.$index,list)">删除</el-button>
              </template>
            </el-table-column>
            </el-table>
        </el-col>
     </el-row>
   </el-form>
    <el-dialog
      :visible.sync="visible"
      title="下单数量"
      v-if="visible"
      :width="'30%'"
      destroy-on-close
      append-to-body
    >
      <el-form>
        <el-row :gutter="20"  type="flex"  justify="center">
          <el-col :span="12">
            <el-form-item :label="'下单数量'">
              <el-input-number v-model="num1" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align:center">
        <el-button type="primary" @click.native="saveData">确定</el-button>
      </div>
    </el-dialog>
   <div slot="footer" style="text-align:center" >
       <el-button @click.native="visible= false">取 消</el-button>
       <el-button type="primary" @click.native="saveData">保存</el-button>
     </div>
 </div>
</template>

<script>
    import { mapGetters } from "vuex";
import {saveCustomer,customerList} from "@/api/wy/customer/commoditylist";
import List from "@/components/List";


export default {
   components: {
       List
   },
    computed: {
        ...mapGetters(["node"])
    },
 props: {
   fid: {
     type: Number,
     default: null
   }
 },
 data() {
   return {
       num1: 1,
       visible: null,
     form: {
       fid: null,
       name: null, // 客户名称
       code: null, // 客户编号
     },
       loading: false,
       list: {},
       Tlist: [{}],
       type: null,
       columns: [
           { text: "fid", name: "fid" },
           { text: "商品名称", name: "name" },
           { text: "编码", name: "code" },
           { text: "型号", name: "contact" },
           { text: "计量单位", name: "phone" },
           { text: "单价", name: "phone" },
           { text: "备注", name: "qq" },
       ],
   };
 },
 created() {

 },
 mounted() {
       this.tableData();
     this.fetchData();
  /* if (this.fid) {
     this.fetchData(this.fid);
   }*/
 },
 methods: {
     deleteRow(index, rows) {
         rows.splice(index, 1);
     },
     handleChange(value) {
         console.log(value);
     },
     //监听每页显示几条
     handleSize(val) {
         this.list.pageSize = val
         this.fetchData(this.node.data.fid,this.node.data.type);
     },
     //监听当前页
     handleCurrent(val) {
         this.list.pageNum = val;
         this.fetchData(this.node.data.fid,this.node.data.type);
     },
   saveData() {
     if(!this.form.buildId) return this.$message({
       message: "请选择房产",
       type: "warning"
     });
     saveCustomer(this.form).then(res => {
       console.log(res)
     });
   },
     handleBack(){
         this.visible=true;
     },
     tableData(){
         const data = {
             pageNum: 1,
             pageSize:  50
         };
         customerList(data).then(res => {
             console.log(res.data)
             this.Tlist = res.data.list;
         });
     },
   fetchData(fid, type) {
       this.loading = true;
       const data = {
           /*  fid: fid,
             type: type,*/
           pageNum: this.list.pageNum || 1,
           pageSize: this.list.pageSize || 50
       };
       customerList(data).then(res => {
           this.loading = false;
           this.list = res.data;
       });
   },
 }
};
</script>

<style>
</style>
