import { Container, Image } from "semantic-ui-react";

function HomePage() {
    let date = new Date().toDateString();
    console.log(`時間：${date}，動作：進入首頁`);
    return (
        <Container>
            <Image 
                src="https://firebasestorage.googleapis.com/v0/b/fir-cnd-ad7c7.appspot.com/o/post-images%2F%E5%8F%B0GG.png?alt=media&token=9e3ee5c8-5969-4a6e-955b-d94d9a4a4ad7"
                centered
                size="medium">
            </Image>
        </Container>
    )
}

export default HomePage;