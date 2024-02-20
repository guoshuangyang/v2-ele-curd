<template>
    <div id="app">
        <el-card style="margin: 20px" header="AppTable：基础Table包含分页器">
            <AppTable :columns="tableQuery" :data="tableData" :pagination.sync="pagination"
                @paginationChange="getTableData"></AppTable>
        </el-card>
        <el-card style="margin: 20px" header="AppForm：基础Form">
            <AppForm :columns="formColumns"></AppForm>
        </el-card>
        <el-card style="margin: 20px" header="AppCU：基础编辑和新增的校验">
            <el-button type="primary" @click="
                formColumns.clearValue()
            cuOptions.title = '新增'
            cuShow = true
                ">
                <i class="el-icon-plus"></i> 新增
            </el-button>
            <el-button @click="
                formColumns.setArrValue({
                    test1: '测试1',
                    test2: '1'
                })
            cuOptions.title = '编辑'
            cuShow = true
                ">
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
        rules: Rule.required("请输入测试字段")
    }
])
let tableQuery = cloneOption
    .clone()
    .getAll()
    .map((item) => ({
        label: item.label,
        key: item.key,
        render: item.render || null
    }))
export default {
    name: "App",
    components: {
        AppTable,
        AppForm,
        AppCU
    },
    created() { },
    data() {
        return {
            tableQuery,
            formColumns: cloneOption.clone(),
            tableData: [
                {
                    test1: "测试1",
                    test2: "测试2"
                }
            ],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 1
            },
            cuShow: false,
            cuOptions: {
                title: "新增",
                width: "50%"
            },
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
        confirmCU(data) {
            console.log("confirmCU", data)
            // TODO: 提交数据
            this.cuShow = false
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
