import React from 'react';
import {Grid, Item, Image, Icon, Container, Header} from 'semantic-ui-react';
import Categories from '../components/Categories.js';
import firebase from '../utils/firebase.js';
import 'firebase/compat/firestore';
import { Link } from 'react-router-dom';
import DocumentTemplate from '../components/DocumentTemplate.js';

function MyCollections() {
    const [posts, setPosts] = React.useState([]);
    React.useEffect(() => {
        firebase.firestore().collection('posts').where("collectedBy", "array-contains", firebase.auth().currentUser.uid).get().then((collectionSnapshot) => {
            const data = collectionSnapshot.docs.map(docSnapshot => {
                const id = docSnapshot.id;
                return {...docSnapshot.data(), id};
            })
            
            setPosts(data);
        })
    }, [])
    return (
        <>
            <Header>我的收藏</Header>
            <Item.Group>
                {posts.map(post => {
                    return (
                        <DocumentTemplate post={post} key={post.id} />
                    )
                })}
            </Item.Group>
        </>
    )
}

export default MyCollections;