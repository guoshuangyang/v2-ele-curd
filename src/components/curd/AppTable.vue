<template>
    <div class="flex flex-wrap justify-center app-table">
        <div class="w-full">
            <el-table v-bind="$attrs" width="100%" :header-cell-style="{
                background: '#F6F8FC',
                height: '40px',
                fontWeight: '600',
                color: '#333',
                border: 0
            }" border stripe header-cell-class-name="element_plus_app_table_header" v-loading="loading" v-on="$listeners">
                <el-table-column v-if="hasSelect" type="selection" width="55" />
                <template v-for="item in showColumns">
                    <slot :name="item.key">
                        <el-table-column :label="item.label" :key="item.key" :prop="item.key"
                            :width="item.width || undefined" :align="align">
                            <template v-if="item.render" #default="scope">
                                {{ item.render(scope.row, scope.$index, item) }}
                            </template>
                        </el-table-column>
                    </slot>
                </template>
                <slot name="default"> </slot>
            </el-table>
        </div>
        <el-pagination class="app-table-pagination" :current-page.sync="paginationObj.currentPage"
            :page-size.sync="paginationObj.pageSize" :page-sizes="[10, 20, 50, 100]" background
            layout="sizes, prev, pager, next, total" v-if="hasPagination" :total="paginationObj.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        <el-drawer :visible.sync="filterDrawer" size="400px" title="表格显示列" :before-close="handleClose" append-to-body>
            <div class="px-5">
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
                    @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="checkedItems">
                    <el-checkbox v-for="item in realColumns" :key="item.key" :label="item.key">{{
                        item.label
                    }}</el-checkbox>
                </el-checkbox-group>
            </div>
        </el-drawer>
    </div>
</template>

<script>
export default {
    name: "AppTable",
    props: {
        columns: {
            type: Array,
            default: () => []
        },
        // 要隐藏的列，根据key来隐藏
        hiddenColumns: {
            type: Array,
            default: () => []
        },
        hasSelect: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        pagination: {
            type: Object,
            default: () => ({
                currentPage: 1,
                pageSize: 10,
                total: 0
            })
        },
        align: {
            type: String,
            default: "left"
        },
        hasPagination: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        realColumns() {
            return this.columns.filter((item) => !item.tableHidden)
        },
        paginationObj: {
            get() {
                return this.pagination
            },
            set(val) {
                this.$emit("update:pagination", val)
            }
        },
        isIndeterminate() {
            return this.checkedItems.length > 0 && this.checkedItems.length < this.realColumns.length
        }
    },
    data() {
        return {
            filterDrawer: false,
            checkAll: true,
            showColumns: [],
            checkedItems: []
        }
    },
    created() {
        this.checkedItems = this.realColumns.map((item) => item.key)
    },
    watch: {
        hiddenColumns: {
            immediate: true,
            handler(val) {
                let arr = []
                this.realColumns.forEach((item) => {
                    if (!val.includes(item.key)) {
                        arr.push(item)
                    }
                })
                this.showColumns = arr
            }
        }
    },
    methods: {
        handleClose(done) {
            this.filterDrawer = false
            let hiddenArr = []
            this.realColumns.forEach((item) => {
                if (!this.checkedItems.includes(item.key)) {
                    hiddenArr.push(item.key)
                }
            })
            this.$emit("hiddenColumnsChange", hiddenArr)
            this.showColumns = this.realColumns.filter((item) => this.checkedItems.includes(item.key))
            done()
        },
        handleSizeChange(val) {
            this.paginationObj.pageSize = val
            this.paginationObj.currentPage = 1
            this.$emit("paginationChange", this.paginationObj)
        },
        handleCurrentChange(val) {
            this.paginationObj.currentPage = val
            this.$emit("paginationChange", this.paginationObj)
        },
        handleCheckAllChange(val) {
            this.checkedItems = val ? this.realColumns.map((item) => item.key) : []
        },
        showFilter() {
            this.filterDrawer = true
        }
    }
}
</script>

<style lang="scss">
.app-table {
    .app-table-pagination {
        margin-top: 10px;
        text-align: right;
    }

    .el-checkbox {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}
</style>
