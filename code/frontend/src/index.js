import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ Sửa dòng này
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';

import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";
import { PersistGate } from 'redux-persist/integration/react';

import { Provider } from 'react-redux';
import reduxStore, { persistor } from './redux';

// ✅ Tạo root dùng createRoot
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    <Provider store={reduxStore}>
        <PersistGate loading={null} persistor={persistor}>
            <IntlProviderWrapper>
                <App />
            </IntlProviderWrapper>
        </PersistGate>
    </Provider>
);

// serviceWorker vẫn giữ nguyên
serviceWorker.unregister();
