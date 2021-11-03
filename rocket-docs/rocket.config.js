import { rocketLaunch } from "@rocket/launch";
import { rocketSearch } from "@rocket/search";
import { adjustPluginOptions } from "plugins-manager";

const config = {
    absoluteBaseUrl: "https://simplr.github.io/simplr-router/",
    pathPrefix: "/simplr-router/",
    urlPath: "/simplr-router/",
    setupEleventyComputedConfig: [
        adjustPluginOptions("socialMediaImage", {
            createSocialImageSvg: async ({
                title = "",
                subTitle = "",
                subTitle2 = "",
                footer = "",
                logo = "",
            }) => {
                let svgStr = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" style="fill: #FFFFFF;">
            <defs/>
            <rect width="100%" height="100%" fill="#FFFFFF"/>
            <g transform="matrix(0.35, 0, 0, 0.35, 500, 90)">${logo}</g>
            <g style="
              font-size: 70px;
              text-anchor: middle;
              font-family: 'Bitstream Vera Sans','Helvetica',sans-serif;
              font-weight: 700;
            ">
              <text x="50%" y="470" style="fill: #000">
                ${title}
              </text>
              <text x="50%" y="520" style="font-size: 30px; fill: #000;">
                ${subTitle}
              </text>
            </g>
            <text x="10" y="620" style="font-size: 30px; fill: #000;">
              ${footer}
            </text>
          </svg>
        `;
                return svgStr;
            },
        }),
    ],
    presets: [rocketLaunch(), rocketSearch()]
};

export default config;
