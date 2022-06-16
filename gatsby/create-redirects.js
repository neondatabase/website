module.exports = ({ redirectFrom, actions, pagePath }) => {
  // Checking if value of redirectFrom is not default
  // Default value of redirectFrom is ['']
  if (redirectFrom[0].length > 0) {
    redirectFrom.forEach((redirectFromPath) => {
      actions.createRedirect({
        fromPath: redirectFromPath,
        toPath: pagePath,
        isPermanent: true,
      });
    });
  }
};
