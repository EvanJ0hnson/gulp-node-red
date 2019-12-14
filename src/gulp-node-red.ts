import { Transform } from 'stream';
import through2 from 'through2';
import File from 'vinyl';
import { ErrorMessage } from './error-message';
import { FileType } from './file-type';
import { htmlTemplate, jsTemplate } from './templates';
import { isBalanced } from './utils';

const through = through2.obj;

export function gulpNodeRedPipe(nodePrefix: string): Transform {
  'use strict';

  let nodeRedFiles: {
    [key: string]: {
      [key: string]: string;
    };
  } = {
    [FileType.JS]: {},
    [FileType.HTML]: {},
  };

  function processFiles(file: File, enc: string, callback: Function) {
    if (!nodeRedFiles[file.extname][file.stem]) {
      nodeRedFiles[file.extname][file.stem] = '';
    }

    nodeRedFiles[file.extname][file.stem] = `
      ${nodeRedFiles[file.extname][file.stem]}
      ${file.contents ? file.contents.toString() : ''}
    `;

    callback();
  }

  function flushResult(this: Transform, callback: Function) {
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
}
