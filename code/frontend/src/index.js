import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';

import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";
import { PersistGate } from 'redux-persist/integration/react';

import { Provider } from 'react-redux';
import reduxStore, { persistor } from './redux';

const renderApp = () => {
    ReactDOM.render(
        <Provider store={reduxStore}>
            
            {/* <IntlProviderWrapper>
                <App persistor={persistor}/>
            </IntlProviderWrapper> */}
            <PersistGate loading={null} persistor={persistor}>
                <IntlProviderWrapper>
                    <App />
                </IntlProviderWrapper>
            </PersistGate>
        </Provider>,
        document.getElementById('root')
    );
};

renderApp();
serviceWorker.unregister();
