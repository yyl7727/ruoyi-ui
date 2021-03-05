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
        <el-table-column label="个人简介" align="center" prop="studentDesc" />
        <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-circle-plus-outline" @click="handleUpdate(scope.row)">邀请加入课题</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  import { listInfo } from "../../api/rearch/info";

  export default {
    name: 'info',
    created() {
      this.getDicts("student_major").then(response => {
        console.log(response.data)
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
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          studentName: null,
          studentMajor: null
        },
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
    }
  }
</script>

<style scoped>

</style>
