<template>
    <el-dialog :visible.sync="visible" class="app-cu-dialog" v-bind="dialogOptions" @close="onClose" :key="keyNum">
        <div class="dialog-content">
            <!-- 处理表单额外的内容 -->
            <AppForm v-if="visible" ref="formRef" :formOptions="formOptions" :columns="columns" :loading="loading"
                :labelWidth="labelWidth" :size="size" :controlWidth="controlWidth"></AppForm>
            <slot name="form-content"></slot>
        </div>

        <template #footer>
            <div class="flex justify-end">
                <el-button @click="cancelBtn" :disabled="dialogOptions.disabled || loading">取 消</el-button>
                <el-button type="primary" :disabled="dialogOptions.disabled" :loading="loading" @click="confirmBtn">确
                    定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import AppForm from "./AppForm.vue"
let num = 9999

export default {
    name: "AppCU",
    components: {
        AppForm
    },
    props: {
        value: {
            type: Boolean,
            required: true,
            default: false
        },
        dialogOptions: {
            type: Object,
            default: () => ({})
        },
        formOptions: {
            type: Object,
            default: () => ({})
        },
        columns: {
            type: Array,
            default: () => []
        },
        labelWidth: {
            type: String,
            default: "100px"
        },
        size: {
            type: String,
            default: "small"
        },
        loading: {
            type: Boolean,
            default: false
        },
        controlWidth: {
            type: String,
            default: "100%"
        }
    },
    computed: {
        visible: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit("input", val)
            }
        }
    },
    data() {
        return {
            keyNum: ++num
        }
    },
    methods: {
        onClose() {
            this.$emit("input", false)
        },
        confirmBtn() {
            this.$refs.formRef
                .validateForm()
                .then((formData) => {
                    this.$emit("confirm", formData)
                })
                .catch(() => { })
        },
        cancelBtn() {
            if (this.loading) {
                this.$message({
                    message: "正在提交数据，请稍后再试！",
                    type: "warning"
                })
                return
            }
            // 抛出事件
            this.$emit("input", false)
            this.$emit("cancel")
        }
    }
}
</script>

<style lang="scss">
.dialog-content {
    max-height: calc(85vh - 160px) !important;
    overflow: hidden;
    overflow-y: auto;
    padding: 10px 16px;
}

.app-cu-dialog {
    .el-dialog {
        margin-top: 8vh !important;
    }

    .el-dialog__header {
        border-bottom: 1px solid #ebeef5;
    }

    .el-dialog__body {
        padding: 0px !important;
    }

    .el-dialog__footer {
        border-top: 1px solid #ebeef5;
    }
}
</style>
