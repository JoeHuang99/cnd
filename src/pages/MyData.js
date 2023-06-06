import React from 'react'
import {Routes,Route} from 'react-router-dom'
import { Grid ,Container,} from 'semantic-ui-react';
import Document from './Document'
import Documents from './Documents'
import Categories from '../components/Categories';
import MyMenu from '../components/MyMenu.js';
import MyDocuments from  './MyDocuments.js';
import MyCollections from './MyCollections.js';
import MySettings from './MySettings.js';

function MyData({user}) {
  let date = new Date().toDateString();
  console.log(`時間：${date}，動作：進入個人資料`);
  return (
    <Container>
         <Grid>
        <Grid.Row>
            <Grid.Column width={3}><MyMenu /></Grid.Column>
            <Grid.Column width={10}>
                <Routes>
                    <Route path="posts" element={<MyDocuments />} exact/>
                    <Route path="collections" element={<MyCollections />} exact/>
                    <Route path="settings" element={<MySettings user={user} />} exact/>
                </Routes>
                </Grid.Column>
            <Grid.Column width={3}></Grid.Column>
            </Grid.Row>
        </Grid>
    </Container>
    
  )
}

export default MyData;