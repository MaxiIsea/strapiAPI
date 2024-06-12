export default (plugin) => {
  const replaceFileName = () => {
    return {
      ...uploadServices({ strapi }),
      formatFileInfo,
    };
  };

  plugin.services['upload'] = replaceFileName;
  return plugin;
};
