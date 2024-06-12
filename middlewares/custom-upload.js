const { join } = require('path');
const fs = require('fs-extra');
const { nameToSlug } = require('@strapi/utils');

module.exports = async (ctx, next) => {
  if (ctx.url.startsWith('/upload')) {
    const files = ctx.request.files.files;
    if (Array.isArray(files)) {
      for (const file of files) {
        const fileName = `${nameToSlug(file.name.split('.').slice(0, -1).join('.'))}${file.ext}`;
        file.name = fileName;
      }
    } else {
      const fileName = `${nameToSlug(files.name.split('.').slice(0, -1).join('.'))}${files.ext}`;
      files.name = fileName;
    }
  }
  await next();
};