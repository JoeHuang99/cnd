import React from 'react';
import {Grid, Item, Image, Icon, Container} from 'semantic-ui-react';
import Categories from '../components/Categories.js';
import firebase from '../utils/firebase.js';
import 'firebase/compat/firestore';
import { Link, useLocation } from 'react-router-dom';
import DocumentTemplate from '../components/DocumentTemplate.js';

function Documents() {
    const location = useLocation();
    const urlSearchParams = new URLSearchParams(location.search);
    const currentCategory = urlSearchParams.get('category');
    const [posts, setPosts] = React.useState([]);
    React.useEffect(() => {
        
        // console.log('當前的類別：' + currentCategory);
        if (currentCategory == null) {
            let date = new Date().toDateString();
            console.log(`時間：${date}，動作：進入文件列表`);
            firebase
                .firestore()
                .collection('posts')
                .where('author.uid', '==', firebase.auth().currentUser.uid)
                .orderBy('createdAt', 'desc')
                .get()
                .then((collectionSnapshot) => {
                    const data = collectionSnapshot.docs.map(docSnapshot => {
                        const id = docSnapshot.id;
                        return {...docSnapshot.data(), id};
                    })
                    
                    setPosts(data);
                })
        }
        else if (currentCategory == '我的文件') {
            //console.log('我的文件的uid：' + firebase.auth().currentUser.uid);
            let date = new Date().toDateString();
            console.log(`時間：${date}，動作：進入我的文件`);
            firebase
                .firestore()
                .collection('posts')
                .where('categories','==', currentCategory)
                .where('author.uid', '==', firebase.auth().currentUser.uid)
                .orderBy('createdAt', 'desc')
                .get()
                .then((collectionSnapshot) => {
                    const data = collectionSnapshot.docs.map(docSnapshot => {
                        const id = docSnapshot.id;
                        return {...docSnapshot.data(), id};
                    })
                    
                    setPosts(data);
                })
        }
        else if (currentCategory == '部門文件') {
            let date = new Date().toDateString();
            console.log(`時間：${date}，動作：進入部門文件`);
            firebase
                .firestore()
                .collection('posts')
                .where('categories','==', currentCategory)
                .where('author.department','==', firebase.auth().currentUser.displayName.split('-')[1])
                .orderBy('createdAt', 'desc')
                .get()
                .then((collectionSnapshot) => {
                    const data = collectionSnapshot.docs.map(docSnapshot => {
                        const id = docSnapshot.id;
                        return {...docSnapshot.data(), id};
                    })
                    
                    setPosts(data);
                })
        }
        else if (currentCategory == '公開文件') {
            let date = new Date().toDateString();
            console.log(`時間：${date}，動作：進入公開文件`);
            firebase
                .firestore()
                .collection('posts')
                .where('categories','==', currentCategory)
                .orderBy('createdAt', 'desc')
                .get()
                .then((collectionSnapshot) => {
                    const data = collectionSnapshot.docs.map(docSnapshot => {
                        const id = docSnapshot.id;
                        return {...docSnapshot.data(), id};
                    })
                    
                    setPosts(data);
                })
        }
        
    }, [currentCategory])
    return (
        <Item.Group>
            {posts.map(post => {
                return (
                    <DocumentTemplate post={post} key={post.id}/>
                )
            })}
        </Item.Group>
    )
}

export default Documents;