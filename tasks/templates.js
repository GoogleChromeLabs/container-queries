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

import path from 'node:path';
import fs from 'fs-extra';
import hljs from 'highlight.js';
import nunjucks from 'nunjucks';
import * as config from '../config.js';

const env = nunjucks.configure('./app/templates', {
  autoescape: false,
  watch: false,
  noCache: true,
});

function RemoteExtension() {
  this.tags = ['highlight'];

  this.parse = function (parser, nodes, lexer) {
    // get the tag token
    let tok = parser.nextToken();

    // parse the args and move after the block end. passing true
    // as the second arg is required if there are no parentheses
    let args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);

    // parse the block contents
    let body = parser.parseUntilBlocks('endhighlight');
    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'run', args, [body]);
  };

  this.run = function (context, language, block) {
    // Remove leading and trailing whitespace, with the exception of
    // leading whitespace on the first line with text.
    let code = block().replace(/^(\s*\n)+|\s+$/g, '');

    const firstLineWhitespace = /^\s*/.exec(code);
    if (firstLineWhitespace) {
      code = code
        .split('\n')
        .map((line) => {
          return line.replace(firstLineWhitespace, '');
        })
        .join('\n');
    }

    code = hljs.highlight(code, {language}).value;

    // Allow for highlighting portions of code blocks
    // using `**` before and after.
    return `<pre><code class="language-${language}">${code.replace(
      /\*\*(.+)?\*\*/g,
      `<mark>$1</mark>`
    )}</code></pre>`;
  };
}

env.addExtension('RemoteExtension', new RemoteExtension());

export async function compileTemplates() {
  await Promise.all([
    fs.outputFile(
      path.join(config.publicDir, 'index.html'),
      nunjucks.render('index.html', {...config, version: 'auto'})
    ),
    fs.outputFile(
      path.join(config.publicDir, 'native-only.html'),
      nunjucks.render('index.html', {...config, version: 'native'})
    ),
    fs.outputFile(
      path.join(config.publicDir, 'fallback-only.html'),
      nunjucks.render('index.html', {...config, version: 'fallback'})
    ),
    fs.outputFile(
      path.join(config.publicDir, 'no-fallback.html'),
      nunjucks.render('index.html', {...config, version: 'none'})
    ),
  ]);
}
