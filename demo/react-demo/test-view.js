import { html } from "htm/react";
import React from "react";

export default function TestView() {
  return html`
    <style>
      .test-view {
        width: 100%;
        height: 100vh;
        background: blue;
        color: #fff;
      }

      p,
      a {
        margin: 0;
        padding: 1rem;
        color: inherit;
      }
    </style>

    <div class="test-view">
      <p>Hello world</p>
      <a href="another"><p>Go to another view</p></a>
    </div>
  `;
}
