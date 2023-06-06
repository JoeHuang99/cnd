import React from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Container, Grid, Image, Header, Segment, Icon, Comment, Form} from 'semantic-ui-react';
import Categories from '../components/Categories.js';
import firebase from '../utils/firebase';
import 'firebase/compat/firestore';

function Document() {
    const {postId} = useParams();
    const [post, setPost] = React.useState({
        author: {}
    })
    const [commentContent, setCommentContent] = React.useState('');
    const [content, setContent] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [comments, setComments] = React.useState([]);
    const [records, setRecords] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        let date = new Date().toDateString();
        console.log(`時間：${date}，動作：進入文章介面`);
        firebase.firestore().collection('posts').doc(postId).onSnapshot((docSnapshot) =>{
            const data = docSnapshot.data();
            setPost(data);
        })
    }, [])

    React.useEffect(() => {
        firebase.firestore().collection('posts').doc(postId).collection('comments').orderBy('createdAt', 'desc').onSnapshot((collectionSnapshot) => {
            const data= collectionSnapshot.docs.map(doc =>{
                return doc.data();
            })
            setComments(data);
        })
    }, [])

    function toggle(isActive, field) {
        const uid = firebase.auth().currentUser.uid;
        if (isActive) {
            if (field == 'likedBy') {
                let date = new Date().toDateString();
                console.log(`時間：${date}，動作：取消按讚`);
            }
            else if (field == 'collectedBy') {
                let date = new Date().toDateString();
                console.log(`時間：${date}，動作：取消收藏`);
            }

            firebase.firestore().collection('posts').doc(postId).update({
                [field]: firebase.firestore.FieldValue.arrayRemove(uid),
            });
        }
        else {
            if (field == 'likedBy') {
                let date = new Date().toDateString();
                console.log(`時間：${date}，動作：按讚`);
            }
            else if (field == 'collectedBy') {
                let date = new Date().toDateString();
                console.log(`時間：${date}，動作：收藏`);
            }

            firebase.firestore().collection('posts').doc(postId).update({
                [field]: firebase.firestore.FieldValue.arrayUnion(uid),
            });
        }
    }

    function toggleEdited(isActive) {
        const uid = firebase.auth().currentUser.uid;
        if (isActive) {
            let date = new Date().toDateString();
            console.log(`時間：${date}，動作：完成編輯`);
            firebase.firestore().collection('posts').doc(postId).update({
                editedBy: firebase.firestore.FieldValue.arrayRemove(uid),
                content: content,
                createdAt: firebase.firestore.Timestamp.now(),
                // author: {
                //     displayName: firebase.auth().currentUser.displayName || '',
                //     department: firebase.auth().currentUser.displayName.split('-')[1] || '',
                //     photoURL: firebase.auth().currentUser.photoURL ||'',
                //     uid: uid,
                //     email: firebase.auth().currentUser.email,
                // },
            });
            
            const recordRef = firebase.firestore().collection('records').doc();
            recordRef.set({
                title: post.title,
                content: post.content,
                documentId: postId,
                categories: post.categories,
                createdAt: firebase.firestore.Timestamp.now(),
                action: '修改',
                author: {
                    displayName: firebase.auth().currentUser.displayName || '',
                    department: firebase.auth().currentUser.displayName.split('-')[1] || '',
                    uid: uid,
                },
            });
        }
        else {
            let date = new Date().toDateString();
            console.log(`時間：${date}，動作：開始編輯`);
            setContent(post.content);
            firebase.firestore().collection('posts').doc(postId).update({
                editedBy: firebase.firestore.FieldValue.arrayUnion(uid),
            });
        }
    }

    function toggleCancel() {
        let date = new Date().toDateString();
        console.log(`時間：${date}，動作：取消編輯`);
        const uid = firebase.auth().currentUser.uid;
        firebase.firestore().collection('posts').doc(postId).update({
            editedBy: firebase.firestore.FieldValue.arrayRemove(uid),
        });
    }

    function toggleDeleted() {
        let date = new Date().toDateString();
        console.log(`時間：${date}，動作：刪除文件`);
        const uid = firebase.auth().currentUser.uid;
        const recordRef = firebase.firestore().collection('records').doc();
            recordRef.set({
                title: post.title,
                content: post.content,
                documentId: postId,
                categories: post.categories,
                createdAt: firebase.firestore.Timestamp.now(),
                action: '刪除',
                author: {
                    displayName: firebase.auth().currentUser.displayName || '',
                    department: firebase.auth().currentUser.displayName.split('-')[1] || '',
                    uid: uid,
                },
            });
            
        navigate('/posts');
        firebase.firestore().collection('posts').doc(postId).delete();
    }

    function toggleRecordsOpened(isActive) {
        const uid = firebase.auth().currentUser.uid;
        if (isActive) {
            let date = new Date().toDateString();
            console.log(`時間：${date}，動作：關閉快照`);
            firebase.firestore().collection('posts').doc(postId).update({
                recordsOpenedBy: firebase.firestore.FieldValue.arrayRemove(uid),
            });
        }
        else {
            let date = new Date().toDateString();
            console.log(`時間：${date}，動作：開啟快照`);
            firebase.firestore().collection('posts').doc(postId).update({
                recordsOpenedBy: firebase.firestore.FieldValue.arrayUnion(uid),
            });
            const recordRef = firebase
                .firestore()
                .collection('records')
                .where('documentId', '==', postId)
                .orderBy('createdAt', 'desc')
                .onSnapshot((recordsSnapshot) => {
                    const data = recordsSnapshot.docs.map((doc) => {
                        return (
                            {
                                displayName: doc.data().author.displayName,
                                createdAt: doc.data().createdAt.toDate().toLocaleString(),
                                action: doc.data().action,
                                content: doc.data().content,
                            }
                        );
                    });
                    setRecords(data);
                });
        }
    }

    
    const isCollected = post.collectedBy?.includes(firebase.auth().currentUser.uid);
    const isLiked = post.likedBy?.includes(firebase.auth().currentUser.uid);
    const isEdited = post.editedBy?.includes(firebase.auth().currentUser.uid);
    const isRecordsOpened = post.recordsOpenedBy?.includes(firebase.auth().currentUser.uid);

    function onSubmit() {
        let date = new Date().toDateString();
        console.log(`時間：${date}，動作：留言`);
        setIsLoading(true);
        const batch  = firebase.firestore().batch();
        const postRef = firebase.firestore().collection('posts').doc(postId);
        batch.update(postRef, {
            commentsCount: firebase.firestore.FieldValue.increment(1)
        });
        const commentRef = postRef.collection('comments').doc();
        batch.set(commentRef, {
            content: commentContent,
            createdAt: firebase.firestore.Timestamp.now(),
            author: {
                uid: firebase.auth().currentUser.uid,
                displayName: firebase.auth().currentUser.displayName || '',
                photoURL: firebase.auth().currentUser.photoURL ||'',
            },
        });

        batch.commit().then(() => {
            setCommentContent('');
            setIsLoading(false);
        });

    }

    return (
        <>
            {post.author.photoURL?(
                <Image src={post.author.photoURL} avatar/>
            ):(
                <Icon name="user circle" />
            )}
            
            {post.author.displayName || 'user'}
            <Header>
                {post.title}
                <Header.Subheader>
                    {post.categories}-{post.createdAt?.toDate().toLocaleString()}
                </Header.Subheader>
            </Header>
            <Image src={post.imageURL} />

            {isEdited?
            <Form>
                <Form.TextArea value={content} onChange={(e) => {
                    setContent(e.target.value);
                }} />
            </Form>:
            <Segment basic vertical>{post.content}</Segment>
            }
            

            <Segment basic vertical>
                <p>留言 {post.commentsCount || 0} 讚 {post.likedBy?.length || 0}</p>
                <Icon 
                    name={isLiked?'thumbs up':'thumbs up outline'}
                    color={isLiked?'blue':'black'}
                    link 
                    onClick={() => toggle(isLiked, 'likedBy')}/>
                <Icon 
                    name={isCollected?'bookmark':'bookmark outline'}
                    color={isCollected?'blue':'black'} 
                    link 
                    onClick={() => toggle(isCollected, 'collectedBy')}/>

                {
                    (post.categories == '我的文件' || post.categories == '部門文件')?(
                        <>
                            <Icon 
                                name={isEdited?'edit':'edit outline'} 
                                color={isEdited?'blue':'black'}
                                link
                                onClick={() => toggleEdited(isEdited)} />
                            {
                                (isEdited)?(
                                    <Icon 
                                        name='cancel' 
                                        color='red'
                                        link
                                        onClick={() => toggleCancel()} />
                                ):(null)
                            }
                        </>
                    ):(null)
                }   
                    
                {
                    (post.categories == '我的文件')?(
                        <Icon 
                            name="trash alternate outline" 
                            color="black"
                            link
                            onClick={() => toggleDeleted()} />
                    ):(null)
                    
                }
                <Icon 
                    name={isRecordsOpened?'file text':'file text outline'}
                    color={isRecordsOpened?'blue':'black'} 
                    link 
                    onClick={() => toggleRecordsOpened(isRecordsOpened)}/>
                           
            </Segment>

            {
                isRecordsOpened ? <Header>文件快照</Header> : null
            }
            {
                isRecordsOpened ?
                    records?.map((record) => {
                        return (
                            <Segment>
                                {`員工：${record.displayName}`}
                                <br />
                                {`日期：${record.createdAt}`}
                                <br />
                                {`動作：${record.action}`}
                                <br />
                                {`快照：${record.content}`}
                                <br />
                            </Segment>
                        );
                    })
                        
                    
                    :
                    (null)
            }

            <Comment.Group>
                <Form reply>
                    <Form.TextArea value={commentContent} onChange={(e) => {
                        setCommentContent(e.target.value);
                    }} />
                    <Form.Button onClick={onSubmit} loading={isLoading}>留言</Form.Button>
                </Form>
                <Header>共{post.commentsCount || 0}則留言</Header>
                {comments.map(comment => {
                    return (
                        <Comment>
                            <Comment.Avatar src={comment.author.photoURL} />
                            <Comment.Content>
                                <Comment.Author as="span">{comment.author.displayName || 'user'}</Comment.Author>
                                <Comment.Metadata>{comment.createdAt.toDate().toLocaleString()}</Comment.Metadata>
                                <Comment.Text>{comment.content}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    );
                })}
                
            </Comment.Group>
        </>
    );
}

export default Document;