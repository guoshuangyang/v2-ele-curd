<template>
    <el-form v-bind="formOptions" v-loading="loading" :model="formData" ref="formRef" :key="keyNum">
        <el-row :gutter="16">
            <el-col v-for="(item, index) in list" :key="index" :span="item.vShow ? (item.full ? 24 : 12) : 0">
                <slot :name="item.key" v-bind:item="item" v-bind:formData="formData">
                    <el-form-item :label="item.label" :label-width="labelWidth" :rules="item.rules" :size="size"
                        :prop="item.key" v-if="item.vIf ? item.vIf(formData) : true">
                        <slot :name="item.key + '_content'" v-bind:item="item" v-bind:formData="formData">
                            <!-- 输入字 -->
                            <template v-if="item.type === 'input'">
                                <el-input v-model="formData[item.key]" :key="item.uid" :style="{
                                    width: `${controlWidth} !important`
                                }" v-bind="getFormItemBind(item)"></el-input>
                            </template>
                            <!-- 输入数字 -->
                            <template v-else-if="item.type === 'number'">
                                <el-input-number v-model="formData[item.key]" :key="item.uid"
                                    :style="{ width: `${controlWidth} !important` }"
                                    v-bind="getFormItemBind(item)"></el-input-number>
                            </template>
                            <!-- 文本域 -->
                            <template v-else-if="item.type === 'textarea'">
                                <el-input type="textarea" v-model="formData[item.key]" :key="item.uid"
                                    :style="{ width: `${controlWidth} !important` }"
                                    v-bind="getFormItemBind(item)"></el-input>
                            </template>
                            <!-- 选择框 -->
                            <template v-else-if="item.type === 'select'">
                                <el-select v-model="formData[item.key]" v-bind="getFormItemBind(item)"
                                    :style="{ width: `${controlWidth} !important` }" clearable :key="item.uid">
                                    <el-option v-for="(option, index) in item.options" :key="index" :label="option.label"
                                        :value="option.value"></el-option>
                                </el-select>
                            </template>
                            <!-- 单选框 -->
                            <template v-else-if="item.type === 'radio'">
                                <el-radio-group v-model="formData[item.key]" v-bind="getFormItemBind(item)">
                                    <el-radio v-for="(option, index) in item.options" :key="index" :label="option.value">{{
                                        option.label }}</el-radio>
                                </el-radio-group>
                            </template>
                            <!-- 级联 -->
                            <template v-else-if="item.type === 'cascader'">
                                <el-cascader v-model="formData[item.key]" v-bind="getFormItemBind(item)" :key="item.uid"
                                    :style="{ width: `${controlWidth} !important` }"></el-cascader>
                            </template>
                            <template v-else-if="['date', 'month', 'daterange'].includes(item.type)">
                                <el-date-picker v-model="formData[item.key]" v-bind="getFormItemBind(item)" :key="item.uid"
                                    :style="{ width: `${controlWidth} !important` }">
                                </el-date-picker>
                            </template>
                        </slot>
                    </el-form-item>
                </slot>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
import { cloneDeep } from "lodash-es"
import { v4 as uuid } from "uuid"
const notNeedKeysInVBind = ["key", "value", "rules", "uid", "label", "full"]
let num = 9999

export default {
    name: "AppForm",
    components: {},
    props: {
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
        // 控件的宽度
        controlWidth: {
            type: String,
            default: "100%"
        }
    },
    computed: {
        list() {
            return this.columns
                .map((item) => {
                    return {
                        ...cloneDeep(item),
                        uid: uuid(),
                        placeholder: item.placeholder || `请输入${item.label}`,
                        rules: item.rules || [],
                        vShow: item.vShow || true,
                        options: item.options || []
                    }
                })
                .filter((item) => !item.formHidden)
        },

    },
    data() {
        return {
            formData: {},
            cascaderData: {},
            keyNum: ++num
        }
    },
    created() {
        this.initValue()
    },
    methods: {
        initValue() {
            this.formData = this.list.reduce((acc, cur) => {
                switch (cur.type) {
                    case "daterange":
                        acc[cur.key] = cur.value || []
                        break
                    default:
                        acc[cur.key] = cur.value || null
                        break
                }
                return acc
            }, {})
        },
        getFormItemBind(item) {
            const bind = {}
            Object.keys(item).forEach((key) => {
                if (!notNeedKeysInVBind.includes(key)) {
                    bind[key] = item[key]
                }
            })
            return bind
        },
        validateForm() {
            return new Promise((resolve, reject) => {
                this.$refs.formRef.validate((valid) => {
                    if (!valid) {
                        reject()
                    } else {
                        let obj = {}
                        let keys = Object.keys(this.formData)
                        for (let i = 0; i < keys.length; i++) {
                            let key = keys[i]
                            let itemConfig = this.list.find((item) => item.key === key)
                            if (itemConfig.vIf && !itemConfig.vIf(this.formData)) {
                                continue
                            }
                            // 特殊处理，如果是cascade，取最后一个值
                            if (Array.isArray(this.formData[key]) && itemConfig.type === "cascader") {
                                obj[key] = this.formData[key][this.formData[key].length - 1]
                                continue
                            }
                            obj[key] = this.formData[key]
                        }
                        resolve(obj)
                    }
                })
            })
        }
    }
}
</script>
