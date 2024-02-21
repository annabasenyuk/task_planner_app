module.exports = {
  parser: "babel-eslint",
  plugins: [
    'jsx-a11y',
  ],
  rules: {
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/label-has-for":"off",
    "import/no-extraneous-dependencies": "off",
    'import/no-named-as-default': 0,
    'max-len': [
      'error',
      {
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        assert: 'either',
      },
    ],
  },
};