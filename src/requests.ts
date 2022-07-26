import {register} from "fetch-intercept";


const parseRequest = (url: string, init?: RequestInit) => ({
    type: 'request',
    url,
    method: init ? init.method : 'GET',
})

const parseResponse = ({request: {url, method}, status, body}: Response & {request: Request}) => ({
    type: 'response',
    url,
    method,
    status,
    body,
})

export const initialiseRequests = () => {
    register({
        request: function (url, config) {
            // Modify the url or config here
            console.log(parseRequest(url, config));
            return [url, config];
        },

        response: function (response) {
            // Modify the reponse object
            console.log(parseResponse(response));
            return response;
        },

        responseError: function (error) {
            // Handle an fetch error
            return Promise.reject(error);
        }
    });
}
