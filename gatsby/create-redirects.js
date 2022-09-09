module.exports = ({ redirectFrom, actions, pagePath }) => {
  // Checking if value of redirectFrom is not default
  // Default value of redirectFrom is ['']
  if (redirectFrom[0].length > 0) {
    redirectFrom.forEach((redirectFromPath) => {
      // Required redirectForm validation
      if (!redirectFromPath.startsWith('/')) {
        throw new Error(`Redirect "${redirectFromPath}" does not start with '/'!`);
      }

      actions.createRedirect({
        fromPath: redirectFromPath,
        toPath: pagePath,
        isPermanent: true,
      });
    });
  }
};
