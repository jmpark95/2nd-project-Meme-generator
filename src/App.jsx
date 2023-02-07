import { useEffect, useState } from "react";
import styled from "styled-components";
import Input from "./components/Input";
import { nanoid } from "nanoid";

const AppContainer = styled.div`
   width: 90%;
   margin: 1rem auto;
   text-align: center;
`;

const Header = styled.header`
   margin-bottom: 1rem;
   font-size: clamp(1.3rem, 2.5vw, 2.5rem);
   font-weight: 600;
`;

const ImageWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 30vh;
   border: 1px solid;
`;

const Image = styled.img`
   object-fit: contain;
   max-width: 100%;
   max-height: 100%;
`;

// {
//    "id": "181913649",
//    "name": "Drake Hotline Bling",
//    "url": "https://i.imgflip.com/30b1gx.jpg",
//    "width": 1200,
//    "height": 1200,
//    "box_count": 2,
//    "captions": 0
//    },

function App() {
   const [meme, setMeme] = useState({
      image: null,
      boxCount: null,
   });

   useEffect(() => {
      fetch("https://api.imgflip.com/get_memes")
         .then((res) => res.json())
         .then((memeData) => {
            const randomNumber = Math.floor(
               Math.random() * memeData.data.memes.length
            );
            setMeme({
               ...meme,
               image: memeData.data.memes[randomNumber].url,
               boxCount: memeData.data.memes[randomNumber].box_count,
            });
         });
   }, []);

   // const inputFields = meme..map((item, index) => (
   //    <input
   //       key={index}
   //       id={index}
   //       text={item.text}
   //       placeholder={`Text${index + 1}`}
   //    />
   // ));

   let inputFields = [];
   for (let i = 0; i < meme.boxCount; i++) {
      inputFields.push(<Input key={i} placeholder={`Text${i + 1}`} />);
   }

   function handleSubmit(e) {
      e.preventDefault();

      fetch("https://api.imgflip.com/caption_image", {
         method: "POST",
         header: {
            "Content-Type": "application/x-www-form-urlencoded;",
         },
         body: new URLSearchParams({
            template_id: "87743020",
            username: "jmpark95",
            password: "testpasswordforapi", //unable to use process.env.REACT_APP for some reason?? https://create-react-app.dev/docs/adding-custom-environment-variables/
            "boxes[0][text]": "test",
            "boxes[1][text]": "asdf",
         }),
      })
         .then((res) => res.json())
         .then((data) => console.log(data));
   }

   return (
      <AppContainer>
         <Header>Random meme generator</Header>
         <main>
            <div>
               <ImageWrapper>
                  <Image src={meme.image} alt="" />
               </ImageWrapper>
            </div>

            <div>
               <form onSubmit={handleSubmit}>
                  {inputFields}
                  <button>Create your meme</button>
               </form>
            </div>

            <button>Generate new random meme</button>
         </main>
      </AppContainer>
   );
}

export default App;
