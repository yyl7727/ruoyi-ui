<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="学生姓名" prop="studentName">
          <el-input v-model="queryParams.studentName" placeholder="请输入学生姓名" clearable size="small"/>
        </el-form-item>
        <el-form-item label="专业" prop="studentMajor">
          <el-select v-model="queryParams.studentMajor" placeholder="请输入专业" clearable size="small">
            <el-option v-for="(item, index) in studentMajorOptions" :key="index" :label="item.dictLabel"
                       :value="item.dictValue" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="infoList">
        <el-table-column label="学生姓名" align="center" prop="studentName" />
        <el-table-column label="专业" align="center" prop="studentMajor" />
        <el-table-column label="联系电话" align="center" prop="studentPhone" />
        <el-table-column label="电子邮箱" align="center" prop="studentEmail" />
        <el-table-column label="学生技术方向" align="center" prop="skill" :show-overflow-tooltip="true" />
        <el-table-column label="个人简介" align="center" prop="studentDesc" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-circle-plus-outline" @click="handleInvite(scope.row)">邀请加入课题</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="课题名称" prop="taskId">
            <el-select v-model="form.taskId" placeholder="请选择邀请进入的课题名称" clearable size="small">
              <el-option v-for="(item, index) in taskOptions" :key="index" :label="item.taskName"
                         :value="item.taskId" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { listInfo } from "../../api/rearch/info";
  import {inviteIntoTask, listTaskByUserId} from "../../api/task/task";

  export default {
    name: 'info',
    created() {
      listTaskByUserId(this.userId).then(response =>{
        this.taskOptions = response.data
      });
      this.getDicts("student_major").then(response => {
        this.studentMajorOptions = response.data
      });
      this.getList();
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 助研信息表格数据
        infoList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 专业下拉列表数据
        studentMajorOptions: [],
        // 课题下拉列表数据
        taskOptions: [],
        userId: this.$store.state.user.name,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          studentName: null,
          studentMajor: null
        },
        // 表单参数
        form: {
          taskId: undefined
        },
        // 表单验证规则
        rules: {
          taskId: [{ required: true, message: '请选择课题名称', trigger: 'change' }]
        }
      }
    },
    methods: {
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 查询助研信息列表 */
      getList() {
        this.loading = true;
        listInfo(this.queryParams).then(response => {
          this.infoList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      submitForm() {
        this.$refs["form"].validate(valid => {
          console.log(this.form)
          if (valid) {
            inviteIntoTask(this.form).then(response => {
              this.msgSuccess("邀请发送成功");
              this.reset();
              this.open = false;
            })
          }
        });
      },
      handleInvite(row) {
        console.log(row.studentId)
        this.title = "邀请加入课题";
        this.open = true;
        this.form.studentUserName = row.studentId;
      },
      cancel() {
        this.open = false;
        this.reset();
      },
      reset() {
        this.form = {
          taskId: null
        };
        this.resetForm("form");
      },
      resetForm(form) {
        this.$refs[form].resetFields();
      }
    }
  }
</script>
