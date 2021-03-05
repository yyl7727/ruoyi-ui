<template>
  <div style="margin-top: 25px;">
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="12">
          <el-form-item label="专业" prop="studentMajor">
            <el-select v-model="formData.studentMajor" placeholder="请选择专业" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in studentMajorOptions" :key="index" :label="item.dictLabel"
                         :value="item.dictValue" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="技术方向" prop="skill">
            <el-select v-model="formData.skill" placeholder="请选择技术方向" multiple clearable
                       :style="{width: '100%'}">
              <el-option v-for="(item, index) in studentSkillOptions" :key="index" :label="item.dictLabel"
                         :value="item.dictValue" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="studentPhone">
            <el-input v-model="formData.studentPhone" placeholder="请输入手机号码" clearable
                      :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电子邮箱" prop="studentEmail">
            <el-input v-model="formData.studentEmail" placeholder="请输入电子邮箱" clearable
                      :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="个人简介" prop="studentDesc">
            <el-input v-model="formData.studentDesc" type="textarea" placeholder="请输入个人简介"
                      :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
  import {addRearch} from "../../api/rearch/rearch";

  export default {
    name: 'Rearch',
    components: {},
    props: [],
    created() {
      this.getDicts("student_skill").then(response => {
        this.studentSkillOptions = response.data
      });
      this.getDicts("student_major").then(response => {
        this.studentMajorOptions = response.data
      });
    },
    data() {
      return {
        formData: {
          studentMajor: undefined,
          skill: [],
          studentPhone: undefined,
          studentEmail: undefined,
          studentDesc: undefined,
        },
        rules: {
          studentMajor: [{
            required: true,
            message: '请选择专业',
            trigger: 'change'
          }],
          skill: [{
            required: true,
            type: 'array',
            message: '请至少选择一个skill',
            trigger: 'change'
          }],
          studentPhone: [{
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }],
          studentEmail: [{
            required: true,
            message: '请输入电子邮箱',
            trigger: 'blur'
          }]
        },
        studentMajorOptions: [],
        studentSkillOptions:[]
      }
    },
    computed: {},
    watch: {},
    mounted() {},
    methods: {
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (valid) {
            addRearch(this.formData).then(response => {
              this.msgSuccess("发布成功")
              this.resetForm()
            });
          }
        })
      },
      resetForm() {
        this.$refs['elForm'].resetFields()
      },
    }
  }

</script>
<style>
</style>
