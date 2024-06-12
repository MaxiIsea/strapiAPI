module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/images/:risk1/:risk2/:schema',
      handler: 'custom.uploadWithParams',
      config: {
        auth: false, // Set to true if you need authentication
        policies: [],
        middlewares: [],
      },
    },
  ],
};
