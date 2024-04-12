/* eslint-disable func-names */
import {
  readFile,
  setViewport,
  executeServerCommand,
} from '@web/test-runner-commands';
import sinon from 'sinon';
import { waitFor, delay } from '../../helpers/waitfor.js';

const screenshotFolder = 'screenshots';

describe('aside-mobile', function () {
  const suiteName = this.title;
  let testName;
  let screenshotPath;

  before(async () => {
    sinon.stub(console, 'debug');
    await executeServerCommand('page-redirect', { urlDir: '/dc-shared', path: './mocks/dc-shared' });

    window.adobeIMS = { isSignedInUser: () => false };
    document.head.innerHTML = await readFile({ path: '../mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    await setViewport({ width: 500, height: 100 });
    await import('../../../acrobat/scripts/scripts.js');
    await waitFor(() => document.querySelector('.aside.promobar.con-block'), 5000, 1000);
  });

  after(async () => {
    await executeServerCommand('page-unredirect', { urlDir: '/dc-shared' });
    sinon.restore();
  });

  beforeEach(function () {
    testName = this.currentTest.title;
    screenshotPath = `${screenshotFolder}/${suiteName}/$browser/${testName}.png`;
  });

  it('display', async () => {
    await delay(1000);
    await executeServerCommand('diff-screenshot', { path: screenshotPath });
  });
});
