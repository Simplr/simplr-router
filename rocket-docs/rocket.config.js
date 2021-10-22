import { rocketLaunch } from '@rocket/launch';
import { rocketSearch } from '@rocket/search';

const config = {
    absoluteBaseUrl: "https://simplr.github.io/simplr-router/",
    presets: [rocketLaunch(), rocketSearch()]
}

export default config;
