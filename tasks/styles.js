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
import * as postcss from 'postcss';
import {compile} from 'sass';
import * as config from '../config.js';

// Matches `(container-type: inline-size)`
const CQ = /^\(\s*container-type\s*:\s*inline-size\s*\)$/;

// Matches `not (container-type: inline-size)`
const NO_CQ = /^not\s+\(\s*container-type\s*:\s*inline-size\s*\)$/;

function optimizeCSS(css, options) {
  // Parse the CSS
  const root = postcss.parse(css);

  root.walkAtRules('supports', (rule) => {
    const condition = rule.params.trim();

    // By default
    // - Unwrap @supports(CQ) blocks since support is assumed
    if (options.target === 'auto') {
      if (condition.match(CQ)) {
        rule.replaceWith(rule.nodes);
      }
    }

    // If the fallback is omitted:
    // - Unwrap @supports(CQ) blocks
    // - Remove @supports(NO_CQ) blocks entirely
    else if (options.target === 'modern') {
      if (condition.match(CQ)) {
        rule.replaceWith(rule.nodes);
      }
      if (condition.match(NO_CQ)) {
        rule.remove();
      }
    }

    // If the fallback is forced:
    // - Unwrap @supports(CQ_NQ) blocks
    // - Remove @supports(CQ) blocks entirely
    else if (options.target === 'fallback') {
      if (condition.match(CQ)) {
        rule.remove();
      }
      if (condition.match(NO_CQ)) {
        rule.replaceWith(rule.nodes);
      }
    }

    // If the fallback is forced:
    // - Unwrap @supports(CQ_NQ) blocks
    // - Remove @supports(CQ) blocks entirely
    else if (options.target === 'none') {
      if (condition.match(CQ)) {
        rule.remove();
      }
      if (condition.match(NO_CQ)) {
        rule.remove();
      }
    }
  });

  // Return the processed CSS as a string
  return root.toString();
}

export async function compileCSS() {
  const result = compile('./app/styles/main.scss', {
    style: config.ENV === 'production' ? 'compressed' : undefined,
    loadPaths: ['node_modules'],
  });

  await Promise.all([
    fs.outputFile(
      path.join(config.publicDir, 'main.css'),
      optimizeCSS(result.css, {target: 'auto'})
    ),
    fs.outputFile(
      path.join(config.publicDir, 'main-modern-only.css'),
      optimizeCSS(result.css, {target: 'modern'})
    ),
    fs.outputFile(
      path.join(config.publicDir, 'main-fallback-only.css'),
      optimizeCSS(result.css, {target: 'fallback'})
    ),
    fs.outputFile(
      path.join(config.publicDir, 'main-no-fallback.css'),
      optimizeCSS(result.css, {target: 'none'})
    ),
  ]);
}
