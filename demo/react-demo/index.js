import TestView from "./test-view.js";
import AnotherTestView from "./another-test-view.js";
import SimplrRouter from "@simplr-wc/router";
import ReactMiddleware from "./react-middleware";

const routes = [
  {
    path: "/",
    component: TestView,
  },
  {
    path: "another",
    component: AnotherTestView,
  },
];

const router = new SimplrRouter({ routes });
router.use(ReactMiddleware());

router.init();
