import path from 'path';

export function pageRoutePlugin() {
  return {
    name: 'page-route-command',

    async executeCommand({ command, payload, session }) {
      if (command === 'page-route') {
        if (session.browser.type === 'playwright') {
          if (['Webkit', 'Firefox'].includes(session.browser.name)) {
            const page = session.browser.getPage(session.id);
            await page.route(payload.url, async (route) => {
              const response = await route.fetch();
              route.fulfill({ response });
            });
          }
          return true;
        }
        throw new Error(
          `Stopping a page route is not supported for browser type ${session.browser.type}.`,
        );
      } else if (command === 'page-unroute') {
        if (session.browser.type === 'playwright') {
          if (['Webkit', 'Firefox'].includes(session.browser.name)) {
            const page = session.browser.getPage(session.id);
            await page.unroute(payload.url);
          }
          return true;
        }
        throw new Error(
          `Stopping a page route is not supported for browser type ${session.browser.type}.`
        );
      } else if (command === 'page-redirect') {
        if (session.browser.type === 'playwright') {
          const page = session.browser.getPage(session.id);
          const relavantPath = path.relative(process.cwd(), path.dirname(session.testFile));
          await page.route(`**${payload.urlDir}/**`, async (route) => {
            const url = route.request().url().replace(payload.urlDir, `/${relavantPath}/${payload.path}`);
            await route.continue({ url });
          });
          return true;
        }
        throw new Error(
          `Stopping a page route is not supported for browser type ${session.browser.type}.`,
        );
      } else if (command === 'page-unredirect') {
        if (session.browser.type === 'playwright') {
          const page = session.browser.getPage(session.id);
          await page.unroute(`**${payload.urlDir}/**`);
          return true;
        }
        throw new Error(
          `Stopping a page route is not supported for browser type ${session.browser.type}.`,
        );
      }
      return undefined;
    },
  };
}

export default pageRoutePlugin;
