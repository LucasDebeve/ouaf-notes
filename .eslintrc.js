module.exports = {
    env: {
        browser: true,
        es2021: true,
        'jest/globals': true,
    },
    extends: ['airbnb-base', 'prettier'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['prettier', 'jest'],
    rules: {
        'prettier/prettier': [
            'warn',
            {
                singleQuote: false,
                trailingComma: 'all',
                tabWidth: 2,
            }
        ],
        'import/prefer-default-export': ['off'],
    },
};
