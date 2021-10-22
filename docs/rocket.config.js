import { rocketLaunch } from '@rocket/launch';
import { rocketSearch } from '@rocket/search';

const config = {
    presets: [rocketLaunch(), rocketSearch()],
}

export default config;
