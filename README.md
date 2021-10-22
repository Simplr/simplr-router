![Title Image](assets/simplr-router-logo-banner.png)

[![npm version](https://badgen.net/npm/v/@simplr-wc/router)](https://www.npmjs.com/package/@simplr-wc/router)

# Simplr Router

A small and effective routing solution for Web Components.

## Getting started

Get started using Simplr Router with [one of the guides from the documentation site](https://simplr.github.io/simplr-router/guides/getting-started/using-a-starter/)

```javascript
import { SimplrRouter } from "@simplr-wc/router";

const routes = [
  { path: "", component: "minimal-setup" },
  { path: "example", component: "example-view" },
  { path: "dynamic/:id", component: "dynamic-view" },
];

new SimplrRouter({ routes }).init();
```

## Why

#### Quick and Simple

Simple to get up and running. Basic setup in just a few lines of code.

#### Small

No dependencies and a small codebase means less breaking parts.
0 dependencies means that what you see is what you get.

#### Easy to transition into

Works by utilizing the native API's used for navigation and therefore doesn't require any extra steps compared to your every day MPA.

#### Web Component focused

Built with web components, for web components. Simplr Router was designed from the get go to be used in web component applications.

#### Customizable

Even though there's no configuration necessary to get started, the router ships with a lot of customizability to fit your needs.
 

#### Performant

Allowing for lazy loading and creating dynamic routes, Simplr Router is a great library for projects of all sizes.
Discover
