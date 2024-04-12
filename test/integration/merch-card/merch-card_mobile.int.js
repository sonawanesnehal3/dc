/* eslint-disable func-names */
import {
  readFile,
  setViewport,
  executeServerCommand,
} from '@web/test-runner-commands';
import sinon from 'sinon';
import { waitForElement, waitFor, delay } from '../../helpers/waitfor.js';

const screenshotFolder = 'screenshots';

describe('merch_cards_mobile', function () {
  const suiteName = this.title;
  let testName;
  let screenshotPath;

  before(async () => {
    sinon.stub(console, 'debug');
    await executeServerCommand('page-route', { url: 'https://wcs.adobe.com/**/*' });

    window.adobeIMS = { isSignedInUser: () => false };
    document.head.innerHTML = await readFile({ path: '../mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await setViewport({ width: 600, height: 1200 });
    await import('../../../acrobat/scripts/scripts.js');
    await waitFor(() => document.querySelector('.placeholder-resolved'), 10000, 1000);
    const price = await waitForElement('.placeholder-resolved');
    console.log(price.textContent);
    await delay(1000);
  });

  after(async () => {
    await executeServerCommand('page-unroute', { url: 'https://wcs.adobe.com/**/*' });
    sinon.restore();
  });

  beforeEach(function () {
    testName = this.currentTest.title;
    screenshotPath = `${screenshotFolder}/${suiteName}/$browser/${testName}.png`;
  });

  it('price', async () => {
    await executeServerCommand('diff-screenshot', { path: screenshotPath });
  });
});
