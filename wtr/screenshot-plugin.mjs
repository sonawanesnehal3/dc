/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';
import { getComparator } from 'playwright-core/lib/utils';

export function takeScreenshotPlugin() {
  return {
    name: 'take-screen-command',

    async executeCommand({ command, payload, session }) {
      if (command === 'take-screenshot') {
        if (session.browser.type === 'playwright') {
          if (payload?.path) {
            const relavantPath = path.relative(process.cwd(), path.dirname(session.testFile));
            payload.path = `${relavantPath}/${payload.path}`;
          }
          let payloadPath = payload?.path || `./screenshots/${session.id}.png`;
          payloadPath = payloadPath.replace(/\$browser/, session.browser.name);
          const page = session.browser.getPage(session.id);
          if (payload?.selector) {
            await page.locator(payload.selector).screenshot({ path: payloadPath });
          } else {
            await page.screenshot({ path: payloadPath, fullPage: true });
          }
          return true;
        }
        throw new Error(
          `Taking screenshots is not supported for browser type ${session.browser.type}.`,
        );
      } else if (command === 'diff-screenshot') {
        if (session.browser.type === 'playwright') {
          if (!payload?.path) {
            throw new Error('Missing path for base image.');
          }
          const relavantPath = path.relative(process.cwd(), path.dirname(session.testFile));
          const payloadPath = `${relavantPath}/${payload.path}`;
          const basePath = payloadPath.replace(/\$browser/, session.browser.name);
          const comparator = getComparator('image/png');
          const testPath = basePath.replace(/\.png$/, '.test.png');
          const page = session.browser.getPage(session.id);
          if (payload?.selector) {
            await page.locator(payload.selector).screenshot({ testPath });
          } else {
            await page.screenshot({ path: testPath, fullPage: true });
          }
          const baseImage = fs.readFileSync(basePath);
          const currImage = fs.readFileSync(testPath);
          const diffImage = comparator(baseImage, currImage);
          if (diffImage) {
            const diffPath = basePath.replace(/\.png$/, '.diff.png');
            fs.writeFileSync(diffPath, diffImage.diff);
            throw new Error(
              `Diff found: ${basePath}.`,
            );
          }
          return true;
        }
        throw new Error(
          `Taking screenshots is not supported for browser type ${session.browser.type}.`,
        );
      }
      return undefined;
    },
  };
}

export default takeScreenshotPlugin;
