import resolve from '@rollup/plugin-node-resolve';
import html from '@open-wc/rollup-plugin-html';
import copy from 'rollup-plugin-copy';

export default {
    input: './index.html',
    output: { dir: 'dist' },
    plugins: [
        html({
            minify: false,
        }),
        copy({
            targets: [{ src: 'img', dest: 'dist/img' }],
        }),
        resolve(),
    ],
};
