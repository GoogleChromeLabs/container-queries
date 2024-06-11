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

import App from './App.js';
import {SECTIONS} from './constants.js';
import {getState, setState} from './state.js';

const main = async () => {
  const app = new App(document.querySelector('.App'));
  document.querySelector('.App').classList.add('App--isInteractive');

  // Listen for breakpoint changes that affect the nav drawer.
  const mql = window.matchMedia('(min-width: 48em)');

  // Set initial state. Do this after all other components are initialized.
  const sectionId = location.hash.slice(1);
  setState({
    selectedPage: SECTIONS.has(sectionId) ? sectionId : 'overview',
    pinnedDemo: 'card',
    sidebarWidth: app.getSidebarWidth(),
    isSidebarHidden: false,
    isSidebarTransitioning: false,
    isNavInDrawerMode: !mql.matches,
    isNavDrawerOpen: false,
    isNavSidebarCollapsed: false,
    isNavTransitioning: false,
  });

  // Update the state when the matched media changes.
  mql.addListener((evt) => {
    const state = getState();

    if (mql.matches) {
      const newState = {
        isNavInDrawerMode: false,
      };
      if (state.isNavDrawerOpen) {
        newState.isNavSidebarCollapsed = false;
      }
      setState(newState);
    } else {
      setState({isNavInDrawerMode: true});
    }
  });
};

main();
