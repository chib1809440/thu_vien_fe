// routing
import Routes from './routes';

// project imports
import NavigationScroll from './layout/NavigationScroll';
import RTLLayout from './ui-component/RTLLayout';
import Snackbar from './ui-component/extended/Snackbar';
import ThemeCustomization from './themes';

// auth provider
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
import { JWTProvider as AuthProvider } from './contexts/JWTContext';
import Locales from './ui-component/Locales';
import ProviderLoader from './layout/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import ProviderLoader from './layout/Loader';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP ||============================== //

const App = () => (
    <ThemeCustomization>
        {/* RTL layout */}
        <RTLLayout>
            <NavigationScroll>
                <ProviderLoader>
                    <AuthProvider>
                        <>
                            <Routes />
                            <ToastContainer
                                position="top-right"
                                autoClose={2000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                            />
                            <Snackbar />
                        </>
                    </AuthProvider>
                </ProviderLoader>

            </NavigationScroll>
        </RTLLayout>
    </ThemeCustomization>
);

export default App;
