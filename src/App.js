import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {FiSettings} from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings} from './components';
import { Dashboard, RentReceipts, Calendar, Admins, Weekly, Monthly, Yearly, Rentees, Customers, Kanban, FAQ, Messages, Chat, Properties, Error404, Error500, ForgotPassword, Login, Signup} from './pages';

import { useStateContext } from './contexts/ContextProvider';

import './App.css';

const App = () => {
    const { activeMenu} = useStateContext();

    return (
        <div>
            <BrowserRouter>
                <div className='flex relative dark:bg-main-dark-bg'>
                    <div className='fixed right-4 bottom-4' style={{ zIndex: '1000'}}>
                        <TooltipComponent content="Settings" position='Top'>
                            <button type='button' className='text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white' style={{background: '#274254', borderRadius: '50%'}}>
                                <FiSettings />
                            </button>
                        </TooltipComponent>
                    </div>
                    {activeMenu ? (
                        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
                            <Sidebar />
                        </div>
                    ): (
                        <div className='w-0 dark:bg-secondary-dark-bg'>
                            <Sidebar /> 
                        </div>
                    )}
                    <div className={
                        `dark:bg-main-bg bg-main-bg min-h-screen
                        w-full ${activeMenu ? 'md:ml-72'
                        :  'flex-2'}`
                    }>
                        <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
                            <Navbar />
                        </div>

                    <div>
                        <Routes>
                            {/* Authentication */}
                            <Route path='/login' element={<Login />} />
                            <Route path='/signup' element={<Signup />} />
                            <Route path='/forgotpassword' element={<ForgotPassword />} />

                            {/*Error Pages */}
                                <Route path='/error404' element={<Error404 />} />
                            <Route path='/error500' element={<Error500 />} />

                            {/* Dashboard */}
                            <Route path='/' element={<Dashboard />} />
                            <Route path='/dashboard' element={<Dashboard />} />

                            {/* Pages */}
                            <Route path='/rentreceipts' element={<RentReceipts />} />
                            <Route path='/rentees' element={<Rentees />} />
                            <Route path='/properties' element={<Properties />} />
                            <Route path='/customers' element={<Customers />} />
                            <Route path='/admins' element={<Admins />} />

                            {/* Apps */}
                            <Route path='/kanban' element={<Kanban />} />
                            <Route path='/chat' element={<Chat />} />
                            <Route path='/messages' element={<Messages />} />
                            <Route path='/faq' element={<FAQ />} />
                            <Route path='/calendar' element={<Calendar />} />

                            {/*Reports */}
                            <Route path='/weekly' element={<Weekly />} />
                            <Route path='/monthly' element={<Monthly />} />
                            <Route path='/yearly' element={<Yearly />} />
                        </Routes>
                    </div>
                    </div>
                </div>
            </BrowserRouter>
        </div>
    )
}

export default App;