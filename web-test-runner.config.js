import { puppeteerLauncher } from '@web/test-runner-puppeteer';

export default {
  rootDir: '.',
  files: 'src/**/*.test.js',
  nodeResolve: true,
  browsers: [puppeteerLauncher()],
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
  },
};
