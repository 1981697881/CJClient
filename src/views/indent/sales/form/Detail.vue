<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" :size="'mini'">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'oid'" style="display: none">
            <el-input v-model="oid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'平台'" style="display: none">
            <el-input v-model="plaId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'订单号'">
            <el-input v-model="form.orderId" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'下单日期'">
            <el-input v-model="form.createTime" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'下单人名称'">
            <el-input v-model="form.name" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="'下单人编码'" >
            <el-input v-model="form.username" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">
          <el-form-item :label="'仓库'">
            <el-select v-model="form.wid" class="width-full" placeholder="请选择仓库" @change="wareChange">
              <el-option :label="t.name" :value="t.wid" v-for="(t,i) in value1" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-col>-->
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="'商品'">
            <el-input v-model="search" @input.native="inat"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button  :size="'mini'" type="success" @click="query" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item :label="'备注'">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-table class="list-main" :height="'250px'" :data="list.records"  border size="mini"  :highlight-current-row="true" @selection-change="handleSelectionChange">
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
                <el-button type="text" size="small" @click.native="handleLook(scope.row)">查看图片</el-button>
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
              <el-input-number v-model="num1" @change="handleChange" :precision="2" :step="1" :min="0.1" label="请输入数量"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align:center">
        <el-button type="primary" @click.native="saveNum">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="tpvisible"
      title="图片详情"
      v-if="tpvisible"
      :width="'40%'"
      destroy-on-close
      append-to-body
    >
      <div style="text-align: center">
        <el-upload
          action="#"
          list-type="picture-card"
          accept="png,jpg,jpeg"
          name="imgS"
          :class="{hide:hideUpload}"
          :on-preview="handlePictureCardPreview"
          :file-list="fileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </el-dialog>
    <div slot="footer" style="text-align:center;padding-top:15px;">
      <el-button type="success" v-show="biggest" @click="mWin(1)">最大化窗口</el-button>
      <el-button type="success" v-show="normal" @click="mWin(2)">正常窗口</el-button>
      <el-button type="success" v-show="isAdd"  @click="batch">批量添加</el-button>
      <el-button type="warning" v-show="isAdd" @click="exportOrder">导出</el-button>
      <el-button type="primary" v-show="isAdd" @click.native="saveData('form')">保存</el-button>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getOrderNum, stockList, saveSale, saleInfo, updateSale, exportorder, getWarehouse} from '@/api/indent/sales'
  import {getInfo} from '@/api/user'
  import List from '@/components/List'
  import {
    getPer
  } from '@/utils/auth'

  export default {
    components: {
      List
    },
    computed: {
      ...mapGetters(["node"]),
    },
    props: {
      oid: {
        type: Number,
        default: null
      },
      plas: {
        type: Number,
        default: null
      },
      isAdd: {
        type: Boolean,
        default: true
      },
      orderId: {
        type: String,
        default: null
      },
      customer: {
        type: String,
        default: null
      },
      customerCode: {
        type: String,
        default: null
      },
      remark: {
        type: String,
        default: null
      },
      createTime: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        biggest:true,
        normal:false,
        fileList: [],
        num1: 1,
        hideUpload: true,
        dialogImageUrl: '',
        dialogVisible: false,
        alter: null,
        plaId: null,
        tpvisible: null,
        visible: null,
        search: '',
        form: {
          goods: null,
          warehouse: null,
          fid: null,
          remark: null,
          orderId: null,
          createTime: null,
          name: null, // 客户名称
          username: null // 客户编号
        },
        rules: {
          name: [
            {required: true, message: '请输入客户名称', trigger: 'blur'}
          ],

        },
        value1: [],
        loading: false,
        list: [],
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
          {text: "gid", name: "gid", default: false},
          {text: "siId", name: "siId", default: false},
          {text: "商品名称", name: "goodName"},
          {text: "编码", name: "goodCode"},
          {text: "型号", name: "standard"},
          {text: "计量单位", name: "unitOfMea"},
          {text: "数量", name: "num"},
          {text: "仓库", name: "wareHouseName"},
          {text: "单价", name: "price", default:false},
        ], columns2: [
          {text: "gid", name: "gid", default: false},
          {text: "siId", name: "siId", default: false},
          {text: "商品名称", name: "goodName"},
          {text: "编码", name: "goodCode"},
          {text: "型号", name: "standard"},
          {text: "计量单位", name: "unitOfMea"},
          {text: "单价", name: "sellPrice", default:false},
          {text: "仓库", name: "wareHouseName"},
          {text: "下单数量", name: "num"},
          {text: "实发数量", name: "actualNum"},
        ],
      };
    },
    created() {
      //判断价格权限
      if(unescape(getPer('clper').replace(/\\u/gi, '%u')) === '价格') {
        for(let i in this.columns) {
          if(this.columns[i].name == 'price') {
            this.columns[i].default = true
          }
        }
        for(let i in this.columns2) {
          if(this.columns2[i].name == 'sellPrice') {
            this.columns2[i].default = true
          }
        }
      }
    },
    mounted() {
      /*this.tableData();*/
      this.plaId = this.plas
      this.wFormat()
      this.fetchData()
      if (typeof (this.oid) != undefined && this.oid != null) {
        this.form.name = this.customer
        this.form.username = this.customerCode
        this.form.orderId = this.orderId
        this.form.remark = this.remark
        this.form.createTime = this.createTime
        this.tableData(this.oid);
      } else {
        this.getTime()
        this.getUserInfo()
        getOrderNum().then(res => {
          this.form.orderId = res.data
        });
      }
    },
    methods: {
      //调整窗口
      mWin(val) {
        if(val == 1){
          this.biggest = false
          this.normal = true
          this.$emit('operation',val)
        }else{
          this.biggest = true
          this.normal = false
          this.$emit('operation',val)
        }

      },
      // 下载文件
      download(res) {
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
      inat(value) {
        if(value.data == null) {
          setTimeout(() =>{
            this.query()
          },500);
        }else{
          if(value.data.replace(/\s+/g, "") != "") {
            this.search = value.data
            setTimeout(() =>{
              this.query()
            },500);
          }
        }
      },
      wareChange(val) {
        this.wFormat(val);
      },
      query() {
        this.list.current = 1;
        this.fetchData();
      },
      deleteRow(index, rows) {
        /*for (let i = 0;i < this.fList.length;i++){
            if (this.fList[i].gid === rows[index].gid){
                this.fList[i].isDel = 1;
            }
        }*/
        rows.splice(index, 1);
      },
      exportOrder() {
        let list = this.tList
        let array = []
        if (list.length > 0) {
          for (const i in list) {
            var jbj = {}
            jbj.gid = list[i].gid
            jbj.siId = list[i].siId
            jbj.goodCode = list[i].goodCode
            jbj.standard = list[i].standard
            jbj.unitOfMea = list[i].unitOfMea
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
            console.log(res)
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
            if (list[j]['siId'] == tList[i]['siId']) {
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
            list[j].num = 1
            this.tList.push(list[j])
          }
        }

      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleChange(value) {
        console.log(value);
      },
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
      //添加数量->待确认区
      saveNum() {
        if (!this.alter) {
          this.$set(this.obj, 'num', this.num1);
          var tList = this.tList,
            number = 0,
            obj = this.obj;
          //判断添加到待确认的数据是否重复
          for (var i in tList) {
            if (obj['siId'] == tList[i]['siId']) {
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
      saveData(form) {
        this.$refs[form].validate((valid) => {
          //判断必填项
          if (valid) {
            let obj = {}, list = this.tList
            obj.plaId = this.plaId
            let array = []
            if (list.length > 0) {
              for (const i in list) {
                var jbj = {}
                jbj.gid = list[i].gid
                jbj.siId = list[i].siId
                jbj.num = list[i].num
                array.push(jbj)
              }
              if (typeof (this.oid) != undefined && this.oid != null) {
                obj.oid = this.oid
                obj.remark = this.form.remark
                obj.orderGoods = array
                updateSale(obj).then(res => {
                  this.$emit('hideDialog', false)
                  this.$emit('uploadList')
                });
              } else {
                obj.orderGoods = array
                obj.remark = this.form.remark
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
          }
        })
      },
      handleAdd(val) {
        this.num1 = 1;
        this.obj = JSON.parse(JSON.stringify(val))
        this.alter = false
        this.visible = true
      },
      //查看图片
      handleLook(val) {
        let imgArray = val.img.split(',');
        console.log(imgArray.length)
        if (imgArray.length > 0 && val.img != "") {
          //判断图片是否为空
          this.tpvisible = true;
          if (this.fileList.length > 0) {
            this.fileList[0].url = 'http://120.78.168.141:8090/web' + imgArray[0];
          } else {
            this.fileList = []
            this.fileList.push({
              url: 'http://120.78.168.141:8090/web' + imgArray[0]
            })
          }
        } else {
          return this.$message({
            message: "无图片",
            type: "warning"
          });
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      tableData(oid) {
        saleInfo(oid).then(res => {
          if (res.flag) {
            this.tList = res.data
          }
        })
      },
      fetchData(val) {
        this.loading = true;
        const data = {
          //wid: this.form.wid || '',
          pageNum: this.list.current || 1,
          pageSize: this.list.size || 50
        };
        const obj = { plaId: this.plaId }
        this.search != '' ? obj.goodName = this.search : null
        stockList(data, obj).then(res => {
          if (res.flag) {
            this.loading = false
            this.list= {
              current: res.data.current,
              pages: res.data.pages,
              size: res.data.size,
              total: res.data.total,
              records: res.data.records
            }
          }
        })
      },
      wFormat() {
        getWarehouse().then(res => {
          if (res.flag) {
            this.value1 = res.data;
            return;
          }
        })
      },
      getUserInfo() {
        getInfo().then(res => {
          if (res.flag) {
            this.form.name = res.data["name"]
            this.form.username = res.data["username"];
          }
        })
      }
    }
  }
</script>

<style>
</style>
