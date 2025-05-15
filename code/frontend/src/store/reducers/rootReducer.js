import {combineReducers} from 'redux';
import { connectRouter } from 'connected-react-router';

// các reducer con
import appReducer from "./appReducer";
// import adminReducer from "./adminReducer";
import userReducer from "./userReducer";

// Cấu hình redux-persist giúp lưu trữ trạng thái redux vào localStorage
// và khôi phục lại trạng thái khi tải lại trang
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persistCommonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
};

const userPersistConfig = {
    ...persistCommonConfig,
    key: 'user', // key lưu trữ trong localStorage
    whitelist: ['isLoggedIn', 'userInfo'] // Chỉ lưu trữ isLoggedIn và userInfo của userReducer vào localStorage
};

export default (history) => combineReducers({
    router: connectRouter(history), // Kết nối router với redux
    user: persistReducer(userPersistConfig, userReducer), 
    app: appReducer
})