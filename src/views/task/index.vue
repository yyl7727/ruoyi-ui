<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="课题名称" prop="taskName">
        <el-input v-model="queryParams.taskName" clearable size="small" style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item label="课题类型" prop="taskType">
        <el-select v-model="queryParams.taskType" placeholder="---请选择---" clearable size="small" style="width: 240px">
          <el-option
            v-for="dict in taskTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete1"
        >删除</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['task:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="课题名称" prop="taskName" width="180" />
      <el-table-column label="课题类型" prop="taskType" width="150" />
      <el-table-column label="课题人数" prop="taskNum"  width="100" />
      <el-table-column label="课题描述" prop="taskDesc" :show-overflow-tooltip="true" width="300" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"/>

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课题名称" prop="taskName">
          <el-input v-model="form.taskName" placeholder="请输入课题名称" />
        </el-form-item>
        <el-form-item label="课题类型" prop="taskType">
          <el-select v-model="form.taskType" placeholder="---请选择---">
            <el-option
              v-for="dict in taskTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课题人数" prop="taskNum">
          <el-input-number v-model="form.taskNum" controls-position="right" :min="1" :max="50" />
        </el-form-item>
        <el-form-item label="是否可选" prop="status">
          <el-switch v-model="form.status" active-value="0" inactive-value="1" />
        </el-form-item>
        <el-form-item label="课题描述" prop="taskDesc">
          <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.taskDesc" />
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
  import {
    addTask,
    changeTaskStatus,
    deleteById,
    deleteByIds,
    getTask,
    listTask,
    updateTask
  } from "../../api/task/task";

    export default {
      name: "Task",
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
          //课题列表
          taskList: [],
          //课题类型下拉列表
          taskTypeOptions: [],
          // 弹出层标题
          title: "",
          // 是否显示弹出层
          open: false,
          // 表单参数
          form: {},
          queryParams: {
            pageNum: 1,
            pageSize: 10,
            taskName: undefined,
            taskType: undefined
          },
          // 表单校验
          rules: {
            taskName: [
              { required: true, message: "课题名称不能为空", trigger: "blur" }
            ],
            taskType: [
              { required: true, message: "课题类型不能为空", trigger: "blur" }
            ],
            taskNum: [
              { required: true, message: "课题人数不能为空", trigger: "blur" }
            ]
          }
        };
      },
      created() {
        this.getList();
        this.getDicts("task_type").then(response => {
          this.taskTypeOptions = response.data;
        });
      },
      methods: {
        //查询
        handleQuery() {
          this.queryParams.pageNum = 1;
          this.getList();
        },
        //重置
        resetQuery() {
          this.resetForm("queryForm");
          this.handleQuery();
        },
        //多选框选中数据
        handleSelectionChange(val) {
          this.ids = []
          for(let task of val) {
            this.ids.push(task.taskId)
          }
          this.single = val.length!==1
          this.multiple = !val.length
        },
        //课题状态修改
        handleStatusChange(row) {
          let text = row.status === "0" ? "可选" : "不可选";
          this.$confirm('确认要改变课题状态为' + text + '吗?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function() {
            return changeTaskStatus(row.taskId, row.status);
          }).then(() => {
            this.msgSuccess(text + "成功");
          }).catch(function() {
            row.status = row.status === "0" ? "1" : "0";
          });
        },
        //新增按钮操作
        handleAdd() {
          this.open = true;
          this.title = "新增课题";
          this.reset();
        },
        //修改按钮操作
        handleUpdate(row) {
          this.reset();
          const taskId = row.taskId || this.ids
          getTask(taskId).then(response => {
            this.form = response.data;
            this.open = true;
            this.title = "修改课题";
          });
        },
        handleDelete1() {
          const taskIds = this.ids;
          this.$confirm('是否确认删除', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function() {
            return deleteByIds(taskIds);
          }).then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
        },
        handleDelete(row) {
          const taskId = row.taskId;
          this.$confirm('是否确认删除', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function() {
            return deleteById(taskId);
          }).then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
        },
        reset() {
          this.form = {
            taskId: undefined,
            taskName: undefined,
            taskType: undefined,
            taskNum: 1,
            taskDesc: undefined,
            status: "0",
          };
          this.resetForm("form")
        },
        submitForm() {
          this.$refs["form"].validate(valid => {
            if (valid) {
              if (this.form.taskId !== undefined) {
                updateTask(this.form).then(response => {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                });
              } else {
                addTask(this.form).then(response => {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                });
              }
            }
          });
        },
        cancel() {
          this.open = false;
          this.reset();
        },
        getList() {
          this.loading = true;
          listTask(this.queryParams).then(
            response => {
              this.taskList = response.rows;
              this.total = response.total;
              this.loading = false;
            }
          );
        },
      }
    }
</script>

<style scoped>

</style>
