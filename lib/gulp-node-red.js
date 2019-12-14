const File = require('vinyl');
const through = require('through2').obj;

const { ErrorMessage } = require('./error-message');
const { FileType } = require('./file-type');
const { isBalanced } = require('./utils');
const { jsTemplate, htmlTemplate } = require('./templates');

/**
 * @param {string} nodePrefix
 */
module.exports = function gulpNodeRedPipe(nodePrefix) {
  'use strict';

  let nodeRedFiles = {
    [FileType.JS]: {},
    [FileType.HTML]: {},
  };

  function processFiles(file, enc, callback) {
    if (!nodeRedFiles[file.extname][file.stem]) {
      nodeRedFiles[file.extname][file.stem] = '';
    }

    nodeRedFiles[file.extname][file.stem] = `
      ${nodeRedFiles[file.extname][file.stem]}
      ${file.contents.toString()}
    `;

    callback();
  }

  function flushResult(callback) {
    let nodeNameList = Object.keys(nodeRedFiles[FileType.JS]);
    let isUnbalanced = !isBalanced(
      nodeRedFiles[FileType.JS],
      nodeRedFiles[FileType.HTML],
    );

    if (isUnbalanced) {
      callback(new Error(ErrorMessage.UnbalancedInput));
    }

    for (let nodeName of nodeNameList) {
      let js = jsTemplate(nodeRedFiles[FileType.JS][nodeName]);

      let html = htmlTemplate(
        nodeName,
        nodePrefix,
        nodeRedFiles[FileType.HTML][nodeName],
      );

      let output = new File({
        contents: Buffer.from(`${js}${html}`),
        base: process.cwd(),
        path: `${process.cwd()}/${nodeName}/${nodeName}.html`,
      });

      this.push(output);
    }

    callback();
  }

  return through(processFiles, flushResult);
};
