import {createAlova} from 'alova';
import adapterFetch from 'alova/fetch';

const http = createAlova({
    baseURL: 'http://localhost:5000',
    requestAdapter: adapterFetch(),
    responded: response => response.json()
});

const download = createAlova({
    baseURL: 'http://localhost:5000',
    requestAdapter: adapterFetch(),
    responded: response => response
})


export {http, download}
