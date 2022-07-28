function monkeyPatchHistory (history: History) {
    const pushState = history.pushState;
    history.pushState = function(state) {
        const popStateEvent = new PopStateEvent('popstate', { state });
        dispatchEvent(popStateEvent);
        return pushState.apply(history, arguments);
    }
}

export const initializeNav = () => {
    monkeyPatchHistory(window.history);
    addEventListener('popstate', (event) => {
        console.log({
            type: 'navigate',
            url: event.state.path,
            title: '?'
        });
    });
}
