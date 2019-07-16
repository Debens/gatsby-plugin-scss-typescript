module.exports = {
    skipCI: true,
    hooks: {
        'pre-commit': 'circleci config validate && yarn lint:staged',
        'pre-push': 'yarn test:coverage',
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    },
};
