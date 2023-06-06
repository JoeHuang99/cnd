import React from 'react';
import firebase  from '../utils/firebase';
import 'firebase/compat/firestore';
import {List} from 'semantic-ui-react';
import {Link, useLocation} from 'react-router-dom';

function Categories() {
    const location = useLocation();
    const urlSearchParams = new URLSearchParams(location.search);
    const currentCategory = urlSearchParams.get('category');
    const [categories, setCategories] = React.useState([]);
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
    return (
        <List animated selection>{categories.map((category) => {
            return (
                <List.Item 
                    key={category.name}     
                    as={Link} 
                    to={`/posts?category=${category.name}`}
                    active={currentCategory === category.name}
                >
                    {category.name}
                </List.Item>
            )
        })}</List>  
    );
}

export default Categories;