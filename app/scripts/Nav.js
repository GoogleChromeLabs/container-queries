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

import {getState, setState, stateListener} from './state.js';

export default class Nav {
  constructor($root, {app}) {
    this.$root = $root;
    this.app = app;

    // Bind callbacks.
    this.onLinkClick = this.onLinkClick.bind(this);
    this.onStateChange = this.onStateChange.bind(this);

    stateListener.on('change', this.onStateChange);

    // Add a delegated listener for all clicks on `.Nav-link` elements.
    document.addEventListener('click', (event) => {
      const targetElement = event.target.closest('.Nav-link');
      if (targetElement) {
        this.onLinkClick(event, targetElement);
      }
    });
  }

  onStateChange(oldState, newState) {
    if (oldState.selectedPage === newState.selectedPage) return;

    const prevSelectedLink = this.$root.querySelector(`.Nav-link--selected`);
    if (prevSelectedLink) {
      prevSelectedLink.classList.remove('Nav-link--selected');
    }

    const nextSelectedLink =
        this.$root.querySelector(`.Nav-link[href="#${newState.selectedPage}"]`);
    if (nextSelectedLink) {
      nextSelectedLink.classList.add('Nav-link--selected');
    }
  }

  onLinkClick(evt, link) {
    evt.preventDefault();
    window.location.hash = link.hash;

    const state = getState();
    if (state.isNavInDrawerMode) {
      setState({isNavDrawerOpen: false});
    }
  }
}
