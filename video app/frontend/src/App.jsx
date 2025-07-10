import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import Layout from './components/Layout.jsx';
import { useThemeStore } from './store/useTheamStore.js';


const App = () => {

  //axios
    //react query
    const {isLoading, authUser} = useAuthUser();

    const { theme } = useThemeStore();

    if(isLoading) return <PageLoader/>

    const isAuthenticated = Boolean(authUser);
    const isOnBoarded = authUser?.isOnboarded;

  return (
    <div className='min-h-screen' data-theme={theme}>
      <Routes>
        <Route path="/" element={isAuthenticated && isOnBoarded ? (
          <Layout showSidebar={true}>
            <HomePage/>
          </Layout>
          ) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding" }/>)} />
        <Route path="/call/:id" element={isAuthenticated && isOnBoarded ? (
            <CallPage/>
        ) : (<Navigate  to={!isAuthenticated ? "/login" : "/onboarding" }/>) } />
        <Route path="/chat/:id" element={isAuthenticated && isOnBoarded ? (
          <Layout>
            <ChatPage/>
          </Layout>
        ) : (<Navigate  to={!isAuthenticated ? "/login" : "/onboarding" }/>) } />
        <Route path="/login" element={!isAuthenticated ? <LoginPage/> : <Navigate to={isOnBoarded ? "/" : "/onboarding"}/>} />
        <Route path="/notifications" element={isAuthenticated && isOnBoarded ? (
          <Layout showSidebar={true}>
            <NotificationsPage/>
          </Layout>
        ) : (<Navigate  to={!isAuthenticated ? "/login" : "/onboarding" }/>) } />
        <Route path="/onboarding" element={isAuthenticated ? (!isOnBoarded ? (<OnboardingPage/>) : (<Navigate to="/"/>) ) : (<Navigate to="/login" />)} />
        <Route path="/signup" element={!isAuthenticated ? <SignupPage/> : <Navigate to={isOnBoarded ? "/" : "/onboarding"}/>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App