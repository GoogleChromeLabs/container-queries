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

import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import * as config from './config.js';

const ENV = config.ENV || 'development';

export default {
  input: [
    'app/scripts/main.js',
    'app/scripts/responsive-container.js',
  ],
  output: {
    format: 'esm',
    dir: config.publicDir,
    chunkFileNames: '[name].js',
  },
  plugins: [
    replace({
      values: {
        'self.__ENV__': JSON.stringify(ENV),
      },
      preventAssignment: true,
    }),
    ENV === 'production' &&
      terser({
        module: true,
        mangle: true,
        compress: true,
      }),
  ],
};
