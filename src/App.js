import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './Header.js'
import Signin from  './pages/Signin.js'
import Documents from './pages/Documents.js'
import NewDocuments from './pages/NewDocuments.js'
import Document from './pages/Document.js';
import DocumentNavigate from './pages/DocumentNavigate.js';
import MyData from './pages/MyData.js';
import History from './pages/History.js';
import HomePage from './pages/HomePage.js';

import React from 'react';
import firebase from './utils/firebase.js';
import 'firebase/compat/auth';


function  App() {
    const [user, setUser] = React.useState(null);
    React.useEffect(() => {
        firebase.auth().onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        }) 
    }, [])
    return (
        <BrowserRouter>
            <Header user={user}></Header>
            <Routes>
                <Route path="/"  element={<HomePage/>}/>
                <Route path="/history"  element={<History />}/>
                <Route path="/posts/*" element={user?<DocumentNavigate />:<Navigate to="/"/>}/>
                {/* <Route path="/posts" element={<Documents />}></Route> */}
                <Route path="/signin" element={user?<Navigate to="/"/>:<Signin />}></Route>
                <Route path="/new-document" element={user?<NewDocuments />:<Navigate to="/"/>}></Route>
                {/* <Route path="/posts/:postId" element={<Document />}></Route> */}
                <Route path="/my/*" element={user?<MyData user={user}/>:<Navigate to="/"/>}/>
            </Routes>
            
        </BrowserRouter>
    )
}

export default App;