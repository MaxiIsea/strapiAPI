const { join } = require('path');
const fs = require('fs-extra');
const { nameToSlug } = require('@strapi/utils');

module.exports = {
  init(config) {
    const uploadPath = join(strapi.dirs.static.public, 'uploads');

    return {
      async upload(file) {
        await fs.ensureDir(uploadPath);

        // Remove the hash from the file name
        const fileName = `${nameToSlug(file.name.split('.').slice(0, -1).join('.'))}${file.ext}`;
        file.url = `/uploads/${fileName}`;

        await fs.writeFile(join(uploadPath, fileName), file.buffer);

        return file;
      },
      async delete(file) {
        const filePath = join(uploadPath, `${nameToSlug(file.name.split('.').slice(0, -1).join('.'))}${file.ext}`);
        if (fs.existsSync(filePath)) {
          await fs.unlink(filePath);
        }
      },
    };
  },
};
