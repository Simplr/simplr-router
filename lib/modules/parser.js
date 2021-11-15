/**
 * Instead of parsing through the paths in runtime on every request,
 * we map the routes into 2 separate groups: Ones with static routes and
 * ones with dynamic routes (routes with e.g. :id).
 *
 * This will make it faster to look up the routes and find the correct ones.
 *
 * TODO: Consider having them as some sort of maps/weakmaps for faster lookup
 * */
export class Parser {
    /**
     * @param {import("./config").Config} config
     */
    constructor(config) {
        this.rootPath = config.rootPath ? this.handleLeadingAndTrailingSlash(config.rootPath) : '';
    }

    /**
     * @param {SimplrRoute[]} routes
     */
    parseRoutes(routes) {
        if (!routes) {
            throw Error(
                'No routes passed during initialization. \n\n' +
                'Please provide the routes in the initialization of Simplr Router.'
            );
        }
        let staticRoutes = [];
        let dynamicRoutes = [];

        this._iterateRoutes(routes, staticRoutes, dynamicRoutes);
        return { dynamicRoutes, staticRoutes };
    }

    /**
     * @param {SimplrRoute[]} routes
     * @param {SimplrRouterNavigationData[]} staticRoutes
     * @param {SimplrRouterNavigationData[]} dynamicRoutes
     * @param {SimplrRouterNavigationData} [parent]
     * @param {boolean} [isNested = false]
     */
    _iterateRoutes(routes, staticRoutes, dynamicRoutes, parent, isNested = false) {
        let index = null;
        for (let route of routes) {
            const navData = /** @type SimplrRouterNavigationData */ ({ ...route, params: {} });
            const hasParent = parent != null;
            const isIndex = navData.path === '/' || navData.path === '';
            // If subroute, we want the route to inherit the props
            if (hasParent || isNested) {
                // If the route doesn't specify it's own guard, we inherit our parent guard
                if (!navData.guard) {
                    navData.guard = parent.guard;
                }
                if (parent.pattern) {
                    navData.pattern = {
                        ...parent.pattern,
                        // Prioritize the routes own patterns
                        ...navData.pattern
                    }
                }
                // Build the path by concatting the parent path
                navData.path = `${parent.path}${this._getRouteSeparator(parent.path, navData.path)}${navData.path}`;
                if (isNested) {
                    navData.nestedParent = parent;
                }
            }

            navData.path = this.buildFullPath(navData.path, !hasParent);
            navData.realPath = route.path;

            if (isIndex) {
                index = { path: navData.path, name: navData.name };
                navData.crumbs = [index];
            } else {
                const baseCrumbs = hasParent ? parent.crumbs : [index];
                navData.crumbs = [...baseCrumbs, { path: navData.path, name: navData.name }];
            }

            if (navData.routes) {
                this._iterateRoutes(navData.routes, staticRoutes, dynamicRoutes, navData);
            }

            if (navData.children) {
                this._iterateRoutes(navData.children, staticRoutes, dynamicRoutes, navData, true);
                if (navData.children.some(ch => ch.path.length <= 0 || ch.path === "/")) {
                    // If we have a base child route, omit adding this route to the list
                    // since the base route will handle this view for us.
                    continue;
                }
            }
            // DO NOT PUT ANY OTHER OPTIONS BEYOND THIS POINT DUE TO THE LOOP BREAKAGE BY CONTINUE 
            if (route.path.includes(':')) {
                dynamicRoutes.push(navData);
            } else {
                staticRoutes.push(navData);
            }

        }
    }

    /**
     * @param {string} partOne
     * @param {string} partTwo
     */
    _needsSlashBetween(partOne, partTwo) {
        return partOne.charAt(partOne.length - 1) !== '/' && partTwo.charAt(0) !== '/';
    }

    /**
     * @returns { string  }
     * */
    parseViewFromUrl() {
        const path = window.location.pathname;
        return path.split('?')[0];
    }

    /**
     * @param {string} path
     * @param {boolean} [addRootPath]
     */
    buildFullPath(path, addRootPath = true) {
        let newPath = path;
        newPath = this.handleLeadingAndTrailingSlash(newPath);
        if (addRootPath) {
            newPath = this._addRootPath(newPath);
        }

        return newPath;
    }

    /**
     * When searching for a route, we build a needle to find from
     * the haystack of routes. If the app has a rootPath set up,
     * we append that to the route to match the full route and
     * update the history accordingly
     *
     * @param {string} path
     */
    buildNeedle(path) {
        const needsToAddRootPath = path.indexOf(this.rootPath) === -1;
        return this.buildFullPath(path, needsToAddRootPath);
    }

    /**
     * @param {string} path
     */
    handleLeadingAndTrailingSlash(path) {
        if (path.substring(0, 1) !== '/') {
            path = `/${path}`;
        }
        if (path.substring(path.length - 1) === '/') {
            path = path.substring(0, path.length - 1);
        }
        return path;
    }

    /**
     * @param {string} route
     */
    splitRouteParts(route) {
        const routeParts = route.split(/\//);
        routeParts.shift(); // Remove the first (empty) entry
        return routeParts;
    }

    /**
     * @param {SimplrRouterNavigationData} routeObject
     * @param {string[]} urlRouteParts
     */
    mapParametersForRoute(routeObject, urlRouteParts) {
        routeObject.params = {};
        routeObject.realPath = routeObject.path;
        for (let index in routeObject.parts) {
            const routePart = routeObject.parts[index];
            if (!routePart.includes(':')) {
                continue;
            }
            // substring to get the key without the ":"
            routeObject.params[routePart.substring(1)] = urlRouteParts[index];
            routeObject.realPath = routeObject.realPath.replace(routePart, urlRouteParts[index]);
        }
    }

    // If the paths require a slash between, add return the slash, otherwise return empty string
    /**
     * @param {string} pathA
     * @param {string} pathB
     */
    _getRouteSeparator(pathA, pathB) {
        return this._needsSlashBetween(pathA, pathB) ? '/' : '';
    }

    /**
     * @param {string} path
     */
    _addRootPath(path) {
        if (path === '/') return this.rootPath ? this.rootPath : '/';

        const rootPath = `${this.rootPath}${this._getRouteSeparator(this.rootPath, path)}${path}`;
        return rootPath.charAt(rootPath.length - 1) === '/' ? rootPath.substring(0, rootPath.length - 1) : rootPath;
    }
}
