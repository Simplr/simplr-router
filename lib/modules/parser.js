export default class Parser {
    constructor(config) {
        this.rootPath = config.rootPath ? this.handleLeadingAndTrailingSlash(config.rootPath) : '';
    }

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

    _iterateRoutes(routes, staticRoutes, dynamicRoutes, parent) {
        let index = null;
        for (let route of routes) {
            const hasParent = parent != null;
            const isIndex = route.path === '/' || route.path === '';
            // If subroute, we want the route to inherit the props
            if (hasParent) {
                // If the route doesn't specify it's own guard, we inherit our parent guard
                if (!route.guard) {
                    route.guard = parent.guard;
                }
                // Build the path by concatting the parent path
                route.path = `${parent.path}${this._getRouteSeparator(parent.path, route.path)}${route.path}`;
            }

            route.path = this.buildFullPath(route.path, !hasParent);
            route.realPath = route.path;
            if (route.path.includes(':')) {
                dynamicRoutes.push(route);
            } else {
                staticRoutes.push(route);
            }

            if (isIndex) {
                index = { path: route.path, name: route.name };
                route.crumbs = [index];
            } else {
                const baseCrumbs = hasParent ? parent.crumbs : [index];
                route.crumbs = [...baseCrumbs, { path: route.path, name: route.name }];
            }

            if (route.routes) {
                this._iterateRoutes(route.routes, staticRoutes, dynamicRoutes, route);
            }
        }
    }

    _needsSlashBetween(partOne, partTwo) {
        return partOne.charAt(partOne.length - 1) !== '/' && partTwo.charAt(0, 1) !== '/';
    }

    parseViewFromUrl() {
        const path = window.location.pathname;
        return path.split('?')[0];
    }

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
     * */
    buildNeedle(path) {
        const needsToAddRootPath = path.indexOf(this.rootPath) === -1;
        return this.buildFullPath(path, needsToAddRootPath);
    }

    handleLeadingAndTrailingSlash(path) {
        if (path.substring(0, 1) !== '/') {
            path = `/${path}`;
        }
        if (path.substring(path.length - 1) === "/") {
            path = path.substring(0, path.length - 1);
        }
        return path;
    }

    splitRouteParts(route) {
        const routeParts = route.split(/\//);
        routeParts.shift(); // Remove the first (empty) entry
        return routeParts;
    }

    /**
     * @param routeObejct       Route Object given in the route initialization
     * @param urlRouteParts     Navigation route split up into parts
     * */
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
    _getRouteSeparator(pathA, pathB) {
        return this._needsSlashBetween(pathA, pathB) ? '/' : '';
    }

    _addRootPath(path) {
        if (path === '/') return this.rootPath ? this.rootPath : '/';

        const rootPath = `${this.rootPath}${this._getRouteSeparator(this.rootPath, path)}${path}`;
        return rootPath.charAt(rootPath.length - 1) === '/' ? rootPath.substring(0, rootPath.length - 1) : rootPath;
    }
}
