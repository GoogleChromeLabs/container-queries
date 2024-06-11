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

// Default breakpoint names and min-width sizes.
// Redefine these as needed for your use case.
const defaultBreakpoints = {SM: 384, MD: 576, LG: 768, XL: 960};

const ro = new ResizeObserver((entries) => {
  entries.forEach((e) => e.target.updateBreakpoints(e.contentRect));
});

class ResponsiveContainer extends HTMLElement {
  connectedCallback() {
    const bps = this.getAttribute('breakpoints');
    this.breakpoints = bps ? JSON.parse(bps) : defaultBreakpoints;
    this.name = this.getAttribute('name') || '';
    ro.observe(this);
  }
  disconnectedCallback() {
    ro.unobserve(this);
  }
  updateBreakpoints(contentRect) {
    for (const bp of Object.keys(this.breakpoints)) {
      const minWidth = this.breakpoints[bp];
      const className = this.name ? `${this.name}-${bp}` : bp;
      this.classList.toggle(className, contentRect.width >= minWidth);
    }
  }
}

self.customElements.define('responsive-container', ResponsiveContainer);
