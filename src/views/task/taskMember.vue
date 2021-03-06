<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="课题名称" prop="taskId">
        <el-select v-model="queryParams.taskId" placeholder="--请选择--" clearable size="small">
          <el-option v-for="(item, index) in taskOptions" :key="index" :label="item.taskName" :value="item.taskId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="学生" prop="studentName">
        <el-input v-model="queryParams.studentName" placeholder="请输入学生用户名" clearable size="small"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="memberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="课题名称" align="center" prop="taskName" />
      <el-table-column label="指导教师" align="center" prop="taskTeacher" />
      <el-table-column label="学生" align="center" prop="studentName" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFomatter" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-wallet" @click="handlePerformant(scope.row)" v-if="scope.row.status === '1'">发放绩效</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>

    <!-- 添加或修改课题成员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课题id" prop="taskId" style="width: 300px">
          <el-select v-model="form.taskId" placeholder="--请选择--">
            <el-option v-for="(item, index) in taskOptions" :key="index" :label="item.taskName" :value="item.taskId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="学生" prop="studentName" style="width: 300px">
          <el-input v-model="form.studentName" placeholder="请输入学生用户名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 发放绩效对话框 -->
    <el-dialog :title="title" :visible.sync="show" width="500px" append-to-body>
      <el-form ref="form1" :model="form1" :rules="rules1" label-width="80px">
        <el-form-item label="学生" prop="studentName" style="width: 300px">
          <el-input v-model="form1.studentName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="发放金额" prop="performant" style="width: 300px">
          <el-input v-model="form1.performant" placeholder="请输入绩效金额" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1">确 定</el-button>
        <el-button @click="cancel1">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listMember, getMember, delMember, addMember, updateMember, exportMember } from '../../api/task/member';
  import { addPerformant, listTaskByUserId } from '../../api/task/task'

  export default {
    name: "taskMember",
    components: {
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        //课题下拉列表
        taskOptions: [],
        // 课题成员表格数据
        memberList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        show: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          taskId: null,
          studentUsername: null,
          status: null,
          isDelete: null,
        },
        // 表单参数
        form: {},
        form1: {},
        // 表单校验
        rules: {
          taskId: [
            { required: true, message: "课题id不能为空", trigger: "blur" }
          ],
        },
        rules1: {
          performant: [
            { required: true, message: "绩效金额不能为空", trigger: "blur" }
          ],
        }
      };
    },
    created() {
      this.getTaskByUserId();
      this.getList();
    },
    methods: {
      /** 查询课题成员列表 */
      getList() {
        this.loading = true;
        listMember(this.queryParams).then(response => {
          this.memberList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      cancel1() {
        this.show = false;
        this.reset1();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          taskId: null,
          studentUsername: null,
          status: "0",
          isDelete: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null
        };
        this.resetForm("form");
      },
      reset1() {
        this.form1 = {
          id: null,
          taskId: null,
          studentUsername: null,
          performant: null,
          status: "0",
          isDelete: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null
        };
        this.resetForm("form1");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加课题成员";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getMember(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改课题成员";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateMember(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addMember(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除课题成员编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMember(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有课题成员数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMember(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      },
      getTaskByUserId(){
        listTaskByUserId(this.$store.state.user.name).then(response => {
            this.taskOptions = response.data;
        });
      },
      statusFomatter(row) {
        if (row.status === '0') {
          return '待加入';
        } else {
          return '已加入';
        }
      },
      handlePerformant(row) {
        this.reset1();
        const id = row.id || this.ids
        getMember(id).then(response => {
          this.form1 = response.data;
          this.show = true;
          this.title = "发放绩效";
        });
      },
      submitForm1() {
        this.$refs["form1"].validate(valid => {
          if (valid) {
            addPerformant(this.form1).then(response => {
              this.msgSuccess("新增成功");
              this.show = false;
            });
          }
        });
      }
    }
  };
</script>
