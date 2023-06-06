import React, { useState } from 'react';
import {Container, Header, Form, Image, Button} from 'semantic-ui-react';

import firebase from '../utils/firebase';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import {useNavigate} from 'react-router-dom';

function NewDocuments() {
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [categories, setCategories] = React.useState([]);
    const [categoriesName, setCategoriesName] = React.useState('');
    const [file, setFile] = React.useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    React.useEffect(() => {
        firebase
            .firestore()
            .collection('categories')
            .get()
            .then((collectionSnapshot) => {
                const data = collectionSnapshot.docs.map((category) => {
                    return category.data();
                });

                setCategories(data);
                //console.log(data);
            });
    }, []);

    const options = categories.map((category) => {
        return {
            text: category.name,
            value: category.name
        }
    });

    const previewUrl = file
    ? URL.createObjectURL(file)
    : 'https://react.semantic-ui.com/images/wireframe/image.png'

    function onSubmit() {
        let date = new Date().toDateString();
        console.log(`時間：${date}，動作：新增文件`);
        setIsLoading(true);
        const documentRef = firebase
            .firestore()
            .collection('posts')
            .doc();
        const fileRef = firebase.storage().ref('post-images/' + documentRef.id);
        const metadata = {
            contentType: file===null?null:file.type,
        };
        //console.log("上傳圖片的類型：" + metadata.contentType)

        fileRef.put(file, metadata).then(() => {
            fileRef.getDownloadURL().then((imageURL) => {
                documentRef.set({
                    title,
                    content,
                    categories: categoriesName,
                    createdAt: firebase.firestore.Timestamp.now(),
                    author: {
                        displayName: firebase.auth().currentUser.displayName || '',
                        department: firebase.auth().currentUser.displayName.split('-')[1] || '',
                        photoURL: firebase.auth().currentUser.photoURL || '',
                        uid: firebase.auth().currentUser.uid,
                        email: firebase.auth().currentUser.email,
                    },
                    imageURL: file===null?'':imageURL,
                }).then(() => {
                    setIsLoading(false);
                    const recordRef = firebase.firestore().collection('records').doc();
                    recordRef.set({
                        title,
                        content,
                        documentId: documentRef.id,
                        categories: categoriesName,
                        createdAt: firebase.firestore.Timestamp.now(),
                        action: '新增',
                        author: {
                            displayName: firebase.auth().currentUser.displayName || '',
                            department: firebase.auth().currentUser.displayName.split('-')[1] || '',
                            uid: firebase.auth().currentUser.uid,
                        },
                    });
                    navigate('/posts');
                });
            });
        });

        
        
    }

    return <Container>
        <Header>新增文件</Header>
        <Form onSubmit={onSubmit}>
            <Image 
                src={previewUrl}
                size="small"
                floated="left"
            />
            <Button basic as="label" htmlFor="post-image">上傳圖片</Button>
            <Form.Input 
                type='file' 
                id="post-image" 
                style={{display: 'none'}} 
                onChange={(e) => setFile(e.target.files[0])}
            />
            <Form.Input 
                placeholder="輸入文件名稱" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
            />
            <Form.TextArea 
                placeholder="輸入文件內容" 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
            />
            <Form.Dropdown
                placeholder='選擇文件類型'
                options={options}
                selection
                value={categoriesName}
                onChange={(e,  {value}) => setCategoriesName(value)}
            />
            <Form.Button loading={isLoading}>
                送出
            </Form.Button>
        </Form>
    </Container>;
}

export default NewDocuments;