module.exports = {
    hooks: {
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
        'pre-commit': 'circleci config validate && yarn lint:staged',
        'pre-push': 'yarn test:coverage',
    },
    skipCI: true,
};
