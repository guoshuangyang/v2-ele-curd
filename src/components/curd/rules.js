const Rule = {
  required: (message = "必填项") => {
    let base = [
      {
        required: true,
        message: "请输入" + message,
        trigger: "blur",
      },
      {
        required: true,
        message: "请输入" + message,
        trigger: "change",
      },
    ];
    if (typeof message === "string") {
      return base;
    } else if (message instanceof Object && message.message) {
      return base.map((item) => {
        item.message = message.message;
        return item;
      });
    }
  },
  phone: () => [
    {
      required: true,
      message: "请输入手机号码",
      trigger: "blur",
    },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号码格式不正确",
      trigger: "change",
    },
  ],
  email: () => [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    {
      pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
      message: "邮箱格式不正确",
      trigger: "change",
    },
  ],
  idNumber: () => [
    {
      required: true,
      message: "请输入身份证号码",
      trigger: "blur",
    },
    {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: "身份证号码格式不正确",
      trigger: "change",
    },
  ],
  bankCard: () => [
    {
      required: true,
      message: "请输入银行卡号",
      trigger: "blur",
    },
    {
      pattern: /^([1-9]{1})(\d{11}|\d{15}|\d{16}|\d{17}|\d{18})$/,
      message: "银行卡号格式不正确",
      trigger: "change",
    },
  ],
  money: () => [
    {
      required: true,
      message: "请输入金额",
      trigger: "blur",
    },
    {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: "金额格式不正确",
      trigger: "change",
    },
  ],
  // 字符型数字
  textNum: (text = "数字") => [
    {
      required: true,
      message: "请输入" + text,
      trigger: "blur",
    },
    {
      pattern: /^[0-9]*$/,
      message: text + "格式不正确" + "，请输入数字",
      trigger: "blur",
    },
  ],
  strongPassword: () => [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    {
      // 8-16位，至少包含一个大写字母，一个小写字母和一个数字
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
      message: "密码格式不正确",
      trigger: "blur",
    },
  ],
};

// 表单校验的规则
export default Rule;
