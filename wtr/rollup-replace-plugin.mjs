import rollupReplace from '@rollup/plugin-replace';
import { fromRollup } from '@web/dev-server-rollup';

export function rollupReplacePlugin() {
  const replace = fromRollup(rollupReplace);

  let plugin = null;
  if (process.env.MILOLIBS) {
    const miloLib = process.env.MILOLIBS;
    let miloLibFull = miloLib;
    if (miloLib === 'local') {
      miloLibFull = 'http://localhost:6456';
    } else if (miloLib.includes('--')) {
      miloLibFull = `https://${miloLib}.hlx.page`;
    } else {
      miloLibFull = `https://${miloLib}--milo--adobecom.hlx.page`;
    }
    plugin = replace({
      "'main'": `'${miloLib}'`,
      'https://main--milo--adobecom.hlx.page': `${miloLibFull}`,
      delimiters: ['', ''],
    });
  }
  return plugin;
}

export default rollupReplacePlugin;
