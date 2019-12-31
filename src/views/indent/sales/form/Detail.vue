<template>
  <div>
    <el-form v-model="form" label-width="100px" :size="'mini'">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'oid'">
            <el-input v-model="oid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'平台'">
            <el-input v-model="plaId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'订单号'">
            <el-input v-model="form.orderId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'下单日期'">
            <el-input v-model="form.createTime"></el-input>
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
          <el-table class="list-main" :height="'250px'" :data="list.records" border size="mini"
                    :highlight-current-row="true" @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column prop="date" label="序号" type="index" sortable></el-table-column>
            <el-table-column
              v-for="(t,i) in columns"
              :key="i"
              align="center"
              :prop="t.name"
              v-if="t.default!=undefined?t.default:true"
              :label="t.text"
              :width="t.width?t.width:''"
            ></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native="handleAdd(scope.row)">添加</el-button>
                <el-button type="text" size="small" @click.native="handleBack">查看图片</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="text-center pages" v-if="list.total && list.total!=0">
            <el-pagination
              @size-change="handleSize"
              @current-change="handleCurrent"
              :current-page="list.current"
              :page-sizes="[50, 100, 250, 500]"
              :page-size="list.size"
              :page-count="list.pages?list.pages:0"
              layout="total, sizes, prev, pager, next, jumper"
              :total="list.total?list.total:0"
            ></el-pagination>
          </div>
          <!-- <el-table :data="list.records"  :height="'250px'" border stripe size="mini" :highlight-current-row="true" >
             <el-table-column
               type="selection"
               width="55">
             </el-table-column>
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
               width="120">
               <template slot-scope="scope">
                 <el-button  type="text" size="small"  @click.native="handleBack(scope.row)">添加</el-button>
                 <el-button  type="text" size="small"  @click.native="handleBack">查看图片</el-button>
               </template>
             </el-table-column>
           </el-table>-->
        </el-col>
        <el-col :span="12">
          <el-table :data="tList" :height="'250px'" border stripe size="mini" :highlight-current-row="true">
            <el-table-column
              v-for="(t,i) in columns2"
              :key="i"
              :prop="t.name"
              align="center"
              v-if="t.default!=undefined?t.default:true"
              :label="t.text"
              :width="t.width?t.width:'120px'"
            ></el-table-column>
            <el-table-column
              fixed="right"
              align="center"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native.prevent="alterNum(scope.row)">修改数量
                </el-button>
                <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index,tList)">删除</el-button>
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
      :alter="alter"
      destroy-on-close
      append-to-body
    >
      <el-form>
        <el-row :gutter="20" type="flex" justify="center">
          <el-col :span="12">
            <el-form-item :label="'下单数量'">
              <el-input-number v-model="num1" @change="handleChange" :min="1" label="请输入数量"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align:center">
        <el-button type="primary" @click.native="saveNum">确定</el-button>
      </div>
    </el-dialog>
    <div slot="footer" style="text-align:center;padding-top:15px;">
      <el-button type="success" @click="batch">批量添加</el-button>
      <el-button type="warning" @click="exportOrder">导出</el-button>
      <el-button type="primary" @click.native="saveData">保存</el-button>
    </div>
  </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {getOrderNum, stockList, saveSale, saleInfo, updateSale,exportorder} from "@/api/indent/sales";
    import List from "@/components/List";

    export default {
        components: {
            List
        },
        computed: {
            ...mapGetters(["node"])
        },
        props: {
            oid: {
                type: Number,
                default: null
            },
        },
        data() {
            return {
                num1: 1,
                alter: null,
                plaId: 1,
                visible: null,
                form: {
                    fid: null,
                    orderId: null,
                    createTime: null,
                    name: null, // 客户名称
                    code: null, // 客户编号
                },
                loading: false,
                list: {},
                multipleSelection: [],
                getTime: function () {
                    var _this = this;
                    let yy = new Date().getFullYear();
                    let mm = new Date().getMonth() + 1;
                    let dd = new Date().getDate();
                    let hh = new Date().getHours();
                    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
                    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
                    _this.form.createTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
                },
                tList: [],
                obj: {},
                type: null,
                columns: [
                    {text: "gid", name: "gid", default: true},
                    {text: "商品名称", name: "goodCode"},
                    {text: "编码", name: "goodName"},
                    {text: "型号", name: "contact"},
                    {text: "计量单位", name: "phone"},
                    {text: "数量", name: "num"},
                    {text: "单价", name: "phone"},
                    {text: "备注", name: "qq"},
                ], columns2: [
                    {text: "gid", name: "gid", default: true},
                    {text: "商品名称", name: "goodCode"},
                    {text: "编码", name: "goodName"},
                    {text: "型号", name: "contact"},
                    {text: "计量单位", name: "phone"},
                    {text: "单价", name: "phone"},
                    {text: "下单数量", name: "num"},
                    {text: "实发数量", name: "actualNum"},
                ],
            };
        },
        created() {
            getOrderNum().then(res => {
                this.form.orderId = res.data
            });
            this.getTime();
        },
        mounted() {
            /*this.tableData();*/
            this.fetchData();
            if (typeof (this.oid) != undefined && this.oid != null) {
                this.tableData(this.oid);
            }
        },
        methods: {
            // 下载文件
            download (res) {
                if (!res.data) {
                    return
                }
                let url = window.URL.createObjectURL(new Blob([res.data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', res.headers['content-disposition'].split('filename=')[1])

                document.body.appendChild(link)
                link.click()
            },
            deleteRow(index, rows) {
                /*for (let i = 0;i < this.fList.length;i++){
                    if (this.fList[i].gid === rows[index].gid){
                        this.fList[i].isDel = 1;
                    }
                }*/
                rows.splice(index, 1);
            },
            exportOrder(){
                let list = this.tList
                let array = []
                if (list.length > 0) {
                    for (const i in list) {
                        var jbj = {}
                        jbj.gid = list[i].gid
                        jbj.goodCode = list[i].goodCode
                        jbj.goodName = list[i].goodName
                        jbj.num = list[i].num
                        array.push(jbj)
                    }
                    /* formData格式提交： */
                   /* let formData = new FormData();
                    for(var key in array){
                        formData.append(key,array[key]);
                    }*/
                    exportorder(array).then(res => {
                        this.download(res)
                        /*  this.$emit('hideDialog', false)
                          this.$emit('uploadList')*/
                    });
                }
            },
            //批量多选
            batch() {
                var list = JSON.parse(JSON.stringify(this.multipleSelection)),
                    tList = this.tList;
                //判断添加到待确认的数据是否重复
                for (var j in list) {
                    var number = 0;
                    for (var i in tList) {
                        if (list[j]['gid'] == tList[i]['gid']) {
                            this.$set(tList, i, {
                                ...tList[i],
                                num: parseFloat(tList[i].num) + 1
                            });
                            number++;
                            break;
                        }
                    }
                    //false
                    if (number == 0) {
                        //查询窗口插入数据
                        list[j].num=1
                        this.tList.push(list[j])
                    }
                }

            },
            handleChange(value) {
                console.log(value);
            },
            //监听每页显示几条
            handleSize(val) {
                this.list.pageSize = val
                this.fetchData(this.node.data.fid, this.node.data.type);
            },
            //监听当前页
            handleCurrent(val) {
                this.list.pageNum = val;
                this.fetchData(this.node.data.fid, this.node.data.type);
            },
            //添加数量->待确认区
            saveNum() {
                if (!this.alter) {
                    this.$set(this.obj, 'num', this.num1);
                    var tList = this.tList,
                        number = 0,
                        obj = this.obj;
                    //判断添加到待确认的数据是否重复
                    for (var i in tList) {
                        if (obj['gid'] == tList[i]['gid']) {
                            this.$set(tList, i, {...tList[i], num: parseFloat(tList[i].num) + parseFloat(obj['num'])});
                            number++;
                            break;
                        }
                    }
                    //false
                    if (number == 0) {
                        //查询窗口插入数据
                        this.tList.push(obj)
                    }
                } else {
                    this.$set(this.obj, 'num', this.num1);
                }
                this.num1 = 1;
                this.visible = false;
            },
            //修改数量
            alterNum(row) {
                this.num1 = row['num'];
                this.alter = true;
                this.obj = row;
                this.visible = true;
                console.log(this.obj)
            },
            //保存
            saveData() {
                let obj = {}, list = this.tList
                obj.plaId = this.plaId
                let array = []
                if (list.length > 0) {
                    for (const i in list) {
                        var jbj = {}
                        jbj.gid = list[i].gid
                        jbj.num = list[i].num
                        array.push(jbj)
                    }
                    if (typeof (this.oid) != undefined && this.oid != null) {
                        obj.oid = this.oid
                        obj.orderGoods = array
                        updateSale(obj).then(res => {
                            this.$emit('hideDialog', false)
                            this.$emit('uploadList')
                        });
                    } else {
                        obj.orderGoods = array;
                        saveSale(obj).then(res => {
                            this.$emit('hideDialog', false)
                            this.$emit('uploadList')
                        });
                    }
                } else {
                    return this.$message({
                        message: "无数据",
                        type: "warning"
                    });
                }

            },
            handleAdd(val) {
                this.obj = JSON.parse(JSON.stringify(val))
                this.alter = false
                this.visible = true
            },
            handleBack(val) {
                console.log(val)
                this.visible = true
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            tableData(oid) {
                saleInfo(oid).then(res => {
                    console.log(res)
                    this.tList = res.data
                    this.form.createTime = res.data[0].createTime
                })
            },
            fetchData(fid, type) {
                this.loading = true;
                const data = {
                    /*  fid: fid,
                      type: type,*/
                    pageNum: this.list.current || 1,
                    pageSize: this.list.size || 50
                };
                stockList(data).then(res => {
                    this.loading = false;
                    this.list = res.data;
                })
            }
        }
    }
</script>

<style>
</style>
