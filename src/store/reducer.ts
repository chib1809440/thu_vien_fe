// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
import barcodeReducer from './slices/barcodeV2';
import customerReducer from './slices/customer';
import contactReducer from './slices/contact';
import productReducer from './slices/product';
import chatReducer from './slices/chat';
import calendarReducer from './slices/calendar';
import mailReducer from './slices/mail';
import userReducer from './slices/user';
import cartReducer from './slices/cart';
import kanbanReducer from './slices/kanban';
import menuReducer from './slices/menu';
import getListWaitingReducer from './slices/projectwaiting'
import getAllAccountReducer from './slices/allAccount'
import getGroupPowerReducer from './slices/groupPower'
import getLoanSlipReducer from './slices/loanSlip'
import getSuppliesReducer from './slices/supplies'
import getSuppliesLTReducer from './slices/suppliesLT'
import getCategoryReducer from './slices/category'
import getAuthorReducer from './slices/author'
import getProducerReducer from './slices/producer'
import getCabinetReducer from './slices/cabinet'
import getprintedMatterReducer from './slices/printedMaster'
import getTopStandingReducer from './slices/topStanding'
import getLibraryConnectionReducer from './slices/libraryConnection'
import getContactSchoolReducer from './slices/contactSchool'
import getTypeSuplyReducer from './slices/typeSuplly'
import getStateOfBookReducer from './slices/stateOfBook'
import getRegisterSlipReducer from './slices/registerSlip'
import getAssetsLibReducer from './slices/assetsLib'
import getUsbReducer from './slices/usb'
import getBarcodeReducer from './slices/barcode'
import getApiLTReducer from './slices/apiLT'
import getUserLTReducer from './slices/userLT'
import isLoginReducer from './slices/isLoginLT'

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    barcode: barcodeReducer,
    cart: persistReducer(
        {
            key: 'cart',
            storage,
            keyPrefix: 'berry-'
        },
        cartReducer
    ),
    kanban: kanbanReducer,
    customer: customerReducer,
    contact: contactReducer,
    product: productReducer,
    chat: chatReducer,
    calendar: calendarReducer,
    mail: mailReducer,
    user: userReducer,
    menu: menuReducer,
    getlistprojectwaiting: getListWaitingReducer,
    getAllAccount: getAllAccountReducer,
    getGroupPower: getGroupPowerReducer,
    getLoanSlip: getLoanSlipReducer,
    getSupplies: getSuppliesReducer,
    getSuppliesLT: getSuppliesLTReducer,
    getCategory: getCategoryReducer,
    getAuthor: getAuthorReducer,
    getProducer: getProducerReducer,
    getCabinet: getCabinetReducer,
    getprintedMatter: getprintedMatterReducer,
    getTopStanding: getTopStandingReducer,
    getLibraryConnection: getLibraryConnectionReducer,
    getContactSchool: getContactSchoolReducer,
    getTypeSuply: getTypeSuplyReducer,
    getStateOfBook: getStateOfBookReducer,
    getRegisterSlip: getRegisterSlipReducer,
    getAssetsLib: getAssetsLibReducer,
    getUsb: getUsbReducer,
    getBarcode: getBarcodeReducer,
    getApiLT: getApiLTReducer,
    isLogin: isLoginReducer,
    getUserLT: getUserLTReducer,
});
export default reducer;
