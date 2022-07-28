function monkeyPatchHistory (history: History, register: (event: any) => void) {
    const pushState = history.pushState;
    history.pushState = function(state, unused, url) {
        register({type: 'navigate', url})
        return pushState.apply(history, arguments);
    }

    const replaceState = history.replaceState;
    history.replaceState = function(state, unused, url) {
        register({type: 'navigate', url})
        return replaceState.apply(history, arguments);
    }

    const back = history.back;
    history.back = function() {
        register({
            type: 'navigate',
            url: 'back',
        })
        return back.apply(history, arguments);
    }

    const forward = history.forward;
    history.forward = function() {
        register({
            type: 'navigate',
            url: 'forward',
        })
        return forward.apply(history, arguments);
    }

    const go = history.go;
    history.go = function(delta) {
        register({
            type: 'navigate',
            delta,
        })
        return go.apply(history, arguments);
    }
}

export const initializeNav = (register: (event: any) => void) => {
    monkeyPatchHistory(window.history, register);
}
