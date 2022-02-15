exports.onCreateWebpackConfig = ({actions}) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        fs: false,
        path: false,
        assert: false,
        child_process: false,
        crypto: false,
      },
    },
  });
};
