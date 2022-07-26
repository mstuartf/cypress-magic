export const makeRequest = () => {
    return fetch('https://swapi.dev/api/people/1')
}

export const periodicRequests = () => {
    setTimeout(makeRequest, 1000);
    setTimeout(makeRequest, 2000);
    setTimeout(makeRequest, 5000);
}
