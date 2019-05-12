import { injectable } from 'smart-factory';
import { join } from 'path';
import { readFile } from 'fs';
import * as showdown from 'showdown';

import { MarkdownModules } from './modules';
import { MarkdownTypes } from './types';

const mdFullPath = (fileName: string) =>
  join(__dirname, fileName);

const readMd = (path: string): Promise<string> =>
  new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) return reject(err);
      resolve(data.toString('utf8'));
    });
  });

injectable(MarkdownModules.SocketIODocs,
  [],
  async (): Promise<MarkdownTypes.SocketIODocs> =>
    () => {
      const converter = new showdown.Converter();
      return async (req, res, next) => {
        const mdContent = await readMd(mdFullPath('socket-io.md'));
        const html = converter.makeHtml(mdContent);

        res.set('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(html);
      };
    });