import resolve from '@rollup/plugin-node-resolve';
import html from '@open-wc/rollup-plugin-html';

export default {
    input: './index.html',
    output: { dir: 'dist' },
    plugins: [
        html({
            minify: false,
        }),
        resolve(),
    ],
};
