export default class Parser {
    constructor() {}

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
        for (let route of routes) {
            // If subroute, we want the route to inherit the props
            if (parent) {
                // If the route doesn't specify it's own guard, we inherit our parent guard
                if (!route.guard) {
                    route.guard = parent.guard;
                }
                // Build the path by concatting the parent path
                const routeSeparator = this._needsSlashBetween(parent.path, route.path) ? '/' : '';
                route.path = `${parent.path}${routeSeparator}${route.path}`;
            }

            if (route.path.includes(':')) {
                route.path = this.handleLeadingSlash(route.path);
                dynamicRoutes.push(route);
            } else {
                route.path = this.handleLeadingSlash(route.path);
                staticRoutes.push(route);
            }

            if (route.routes) {
                this._iterateRoutes(route.routes, staticRoutes, dynamicRoutes, route);
            }
        }
    }

    _needsSlashBetween(partOne, partTwo) {
        return partOne.substring(partOne.length - 1) !== '/' && partTwo.substring(0, 1) !== '/';
    }

    parseViewFromUrl() {
        const path = window.location.pathname;
        return path.split('?')[0];
    }

    handleLeadingSlash(path) {
        if (path.substring(0, 1) !== '/') {
            path = `/${path}`;
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
        for (let index in routeObject.parts) {
            const routePart = routeObject.parts[index];
            if (!routePart.includes(':')) {
                continue;
            }
            // substring to get the key without the ":"
            routeObject.params[routePart.substring(1)] = urlRouteParts[index];
        }
    }
}
