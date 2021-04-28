<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">-->
<!--      <el-form-item label="公告标题" prop="noticeTitle">-->
<!--        <el-input-->
<!--          v-model="queryParams.noticeTitle"-->
<!--          placeholder="请输入公告标题"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="操作人员" prop="createBy">-->
<!--        <el-input-->
<!--          v-model="queryParams.createBy"-->
<!--          placeholder="请输入操作人员"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="类型" prop="noticeType">-->
<!--        <el-select v-model="queryParams.noticeType" placeholder="公告类型" clearable size="small">-->
<!--          <el-option-->
<!--            v-for="dict in typeOptions"-->
<!--            :key="dict.dictValue"-->
<!--            :label="dict.dictLabel"-->
<!--            :value="dict.dictValue"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

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
    </el-row>

    <el-table v-loading="loading" :data="workLogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="workLogId" width="100" />
      <el-table-column label="课题名称" align="center" prop="taskName" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a @click="handleView(scope.row)" style="color:blue;cursor:pointer">{{scope.row.taskName}}</a>
        </template>
      </el-table-column>
      <el-table-column label="课题教师" align="center" prop="taskTeacher" width="100"/>
      <el-table-column label="状态" align="center" prop="status" :formatter="formatStatus" width="100"/>
      <el-table-column label="创建者" align="center" prop="createBy"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>

    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="课题名称" prop="taskId">
              <el-select v-model="form.taskName" placeholder="请选择" clearable size="small">
                <el-option v-for="(item, index) in taskList" :key="index" :label="item.taskName"
                           :value="item.taskId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-switch v-model="form.status" active-value="0" inactive-value="1" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <editor v-model="form.logContent" :min-height="192"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="isEdit" @click="submitForm">确 定</el-button>
        <el-button v-if="isEdit" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Editor from '@/components/Editor';
  import { addWorkLog, deleteWorkLog, getWorkLog, listWorkLog, updateWorkLog } from '../../api/task/workLog'
  import { getTask, getTaskByUserName } from '../../api/task/task'

  export default {
    name: 'workLog',
    components: {
      Editor
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
        // 总条数
        total: 0,
        // 公告表格数据
        workLogList: [],
        //课题名称下拉列表
        taskList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 弹出层是否可编辑
        isEdit: false,
        // 表单参数
        form: {},
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10
        },
        rules: {
          taskId: [
            { required: true, message: "课题名称不能为空", trigger: "blur" }
          ]
        }
      }
    },
    created() {
      this.getList();
      this.getJoinedTask();
      this.title = "新增工作日志";
    },
    methods: {
      formatStatus(row, column) {
        if (row.status === '0') {
          return '已发布';
        } else {
          return '草稿';
        }
      },
      handleAdd() {
        this.open = true;
        this.isEdit = true;
      },
      handleUpdate(row) {
        this.isEdit = true;
        this.reset();
        const logId = row.workLogId || this.ids;
        getWorkLog(logId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改工作日志";
        });
      },
      handleDelete(row) {
        const logId = row.workLogId || this.ids
        deleteWorkLog(logId).then(response => {
          this.msgSuccess("删除成功");
          this.reset();
          this.getList()
        });
      },
      handleView(row) {
        this.isEdit = false;
        this.reset();
        const logId = row.workLogId || this.ids;
        getWorkLog(logId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "查看工作日志";
        });
      },
      handleSelectionChange(val) {
        this.ids = [];
        for(let workLog of val) {
          this.ids.push(workLog.workLogId)
        }
        this.single = val.length!==1
        this.multiple = !val.length
      },
      getList() {
        this.loading = true;
        listWorkLog(this.queryParams).then(response => {
          this.workLogList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      getJoinedTask() {
        getTaskByUserName().then(response => {
          this.taskList = response.data;
        });
      },
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if(this.title === '新增工作日志'){
              addWorkLog(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.reset();
                this.getList()
              });
            } else {
              updateWorkLog(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.reset();
                this.getList()
              });
            }
          }
        });
      },
      cancel() {
        this.open = false;
        this.reset();
      },
      reset() {
        this.form = {
          workLogId: undefined,
          taskId: undefined,
          logContent: undefined,
          status: "0",
        };
        this.resetForm("form")
      },
    }
  }
</script>

<style scoped>

</style>
