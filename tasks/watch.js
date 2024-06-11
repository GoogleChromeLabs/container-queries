/*
 Copyright 2024 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import chokidar from 'chokidar';
import {compileCSS} from './styles.js';
import {startServer} from './server.js';
import {compileTemplates} from './templates.js';

const cssWatcher = chokidar.watch('app/styles/**/*');

cssWatcher.on('ready', () => {
  cssWatcher.on('all', (...args) => {
    console.log('css', ...args);
    compileCSS().catch(console.error);
  });
});

const templateWatcher = chokidar.watch('app/templates/**/*');

templateWatcher.on('ready', () => {
  templateWatcher.on('all', (...args) => {
    console.log('content', ...args);
    compileTemplates().catch(console.error);
  });
});

startServer();
