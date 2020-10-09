/* eslint-disable sonarjs/no-duplicate-string */

module.exports = {
    plugins: [
        'sonarjs',
        'unicorn',
        'mocha',
    ],
    extends: [
        'google',
        'plugin:sonarjs/recommended',
        'plugin:unicorn/recommended',
        'plugin:mocha/recommended',
    ],
    parserOptions: {
        ecmaVersion: 10,
    },
    env: {
        node: true,
        es6: true,
    },
    settings: {
        mocha: {
            additionalSuiteNames: ['bundle'],
        },
    },
    rules: {
        'indent': [
            'error',
            4,
        ],
        'max-len': [
            'error',
            100,
        ],
        'linebreak-style': 'off',
        'brace-style': [
            'error',
            'stroustrup',
        ],
        'operator-linebreak': ['error', 'before'],
        'require-jsdoc': ['error', {
            require: {
                ClassDeclaration: false,
            },
        }],
        'comma-dangle': [
            'error',
            {
                arrays: 'only-multiline',
                objects: 'only-multiline',
                imports: 'only-multiline',
                exports: 'only-multiline',
                functions: 'never',
            },
        ],
        'object-curly-spacing': 'always',
    },
    overrides: [{
        files: [
            'test/**/*.js',
        ],
        rules: {
            'sonarjs/no-duplicate-string': 'off',
            'sonarjs/no-identical-functions': 'off',
            'no-invalid-this': 'off',
            'guard-for-in': 'off',
            'unicorn/no-null': 'off',
        },
    }],
};
