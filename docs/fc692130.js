import{h as e}from"./0b10f69c.js";import{V as r}from"./acf6f4ee.js";import"./2b1f74ae.js";let t,o=e=>e;class s extends r{static get styles(){return[super.styles]}render(){return e(t||(t=o`<h2>Sub-Routes</h2> <p> The Simplr Router supports subroutes, making routing of an application easier with less repetition of route parameters or guards. </p> <p> A simple example would be a User-page with multiple sub-pages. This could be built like so: </p> <highlight-js lang="javascript" theme="gruvbox-dark"> import SimplrRouter from '@simplr-wc/router'; import './views/main-page.js'; import './views/user-profile.js'; import './views/user-root.js'; import './views/user-profile-edit.js'; const routes = [ { path: '/', component: 'main-page', }, { path: '/user', component: 'user-root', routes: [ { path: ':userId', component: 'user-profile', routes: [ { path: 'edit', component: 'user-profile-edit', }, ], }, ], }, ]; const router = new SimplrRouter({ routes }); router.init(); </highlight-js> <p>In the example above, you have the following routes:</p> <ul> <li>/</li> <li>/user</li> <li>/user/{any ID we want}</li> <ul> <li>For example /user/123</li> </ul> <li>/user/123/edit</li> </ul> <p> And our Web Components in the views with a dynamic parameter (:userId) will have a property containing the value from the url </p> <p> For example for the route <code>/user/123/edit</code>, the view <code>user-profile-edit</code> has access to the property <code>userId</code>, which is accessed by <code>this.userId</code> and contains the value <code>123</code>. </p> `))}}customElements.get("router-docs-sub-routes")||customElements.define("router-docs-sub-routes",s);export{s as RouterDocsSubRoutes};