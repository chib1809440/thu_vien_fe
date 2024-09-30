
// third party
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

// project imports
import App from './App';
import { BASE_PATH } from './config';
import { ConfigProvider } from './contexts/ConfigContext';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { persister, store } from './store';

// style + assets
import './assets/scss/style.scss';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "react-datepicker/dist/react-datepicker.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
//sentry
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
// Sentry.init({
//     dsn: process.env.REACT_APP_DNS_SENTRY,
//     integrations: [new BrowserTracing()],

//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 1.0,
// });

// ==============================|| REACT DOM RENDER  ||============================== //
const root = ReactDOM.createRoot(document.getElementById('root')!);


const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 3, retryDelay: 3000, refetchOnWindowFocus: false, } },
});
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persister}>
            <ConfigProvider>
                <BrowserRouter basename={BASE_PATH}>
                    <QueryClientProvider client={queryClient}>
                        <App />
                    </QueryClientProvider>,
                </BrowserRouter>
            </ConfigProvider>
        </PersistGate>
    </Provider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
