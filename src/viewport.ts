export const initializeViewport = (register: (event: any) => void) => {
    register({
        type: 'setViewport',
        "width": window.innerWidth,
        "height": window.innerHeight,
        // todo: un hard code
        "deviceScaleFactor": 1,
        "isMobile": false,
        "hasTouch": false,
        "isLandscape": false
    })
    // todo: listen for changes?
}
