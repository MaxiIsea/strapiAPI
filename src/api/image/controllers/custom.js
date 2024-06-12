const { parseMultipartData, sanitizeEntity } = require('@strapi/utils');

module.exports = {
  async uploadWithParams(ctx) {
    const { risk1, risk2, schema } = ctx.params;
    const { files } = ctx.request;

    // Validate risk1 and risk2 are between 1 and 10
    const risk1Int = parseInt(risk1, 10);
    const risk2Int = parseInt(risk2, 10);
    const schemaBool = schema === 'true';

    if (isNaN(risk1Int) || isNaN(risk2Int) || risk1Int < 1 || risk1Int > 10 || risk2Int < 1 || risk2Int > 10) {
      return ctx.badRequest('Risk1 and Risk2 must be numeric values between 1 and 10.');
    }

    if (!files || !files.file) {
      return ctx.badRequest('Please provide a file to upload.');
    }

    // Upload the file using Strapi's upload service
    const uploadedFiles = await strapi.plugins['upload'].services.upload.upload({
      data: {}, // additional data to be passed
      files: files.file,
    });

    // Create an entry in the image collection
    const newImage = await strapi.entityService.create('api::image.image', {
      data: {
        risk1: risk1Int,
        risk2: risk2Int,
        schema: schemaBool,
        picture: uploadedFiles[0].id,
      },
    });

    return ctx.send(sanitizeEntity(newImage, { model: strapi.models.image }));
  },
};
