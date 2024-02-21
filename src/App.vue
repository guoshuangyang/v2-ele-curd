<template>
    <div id="app">
        <div style="color: #409EFF; display: flex;justify-content: flex-end;align-items: center;padding: 10px 20px 0 0;cursor: pointer;"
            @click="goCode">
            <svg xmlns="http://www.w3.org/2000/svg" width="28px" height="22.5px" viewBox="0 0 640 512">
                <path fill="currentColor"
                    d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z" />
            </svg>
        </div>

        <el-card style="margin: 20px" header="AppTable：基础Table包含分页器">
            <AppTable :columns="tableQuery" :data="tableData" :pagination.sync="pagination"
                @paginationChange="getTableData"></AppTable>
        </el-card>
        <el-card style="margin: 20px" header="AppForm：基础Form">
            <AppForm :columns="formColumns"></AppForm>
        </el-card>
        <el-card style="margin: 20px" header="AppCU：基础编辑和新增的校验">
            <el-button type="primary" @click="setAddContent
                ">
                <i class="el-icon-plus"></i> 新增
            </el-button>
            <el-button @click="setEditValue">
                <i class="el-icon-edit"></i> 编辑
            </el-button>
        </el-card>
        <AppCU :columns="formColumns" :dialogOptions="cuOptions" v-model="cuShow" labelWidth="90px" control-width="100%"
            @confirm="confirmCU"></AppCU>
    </div>
</template>

<script>
import CloneOption from "array-action"
import AppTable from "./components/curd/AppTable.vue"
import AppForm from "./components/curd/AppForm.vue"
import AppCU from "./components/curd/AppCU.vue"
import Rule from "./components/curd/rules"
let cloneOption = new CloneOption([
    { label: "测试1", key: "test1", type: "input" },
    {
        label: "测试字段2",
        key: "test2",
        type: "select",
        options: [{ label: "测试1", value: "1" }],
        rules: Rule.required("请输入测试字段"),
    },
    {
        label: "测试字段3",
        key: "test3",
        type: "radio",
        rules: Rule.required("请输入测试字段"),
        options: [{ label: "测试radio1", value: "1" }, { label: "测试radio2", value: "2" }],
        render: function (v, index, _) {
            console.log(v, index, _) // v: 当前值 index: 当前索引 _: 当前字段配置
            let keyString = _.key
            let opts = _.options
            return opts.find((item) => item.value === v[keyString]).label
        }
    }
    // 可以尝试在这新增部分字段
])
// 表单数据 - 对cloneOption进行处理(移除不用字段)
let tableQuery = cloneOption
    .clone()
    .getAll()
    .map((item) => ({
        label: item.label,
        key: item.key,
        render: item.render || null,
        options: item.options || null
    }))
export default {
    name: "App",
    components: {
        AppTable,
        AppForm,
        AppCU
    },
    data() {
        return {
            tableQuery,
            formColumns: cloneOption.clone(),
            // 模拟表单数据
            tableData: [{ test1: "测试1", test2: "测试2", test3: "2" }],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 1
            },
            cuShow: false,
            cuOptions: { title: "新增", width: "50%" },
            cuColumns: cloneOption.clone()
        }
    },
    methods: {
        getTableData() {
            console.log("getData", {
                currentPage: this.pagination.currentPage,
                pageSize: this.pagination.pageSize
            })
            this.tableData = [
                {
                    test1: "测试1 " + this.pagination.currentPage,
                    test2: "测试2 " + this.pagination.currentPage
                },
                {
                    test1: "测试1 " + this.pagination.currentPage,
                    test2: "测试2 " + this.pagination.currentPage
                }
            ]
            this.pagination.total = 200
        },
        setAddContent() {
            // 模拟新增数据
            this.formColumns.setArrValue({ test1: '测试1', test2: '1' })
            this.cuOptions.title = '新增'
            this.cuShow = true
        },
        setEditValue() {
            // 模拟新增数据
            this.formColumns.setArrValue({ test1: '测试1', test2: '1' })
            this.cuOptions.title = '编辑'
            this.cuShow = true
        },
        confirmCU(data) {
            console.log('提交数据', data)
            // TODO: 提交数据
            this.cuShow = false
        },
        goCode() {
            window.open('https://github.com/guoshuangyang/v2-ele-curd/blob/main/src/App.vue', '_blank')
        }
    }
}
</script>

<style>
#app,
html,
body {
    background-color: rgb(179, 179, 179);
}
</style>
