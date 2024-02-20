<template>
    <div class="app-filter-drawer">
        <el-drawer title="搜索条件" :size="drawerWidth" :visible.sync="drawerVisible" v-bind="$attrs" v-on="$listeners"
            append-to-body :key="keyNum" :wrapperClosable="wrapperClosable">
            <div class="overflow-hidden overflow-y-auto" style="height: calc(100vh - 143px)">
                <div class="py-4 px-6">
                    <el-form :label-position="labelPosition">
                        <template v-for="item in list">
                            <!-- 根据不同的item.type，渲染不同的组件 -->
                            <slot :name="item.key" v-bind:item="item" v-bind:formData="formData">
                                <el-form-item :label="item.label" :label-width="labelWidth" :rules="item.rules" :size="size"
                                    :prop="item.key">
                                    <slot :name="item.key + '_content'" v-bind:item="item" v-bind:formData="formData">
                                        <!-- 输入字 -->
                                        <el-input v-if="item.type === 'input'" v-model="formData[item.key]" :key="item.uid"
                                            class="!w-full" v-bind="getFormItemBind(item)"></el-input>
                                        <!-- 输入数字 -->
                                        <el-input-number v-else-if="item.type === 'number'" v-model="formData[item.key]"
                                            :key="item.uid" class="!w-full"
                                            v-bind="getFormItemBind(item)"></el-input-number>
                                        <!-- 文本域 -->
                                        <el-input v-else-if="item.type === 'textarea'" type="textarea"
                                            v-model="formData[item.key]" :key="item.uid" class="w-full"
                                            v-bind="getFormItemBind(item)"></el-input>
                                        <!-- 选择框 -->
                                        <el-select v-else-if="item.type === 'select'" v-model="formData[item.key]"
                                            v-bind="getFormItemBind(item)" class="!w-full" :key="item.uid">
                                            <el-option v-for="(option, index) in item.options" :key="index"
                                                :label="option.label" :value="option.value"></el-option>
                                        </el-select>
                                        <!-- 单选框 -->
                                        <el-radio-group v-else-if="item.type === 'radio'" v-model="formData[item.key]"
                                            v-bind="getFormItemBind(item)">
                                            <el-radio v-for="(option, index) in item.options" :key="index"
                                                :label="option.value">{{ option.label }}</el-radio>
                                        </el-radio-group>
                                        <!-- 级联 -->
                                        <el-cascader v-else-if="item.type === 'cascader'" v-model="formData[item.key]"
                                            v-bind="getFormItemBind(item)" :key="item.uid" class="w-60"></el-cascader>
                                        <!-- 日期 -->
                                        <el-date-picker v-else-if="['date', 'month', 'daterange'].includes(item.type)
                                            " v-model="formData[item.key]" v-bind="getFormItemBind(item)" :key="item.uid"
                                            class="!w-full"></el-date-picker>
                                        <!-- todo 自定义组件 -->
                                    </slot>
                                </el-form-item>
                            </slot>
                        </template>
                    </el-form>
                </div>
                <!-- -bottom-[72px] -->
                <div class="flex w-full p-4 bottom-0 left-0 absolute justify-end bt-gary">
                    <!-- 取消 -->
                    <el-button size="large" @click="cancel">取消</el-button>
                    <!-- <el-button @click="reset">重置</el-button> -->
                    <el-button size="large" type="primary" @click="search">搜索</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { cloneDeep } from "lodash-es";
import { v4 as uuid } from "uuid";
const notNeedKeysInVBind = ["key", "value", "rules", "uid", "label", "full"];
let defaultNum = 1998;
export default {
    name: "AppFilterDrawer",
    components: {},
    props: {
        // 抽屉的显示与否
        value: {
            type: Boolean,
            default: false,
        },
        columns: {
            type: Array,
            default: () => [],
        },
        // 是否需要根据item含不含有 hasFilter 来判断是否需要将其渲染出来，默认为true
        hasFilter: {
            type: Boolean,
            default: true,
        },
        drawerWidth: {
            type: String,
            default: "450px",
        },
        labelWidth: {
            type: String,
            default: "120px",
        },
        size: {
            type: String,
            default: "small",
        },
        wrapperClosable: {
            type: Boolean,
            default: false,
        },
        labelPosition: {
            type: String,
            default: "top",
        },
    },
    computed: {
        list() {
            let arr = [];
            if (this.hasFilter) {
                arr = this.columns.filter((item) => item.isFilter);
            } else {
                arr = this.columns;
            }
            arr = arr.filter((item) => item.type && item.type !== "upload");
            return arr.map((item) => {
                return {
                    ...cloneDeep(item),
                    uid: uuid(),
                    placeholder: item.placeholder || `请输入${item.label}`,
                    rules: [],
                    vShow: item.vShow ?? true,
                    options: item.options ?? [],
                };
            });
        },
        drawerVisible: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            },
        },
    },
    data() {
        return {
            keyNum: defaultNum++,
            formData: {},
        };
    },
    created() {
        this.initValue();
        this.search();
    },
    methods: {
        initValue() {
            this.formData = this.list.reduce((acc, cur) => {
                switch (cur.type) {
                    case "daterange":
                        // 日期范围初始化成数组
                        acc[cur.key] = cur.value || [];
                        break;
                    default:
                        acc[cur.key] = cur.value ?? null;
                        break;
                }
                return acc;
            }, {});
        },
        cancel() {
            this.$emit("input", false);
            this.$emit("cancel");
        },
        getFormData() {
            let obj = {};
            let formData = cloneDeep(this.formData);
            // 根据规则，将formData中的值进行过滤，只保留有值的
            Object.keys(formData).forEach((key) => {
                if (
                    this.formData[key] !== "" &&
                    this.formData[key] !== null &&
                    this.formData[key] !== undefined
                ) {
                    obj[key] = formData[key];
                }
            });
            formData = null;
            return obj;
        },
        search() {
            this.$emit("search", this.getFormData());
            this.$emit("input", false);
        },
        getQueryData() {
            return this.getFormData();
        },
        getFormItemBind(item) {
            const bind = {};
            Object.keys(item).forEach((key) => {
                if (!notNeedKeysInVBind.includes(key)) {
                    bind[key] = item[key];
                }
            });
            return bind;
        },
    },
};
</script>

<style lang="scss">
.app-filter-drawer {
    .el-drawer__body {
        position: relative;
    }

    .el-drawer__header {
        margin-bottom: 0px !important;
        padding: 20px !important;
        border-bottom: 1px solid #ebeef5;
    }

    .bt-gary {
        border-top: 1px solid #ebeef5;
    }

    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
        margin-bottom: 3px;
    }

    .el-form--label-top .el-form-item__label {
        padding-bottom: 0px;
    }
}
</style>
