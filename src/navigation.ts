function monkeyPatchHistory (history: History) {
    const pushState = history.pushState;
    history.pushState = function(state, unused, url) {
        console.log({
            type: 'navigate',
            url,
            title: '?'
        })
        return pushState.apply(history, arguments);
    }
    const replaceState = history.replaceState;
    history.replaceState = function(state, unused, url) {
        console.log({
            type: 'navigate',
            url,
            title: '?'
        })
        return replaceState.apply(history, arguments);
    }
}

export const initializeNav = () => {
    monkeyPatchHistory(window.history);
}
