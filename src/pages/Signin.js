import React from 'react'
import {Menu, Form, Container, Message} from 'semantic-ui-react';
import {useNavigate} from 'react-router-dom';
import firebase from '../utils/firebase.js';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

function Signin() {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = React.useState('register');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    function onSubmit() {
        setIsLoading(true);
        if (activeItem == 'register') {
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                    navigate('/');
                    setIsLoading(false);
                    firebase.auth().currentUser.updateProfile({
                        displayName: '使用者-XX部',
                    });
                    let date = new Date().toDateString();
                    console.log(`時間：${date}，動作：成功註冊`);
                })
                .catch((error) => {
                    if (error.code == 'auth/email-already-in-use') {
                        setErrorMessage('信箱已經存在');
                    } // if
                    else if (error.code == 'auth/invalid-email') {
                        setErrorMessage('信箱格式錯誤');
                    } // else if
                    else if (error.code == 'auth/weak-password') {
                        setErrorMessage('密碼強度不足');
                    } // else if
                    setIsLoading(false);
                });
        } // if
        else if (activeItem == "signin") {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    navigate('/');
                    setIsLoading(false);
                    let date = new Date().toDateString();
                    console.log(`時間：${date}，動作：成功登入`);
                })
                .catch((error) => {
                    if (error.code == 'auth/invalid-email') {
                        setErrorMessage('信箱格式錯誤');
                    } // if
                    else if (error.code == 'auth/user-not-found') {
                        setErrorMessage('信箱不存在');
                    } // else if
                    else if (error.code == 'auth/wrong-password') {
                        setErrorMessage('密碼輸入錯誤');
                    } // else if
                    setIsLoading(false);
                });
        } // else if
    }

    return (
        <Container>
            <Menu widths="2">
                <Menu.Item active={activeItem === 'register'} 
                    onClick={
                        () => {
                            setErrorMessage('');
                            setActiveItem('register');
                        }
                    }>
                    註冊
                </Menu.Item>
                <Menu.Item active={activeItem === 'signin'} 
                    onClick={   
                        () => {
                            setErrorMessage('');
                            setActiveItem('signin');
                        }
                    }>
                    登入
                </Menu.Item>
            </Menu>
            <Form onSubmit={onSubmit}>
                <Form.Input 
                    label="信箱" 
                    value={email} 
                    placeholder="請輸入信箱"
                    onChange={(e) => setEmail(e.target.value)}>
                </Form.Input>
                <Form.Input 
                    label="密碼" 
                    value={password} 
                    placeholder="請輸入密碼"
                    onChange={(e) => setPassword(e.target.value)}
                    type="password">
                </Form.Input>
                {errorMessage && <Message>{errorMessage}</Message>}
                <Form.Button loading={isLoading}>
                    {activeItem === 'register'&& '註冊'}
                    {activeItem === 'signin'&& '登入'}
                </Form.Button>
            </Form>
        </Container>
    )
}

export default Signin;