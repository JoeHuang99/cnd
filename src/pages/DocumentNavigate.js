import React from 'react'
import {Routes,Route} from 'react-router-dom'
import { Grid ,Container,} from 'semantic-ui-react';
import Document from './Document'
import Documents from './Documents'
import Categories from '../components/Categories';
function DocumentNavigate() {
  return (
    <Container>
         <Grid>
        <Grid.Row>
            <Grid.Column width={3}><Categories/></Grid.Column>
            <Grid.Column width={10}>
                <Routes>
                    <Route path="*" element={<Documents />} exact/>
                    <Route path=":postId" element={<Document/>} exact/>
                </Routes>
                </Grid.Column>
            <Grid.Column width={3}></Grid.Column>
            </Grid.Row>
        </Grid>
    </Container>
    
  )
}

export default DocumentNavigate;