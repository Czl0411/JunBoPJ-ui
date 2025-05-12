module.exports = {
    parserOptions: {
      parser: '@babel/eslint-parser', // 使用 Babel 解析器
      ecmaVersion: 2020, // 根据项目需求调整 ECMAScript 版本
      sourceType: 'module'
    },
    extends: ['plugin:vue/essential', 'eslint:recommended'], // 继承 Vue 和 ESLint 推荐规则
    rules: {
      // 可根据需要自定义规则，暂时保持默认
    }
  };