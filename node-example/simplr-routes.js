import "views/simplr-foo";
import "views/simplr-frontpage";
import "views/simplr-foo-with-id";
import "views/simplr-foo-with-id-info";
import "views/simplr-foo-bar-with-id";
import "views/simplr-page-not-found";
import AuthGuard from "./src/guards/AuthGuard";

const routes = [
    {
        "path": "",
        "view": "simplr-frontpage"
    },
    {
        "path": "foo",
        "view": "simplr-foo"
    },
    {
        "path": "foo/:fooId",
        "view": "simplr-foo-with-id",
        "guard": AuthGuard.isAuthenticated
    },
    {
        "path": "foo/:fooId/info",
        "view": "simplr-foo-with-id-info"
    },
    {
        "path": "baz/:bazId",
        "view": "simplr-baz-with-id"
    },
    {
        "path": "foo/:fooId/bar/:barId",
        "view": "simplr-foo-bar-with-id"
    },
    {
        "path": "foo/:fooId/bar/:barId/info",
        "view": "simplr-foo-bar-with-id"
    },
    {
        "path": "not-found",
        "view": "simplr-page-not-found"
    },
    {
        "path": "forbidden",
        "view": "simplr-page-not-found"
    }
];

export default routes;