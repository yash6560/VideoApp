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


const App = () => {

  //axios
    //react query
    const {isLoading, authUser} = useAuthUser();

    if(isLoading) return <PageLoader/>

    const isAuthenticated = Boolean(authUser);
    const isOnBoarded = authUser?.isOnBoarded;

  return (
    <div className='h-screen' data-theme="night">
      <Routes>
        <Route path="/" element={isAuthenticated && isOnBoarded ? (<HomePage/>) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding" }/>)} />
        <Route path="/call" element={isAuthenticated ? <CallPage/> : <Navigate to="/login"/>} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage/> : <Navigate to="/login"/>} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage/> : <Navigate to={isOnBoarded ? "/" : "/onboarding"}/>} />
        <Route path="/notifications" element={isAuthenticated ? <NotificationsPage/> : <Navigate to="/login"/>} />
        <Route path="/onboarding" element={isAuthenticated ? (!isOnBoarded ? (<OnboardingPage/>) : (<Navigate to="/"/>) ) : (<Navigate to="/login" />)} />
        <Route path="/signup" element={!isAuthenticated ? <SignupPage/> : <Navigate to={isOnBoarded ? "/" : "/onboarding"}/>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App