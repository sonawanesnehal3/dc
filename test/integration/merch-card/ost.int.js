/* eslint-disable func-names */
import {
  readFile,
  setViewport,
  executeServerCommand,
} from '@web/test-runner-commands';
import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { waitFor, delay } from '../../helpers/waitfor.js';

const screenshotFolder = 'screenshots';

describe('ost', function () {
  const suiteName = this.title;
  let testName;
  let screenshotPath;

  before(async () => {
    sinon.stub(console, 'debug');
    await executeServerCommand('page-route', { url: 'https://wcs.adobe.com/**/*' });

    window.adobeIMS = { isSignedInUser: () => false };
    document.head.innerHTML = await readFile({ path: '../mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body_ost.html' });
    await setViewport({ width: 200, height: 50 });
    await import('../../../acrobat/scripts/scripts.js');
    await waitFor(() => document.querySelector('.placeholder-resolved'), 10000, 1000);
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

  it('buy', async () => {
    const button = document.querySelector('.placeholder-resolved');
    const href = button.getAttribute('href');
    expect(href).to.match(/^https:\/\/commerce\.adobe\.com/);
    await executeServerCommand('diff-screenshot', { path: screenshotPath });
  });
});
