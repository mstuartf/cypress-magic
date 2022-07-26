import {register} from "fetch-intercept";


const parseRequest = (url: string, init?: RequestInit) => ({
    type: 'request',
    url,
    method: init ? init.method : 'GET',
})

const parseResponse: (res: Response & {request: Request}) => void = (response) => {
    const {request: {url, method}, status} = response;
    response.clone().json().then(body => {
        console.log({
            type: 'response',
            url,
            method,
            status,
            body,
        })
    })
}

export const initialiseRequests = () => {
    register({
        request: function (url, config) {
            // Modify the url or config here
            console.log(parseRequest(url, config));
            return [url, config];
        },

        response: function (response) {
            // Modify the reponse object
            parseResponse(response);
            return response;
        },

        responseError: function (error) {
            // Handle an fetch error
            return Promise.reject(error);
        }
    });
}
