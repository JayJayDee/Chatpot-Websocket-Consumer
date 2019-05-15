import { injectable } from 'smart-factory';
import { join } from 'path';
import { readFile } from 'fs';
import * as markdownit from 'markdown-it';

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
      const md = markdownit();
      return async (req, res, next) => {
        const mdContent = await readMd(mdFullPath('socket-io.md'));
        const html = md.render(mdContent);

        res.set('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(html);
      };
    });