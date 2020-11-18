import { html } from "htm/react";
import React from "react";

export default function AnotherTestView() {
  return html`
    <style>
      .another-view {
        width: 100%;
        height: 100vh;
        background: red;
        color: #fff;
      }

      p {
        margin: 0;
        padding: 1rem;
      }
    </style>

    <div class="another-view">
      <p>Hello another world</p>
    </div>
  `;
}
