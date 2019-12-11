export default class SimplrRouterDomManipulator {
    constructor(router) {
        this.router = router;
        this.transitionDirection = router.transitionDirection;
        this.stackedViews = router.stackedViews;
        this.transitionSpeed = router.transitionSpeed;
        this.waitForLoad = router.waitForLoad;
        this.activeView = router.activeView;
        this.rootView = router.rootView;
        this.viewStack = router.viewStack;

        this.lastActiveView = null;
        this.latestElementAdded = null;
        this.loadingIndicator = null;
    }

    wrapRootView() {
        let viewWrapper = this.createViewWrapper();
        let oldParent = this.activeView.parentNode;

        if (
            !this.activeView.parentNode.classList.contains(
                'simplr-router-view-wrapper'
            )
        ) {
            oldParent.replaceChild(viewWrapper, this.activeView);
            viewWrapper.appendChild(this.activeView);
            this.viewStack[0].wrapper = viewWrapper;
        }
    }

    createViewWrapper() {
        let viewWrapper = document.createElement('div');
        viewWrapper.setAttribute('tabindex', 0);
        viewWrapper.classList.add('simplr-router-view-wrapper');

        return viewWrapper;
    }

    addNewElementObserver() {
        const observer = new MutationObserver(mutationsList => {
            mutationsList.map(entry => {
                if (entry.target != null && this.latestElementAdded != null) {
                    if (
                        Array.from(entry.addedNodes).includes(
                            this.latestElementAdded.parentNode
                        )
                    ) {
                        this.handleElementAddedToDomActions(
                            this.latestElementAdded
                        );
                    }
                    this.router.overrideAnchorActions(entry.target);
                }
            });
        });
        observer.observe(document.querySelector('body'), {
            attributes: true,
            childList: true,
            subtree: true,
        });
    }

    async handleElementAddedToDomActions(newView) {
        let wrapper = newView.parentNode;
        await this.waitForLoadingOff(newView);
        this.removeLoadingIndicator();
        wrapper.classList.remove(this.transitionDirection);
        setTimeout(() => {
            this.latestElementAdded = null;
            this.router.transitionInProgress = false;
            wrapper.focus();
            if (!this.stackedViews && this.lastActiveView) {
                this.lastActiveView.remove();
            }
        }, this.transitionSpeed * 1.2 * 1000);
    }

    async waitForLoadingOff(newView) {
        if (!this.waitForLoad || newView.isLoading === undefined) {
            return new Promise(resolve => setTimeout(resolve, 10));
        }
        this.addLoadingIndicator();
        return new Promise(resolve => {
            (function _waitForLoadingOff() {
                if (!newView.isLoading) {
                    resolve();
                }
                setTimeout(_waitForLoadingOff, 50);
            })();
        });
    }

    addLoadingIndicator() {
        let holder = document.createElement('div');
        holder.className = 'simplr-router-loading-bar';
        let bar = document.createElement('div');
        bar.className = 'simplr-router-loading-bar-indicator';
        holder.appendChild(bar);
        this.loadingIndicator = holder;
        document.body.appendChild(this.loadingIndicator);
    }

    removeLoadingIndicator() {
        if (this.loadingIndicator) {
            this.loadingIndicator.remove();
            this.loadingIndicator = null;
        }
    }

    updateActiveView(route, wrapper) {
        this.lastActiveView = this.activeView.parentNode.className.includes(
            'simplr-router-view-wrapper'
        )
            ? this.activeView.parentNode
            : this.activeView;
        this.activeView = wrapper.querySelector(route.view);
        this.viewStack = [
            ...this.viewStack,
            { view: route.view, wrapper: wrapper, path: route.path },
        ];
    }

    removeStackingView() {
        let oldActiveView = this.viewStack.pop();
        oldActiveView.wrapper.classList.add(this.transitionDirection);
        setTimeout(() => {
            oldActiveView.wrapper.remove();
        }, this.transitionSpeed * 1.2 * 1000);
    }

    goToPreviousPage() {
        let oldActiveView = this.viewStack.pop();
        let newView = this.viewStack[this.viewStack.length - 1];
        this.router._transitionToView(newView.path, true);

        let oppositeTransitionDirection = this.router.getOppositeTransitionDirection();
        newView.wrapper.classList.add(oppositeTransitionDirection);
        setTimeout(() => {
            newView.wrapper.classList.remove(oppositeTransitionDirection);
        }, 10);
        setTimeout(() => {
            oldActiveView.wrapper.remove();
        }, this.transitionSpeed * 1.2 * 1000);
    }
}
