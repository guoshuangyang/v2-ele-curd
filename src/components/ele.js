import {
  Pagination,
  Table,
  TableColumn,
  Drawer,
  Checkbox,
  CheckboxGroup,
  Form,
  FormItem,
  Input,
  Button,
  InputNumber,
  Radio,
  RadioGroup,
  Select,
  Option,
  OptionGroup,
  Calendar,
  DatePicker
} from "element-ui"

const eleComponents = [
  Pagination,
  Table,
  TableColumn,
  Drawer,
  Checkbox,
  CheckboxGroup,
  Form,
  FormItem,
  Input,
  Button,
  InputNumber,
  Radio,
  RadioGroup,
  Select,
  Option,
  OptionGroup,
  Calendar,
  DatePicker
]

export const useComponent = {
  install: function (Vue) {
    eleComponents.forEach((component) => {
      Vue.component(component.name, component)
    })
  }
}
