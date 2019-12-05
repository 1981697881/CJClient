<template>
  <div>
    <el-form v-model="form" label-width="100px" :size="'mini'">
      <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item :label="'源订单号'">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-button :size="'mini'" type="success" icon="el-icon-search">查询</el-button>
      </el-col>
    </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="退货原因">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-table :data="list"  :height="'250px'" border stripe size="mini" :highlight-current-row="true" >
            <el-table-column
              v-for="(t,i) in columns1"
              :key="i"
              fixed
              :prop="t.name"
              :label="t.text"
              :width="t.width?t.width:'120px'"
            ></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button  type="text" size="small"  @click.native="handleBack">退货</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-table :data="list"  :height="'250px'" border stripe size="mini" :highlight-current-row="true" >
            <el-table-column
              v-for="(t,i) in columns2"
              :key="i"
              fixed
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
        <!--<list
          class="list-main"
          :columns="columns"
          :loading="loading"
          :list="list"
          index
          type
        />-->
      </el-row>
    </el-form>
    <el-dialog
      :visible.sync="visible"
      title="退货信息"
      v-if="visible"
      :width="'30%'"
      destroy-on-close
      append-to-body
    >
      <el-form>
      <el-row :gutter="20"  type="flex"  justify="center">
        <el-col :span="12">
          <el-form-item :label="'退货数量'">
            <el-input-number v-model="num1" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
      <div slot="footer" style="text-align:center">
        <el-button type="primary" @click.native="saveData">确定</el-button>
      </div>
    </el-dialog>
    <div slot="footer" style="text-align:center">
      <el-button @click.native="visible= false">取 消</el-button>
      <el-button type="primary" @click.native="saveData">保存</el-button>
    </div>
  </div>
</template>

<script>
    import { getCustomerById, saveCustomer,customerList} from "@/api/wy/customer/commoditylist";
    import List from "@/components/List";
    export default {
        components: {
            List
        },
        props: {
            fid: {
                type: Number,
                default: null
            }
        },
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                visible: null,
                num1: 1,
                form: {
                    fid: null,
                    name: null, // 客户名称
                    code: null, // 客户编号
                },
                loading: false,
                list: [{

                }],
                type: null,
                columns1: [
                    { text: "fid", name: "fid" },
                    { text: "商品名称", name: "name" },
                    { text: "可退数", name: "code" },
                ],
                columns2: [
                    { text: "fid", name: "fid" },
                    { text: "商品名称", name: "name" },
                    { text: "数量", name: "code" },
                ],
            };
        },
        created() {

        },
        mounted() {
            this.tableData();
            if (this.fid) {
                this.fetchData(this.fid);
            }
        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleChange(value) {
                console.log(value);
            },
            deleteRow(index, rows) {
                rows.splice(index, 1);
            },
            handleBack(){
              this.visible=true;
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
            tableData(){
                const data = {
                    pageNum: 1,
                    pageSize:  50
                };
                customerList(data).then(res => {
                    console.log(res.data)
                    this.list = res.data.list;
                });
            },
            fetchData(val) {
                getCustomerById(val).then(res => {
                    this.form = res.data;

                });
            },
        }
    };
</script>

<style>
</style>
