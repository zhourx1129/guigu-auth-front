<template>
    <div class="app-container">
        角色列表
        <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input style="width: 100%" v-model="searchObj.roleName" placeholder="角色名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini"  @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 工具条 -->
    <div class="tools-div">
        <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>
        <el-button class="btn-add" size="mini" @click="batchRemove()" >批量删除</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
    @selection-change="handleSelectionChange">
  <el-table-column type="selection"/>
      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="createTime" label="创建时间" width="160"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改"/>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除"/>
        </template>
      </el-table-column>
    </el-table>
      <!-- 分页组件 -->
    <el-pagination
        :current-page="page"
        :total="total"
        :page-size="limit"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchData"
    />
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
      <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName"/>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
</el-dialog>
    </div>
</template>
<script>
import api from '@/api/role/role'
export default {
    // 定义初始值
    data() {
        return {
            list: [],  // 角色列表
            total: 0,   // 总记录数
            page: 1, // 当前页
            limit: 3,    //每页显示记录数
            searchObj: {},   //条件查询封装的对象
            sysRole: {},     //封装添加角色表单对象
            dialogVisible: false,    // 弹框
            selectValue: [],    //复选框选择的数据
        }
    },
    // 页面渲染之前会执行
    created() {
        this.fetchData()
    },
    methods: { // 具体方法
        // 复选框发生变化
        handleSelectionChange(selection) {
            this.selectValue = selection
        },
        // 批量删除
        batchRemove() {
        //   判断
            if (this.selectValue.length === 0) {
                this.$message.warning('请选择要删除的记录！')
                return
            }
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用方法进行删除
                var idList = []
                // 获取多个元素的id值
                for (let index = 0; index < this.selectValue.length; index++) {
                    idList.push(this.selectValue[index].id)
                }
                api.batchRemove(idList).then(response => {
                    // 提示删除成功
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    });
                    // 刷新页面
                    this.fetchData()
                })
            })
        },
        // 修改进行数据回显
        edit(id) {
            // 弹出框
            this.dialogVisible = true
            // 查询数据
            api.getRoleId(id).then(response => {
                this.sysRole = response.data
            })
        },
        // 点击确定
        saveOrUpdate() {
            // 判断是添加还是修改
            if (!this.sysRole.id) {
                // 添加
                this.saveRole()
            } else {
                // 修改
                this.updateRole()
            }
        },
        // 修改的方法
        updateRole() {
            api.updateRole(this.sysRole)
                .then(response => {
                // 提示修改成功
                    this.$message({
                        type: 'success',
                        message: '添加成功',
                    });
                    // 关闭弹窗
                    this.dialogVisible = false
                    // 刷新页面
                    this.fetchData()
            })
        },
        // 添加的方法
        saveRole() {
            api.saveRole(this.sysRole)
                .then(response => {
                // 提示添加成功
                this.$message({
                    type: 'success',
                    message: '添加成功!'
                });
                // 关闭弹窗
                    this.dialogVisible = false
                // 刷新页面
                this.fetchData()
            })
        },

        // 点击添加，会弹出窗口
        add() {
            this.dialogVisible = true,
            this.sysRole={}
        },
        // 删除
        removeDataById(id) {
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用方法进行删除
                api.removeId(id).then(response => {
                    // 提示删除成功
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    });
                    // 刷新页面
                    this.fetchData()
                })
            })
        },
        // 重置
        resetData() {
            // 清空表单
            this.searchObj={}
            // 查询所有数据
            this.fetchData()
        },
        // 列表
        fetchData(pageNum=1) {
            // ajax
            this.page = pageNum
            api.getPageList(this.page, this.limit, this.searchObj)
                .then(response => {
                    // console.log(response);
                    this.list = response.data.records
                    this.total = response.data.total
                })
        }
    }
}
</script>