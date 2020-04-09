// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "linebreak-style": 0,
    "quotes": ["error", "double"],
    "no-extend-native": 0,
    "max-len": 0,
    "camelcase": 0,
    "func-names": 0,
    "no-underscore-dangle": 0,
    "no-use-before-define": 0,
    "stric": 0,
    "yoda": 0,
    "no-return-await": 0,
    "no-restricted-globals": 0,
    "prefer-promise-reject-errors": 0,
    "object-curly-spacing": 0,
    "max-classes-per-file": 0,
    "strict": 0,
    "no-mixed-operators": 0,
    "prefer-destructuring": 0,
    "curly": ["error", "all"],
    "object-shorthand": ["error", "methods"], //ensures that no property or method shorthand is used in any object literal.
    "arrow-body-style": 0,
    "global-require": 0,
    "no-bitwise": 0,
    "semi": [2, "always"]
  }
}
