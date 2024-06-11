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

import {stateListener} from './state.js';

export default class Sidebar {
  constructor($root, {app}) {
    this.$root = $root;
    this.app = app;

    // Bind callbacks
    this.onStateChange = this.onStateChange.bind(this);

    stateListener.on('change', this.onStateChange);
  }

  onStateChange(oldState, state, changedProps) {
    if (changedProps.has('pinnedDemo')) {
      const $oldDemo = this.$root.querySelector('responsive-container');
      const $newDemo = this.app.content.cloneSelectedDemo(state.pinnedDemo);
      const $demoParent = $oldDemo.parentElement;

      $demoParent.insertBefore($newDemo, $oldDemo);
      $demoParent.removeChild($oldDemo);
    }

    if (changedProps.has('isSidebarTransitioning')) {
      if (state.isSidebarTransitioning) {
        this.$root.style.minWidth = `${state.sidebarWidth - 1}px`;
      } else {
        this.$root.style.minWidth = null;
      }
    }
  }
}
