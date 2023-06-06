import { Menu, Search, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import React from 'react';
import firebase from './utils/firebase';
import {useNavigate} from 'react-router-dom';


function Header({user}) {
    const [inputValue, setInputValue] = React.useState('');

    return <Menu color="black" inverted >
        <Menu.Item as={Link} to="/">首頁</Menu.Item>
        <Menu.Item>
            <Image 
                src="https://firebasestorage.googleapis.com/v0/b/fir-cnd-ad7c7.appspot.com/o/post-images%2F%E5%8F%B0GG_logo.png?alt=media&token=61d87d0c-08bd-45ce-a43d-f7fc6b587629" 
                size="mini"
                circular
            >
            </Image>
        </Menu.Item>
        <Menu.Menu position="right" >
            {user?<>
                <Menu.Item as={Link} to="/posts">
                    文件列表
                </Menu.Item>
                <Menu.Item as={Link} to="/history" >
                    文件歷程
                </Menu.Item>
                <Menu.Item as={Link} to="/my/posts" >
                    個人資料
                </Menu.Item>
                <Menu.Item as={Link} to="/new-document" >
                    新增文件
                </Menu.Item>
                <Menu.Item as={Link} to="/posts" onClick={() => {
                    firebase.auth().signOut()
                }} >
                    登出
                </Menu.Item>
            </>:<>
                <Menu.Item as={Link} to="/signin" >
                    註冊/登入
                </Menu.Item>
            </>
            }
        </Menu.Menu>
    </Menu>
}

export default Header;