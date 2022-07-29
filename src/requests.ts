import {register} from "fetch-intercept";


const parseRequest = (url: string, init?: RequestInit) => ({
    type: 'request',
    timestamp: Date.now(),
    url,
    method: init ? init.method : 'GET',
})

const parseResponse: (res: Response & {request: Request}, r: (event: any) => void) => void = (response, r) => {
    const {request: {url, method}, status} = response;
    response.clone().json().then(body => {
        r({
            type: 'response',
            timestamp: Date.now(),
            url,
            method,
            status,
            body,
        })
    })
}

export const initialiseRequests = (r: (event: any) => void) => {
    register({
        request: function (url, config) {
            // Modify the url or config here
            r(parseRequest(url, config));
            return [url, config];
        },

        response: function (response) {
            // Modify the reponse object
            parseResponse(response, r);
            return response;
        },

        responseError: function (error) {
            // Handle an fetch error
            return Promise.reject(error);
        }
    });
}
