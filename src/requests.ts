import {register} from "fetch-intercept";

export const initialiseRequests = () => {
    register({
        request: function (url, config) {
            // Modify the url or config here
            console.log(url);
            return [url, config];
        },

        requestError: function (error) {
            // Called when an error occured during another 'request' interceptor call
            return Promise.reject(error);
        },

        response: function (response) {
            // Modify the reponse object
            console.log(response);
            return response;
        },

        responseError: function (error) {
            // Handle an fetch error
            return Promise.reject(error);
        }
    });
}
