import React from 'react';
import firebase from '../utils/firebase.js';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Button, Container, Header, Segment } from 'semantic-ui-react';

function History() {
    const [records, SetRecords] = React.useState(null);
    var color = '';
    React.useEffect(() => {
        let date = new Date().toDateString();
        console.log(`時間：${date}，動作：進入文件歷程`);
        const uid = firebase.auth().currentUser.uid;
        firebase
            .firestore()
            .collection('records')
            .orderBy('createdAt', 'desc')
            .onSnapshot((recordsSnapshot) => {
                const data = recordsSnapshot.docs.map(doc => {
                    const id = doc.id;
                    //console.log('ID是：' + id);
                    //console.log('Data是：' + doc.data().author.uid);
                    return (
                        (doc.data().categories == '我的文件' && doc.data().author.uid != uid) ? 
                        (null) : {
                            displayName: doc.data().author.displayName,
                            createdAt: doc.data().createdAt,
                            action: doc.data().action,
                            title: doc.data().title,
                            categories: doc.data().categories,
                            documentId: doc.data().documentId,
                        }
                    
                        
                    );
                })
                
                //console.log(data);
                SetRecords(data);
            })
    }, []);
    return (
        <Container>
            <Header>公司文件歷程</Header>
            {
                records?.map((record) => {
                    if (record != null) {
            
                        if (record.categories == '我的文件') {
                            color = 'black';
                        }
                        else if (record.categories == '部門文件') {
                            color = 'grey';
                        }
                        else if (record.categories == '公開文件') {
                            color = 'brown';
                        }
                    }

                    return (
                        (record) ?
                        <Segment inverted secondary color={color}>
                            {`員工：${record.displayName}`}
                            <br />
                            {`日期：${record.createdAt.toDate().toLocaleString()}`}
                            <br />
                            {`動作：${record.action}`}
                            <br />
                            {`文件標題：${record.title}`}
                            <br />
                            {`文件類型：${record.categories}`}
                            {/* <br />
                            {`文件ID：${record.documentId}`}
                            <br /> */}
                        </Segment>  : 
                        (null)
                    );
                })
            }
            {/* <Button onClick={() => {
                firebase
                    .firestore()
                    .collection('records')
                    .get()
                    .then((recordsSnapshot) => {
                        recordsSnapshot.forEach((doc) => {
                            doc.ref.delete();
                        });
                    })
            }}>清除紀錄</Button> */}
        </Container>
        
    );
}

export default History;