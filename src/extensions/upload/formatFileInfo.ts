const { nameToSlug } = require('@strapi/utils');
const path = require("path");
const { extension } = require("mime-types");

const generateFileName = (name) => {
  const baseName = nameToSlug(name, { separator: '_', lowercase: false });

  // Change baseName
  return `${baseName};`
};

const formatFileInfo = async ({ filename, type, size }, fileInfo = {}, metas = {}) => {
  const fileInfoAny = fileInfo;
  const metasAny = metas;
  const fileService = strapi.plugin("upload").service("file");

  let ext = path.extname(filename);
  if (!ext) {
    ext = `.${extension(type)}`;
  }
  const usedName = (fileInfoAny.name || filename).normalize();
  const basename = path.basename(usedName, ext);

  const entity = {
    name: usedName,
    alternativeText: fileInfoAny.alternativeText,
    caption: fileInfoAny.caption,
    folder: fileInfoAny.folder,
    folderPath: await fileService.getFolderPath(fileInfoAny.folder),
    hash: generateFileName(basename), // Generate or change file name here
    ext,
    mime: type,
    size: Math.round((size / 1000) * 100) / 100,
  };

  const { refId, ref, field } = metasAny;

  if (refId && ref && field) {
    entity.related = [
      {
        id: refId,
        __type: ref,
        __pivot: { field },
      },
    ];
  }

  if (metasAny.path) {
    entity.path = metasAny.path;
  }

  if (metasAny.tmpWorkingDirectory) {
    entity.tmpWorkingDirectory = metasAny.tmpWorkingDirectory;
  }

  return entity;
}

module.exports = formatFileInfo;
