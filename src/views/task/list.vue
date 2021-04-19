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

    <el-table v-loading="loading" :data="taskList">
      <el-table-column label="课题名称" prop="taskName" width="180" />
      <el-table-column label="课题类型" prop="taskType" width="150" />
      <el-table-column label="课题人数" prop="taskNum"  width="100" />
      <el-table-column label="课题描述" prop="taskDesc" :show-overflow-tooltip="true" width="300" />
      <el-table-column label="状态" prop="status" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '0'">可选</span>
          <span v-if="scope.row.status === '1'">不可选</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" v-if="scope.row.status === '0'" @click="handleApply(scope.row)">申请加入</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
  </div>
</template>

<script>
  import {
    getTask,
    allList, applyIntoTask
  } from '../../api/task/list'

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
        //申请加入课题
        handleApply(row) {
          this.form = {
            taskId: row.taskId,
            taskName: undefined,
            taskType: undefined,
            taskNum: 1,
            taskDesc: undefined,
            status: "0",
          };
          applyIntoTask(this.form).then(response => {
            this.msgSuccess("申请发送成功");
          })
        },
        getList() {
          this.loading = true;
          allList(this.queryParams).then(
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
