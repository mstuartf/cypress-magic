function monkeyPatchHistory (history: History, register: (event: any) => void) {
    const pushState = history.pushState;
    history.pushState = function(state, unused, url) {
        register({
            type: 'navigate',
            url,
            title: '?'
        })
        return pushState.apply(history, arguments);
    }
    const replaceState = history.replaceState;
    history.replaceState = function(state, unused, url) {
        register({
            type: 'navigate',
            url,
            title: '?'
        })
        return replaceState.apply(history, arguments);
    }
}

export const initializeNav = (register: (event: any) => void) => {
    monkeyPatchHistory(window.history, register);
}
