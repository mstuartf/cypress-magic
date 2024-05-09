# Cypress Magic

Cypress-Studio-like Chrome Extension that also captures API calls and turns them into fixtures.

Download from the [Chrome Web Store](https://chromewebstore.google.com/detail/cypress-magic/hhlencikaokadnanfgnbebfobddfjdng).

### Instructions

- Go to the app you want to test. It works best on SPAs calling a JSON API - e.g. this [GoT app](https://sens3ii.github.io/React-Game-Of-Thrones-DB/#/home) (not mine) is a good test case.
- Click on the Extension and click `Inject into active tab`.
- Enter a test title and assertion and click `Start recording`.
- Start interacting with the app. The Extension will track actions and network activity.
- Download the test file and drop into your `cypress/e2e` dir.
- Download and unzip the fixtures and drop the entire dir into your `cypress/fixtures` dir.
- Open Cypress and run the test.

### Running locally:

1. Run `npm i`.
2. Run `npm run build`.
3. Go to your [Chrome Extensions](chrome://extensions/).
4. Enable `Developer mode` (top right corner).
5. Click `Load unpacked`.
6. Select the `build` dir from this project.
7. The extension will then be added to your Chrome.
8. Use `./demo/index.html` to try it out.
9. Run `npm run cypress:open` to open Cypress.

### Other info

- The Extension will use `data-cy` selectors if available. Otherwise it will default to position in the DOM.
- API calls made very fast when the page is loaded may be missed if the Extension code is not injected in time. But the extension will notify you if this happens.
- Tested heavily with `fetch` but less so with `XMLHttpRequest`.
- If you want to write E2E tests, toggle `Mock network requests` off. API calls will not be mocked in the test file but will be aliased and waited for to reduce flake.
