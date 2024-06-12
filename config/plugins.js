module.exports = ({ env }) => ({
  upload: {
    provider: 'local',
    providerPath: 'providers/upload-local',
    providerOptions: {
      sizeLimit: 1000000, // Example size limit in bytes
    },
  },
});
