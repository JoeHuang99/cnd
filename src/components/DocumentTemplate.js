import {Item, Image, Icon} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function DocumentTemplate({post}) {
    
    return <Item as={Link} to={`/posts/${post.id}`}>
        <Item.Image src={post.imageURL===''?'https://react.semantic-ui.com/images/wireframe/image.png':post.imageURL} size="tiny"/>
        <Item.Content>
            <Item.Meta>
                {
                    post.author.photoURL ? (
                        <Image src={post.author.photoURL} avatar />
                    ) : (
                        <Icon name="user circle" />
                    )
                }
                {post.categories}-{post.author.displayName || 'user'}
            </Item.Meta>
            <Item.Header>
                {post.title}

            </Item.Header>
            <Item.Description>
                {post.content}
            </Item.Description>
            <Item.Extra>
                留言 {post.commentsCount || 0} - 讚 {post.likedBy?.length || 0}
            </Item.Extra>
        </Item.Content>
    </Item>

}

export default DocumentTemplate;