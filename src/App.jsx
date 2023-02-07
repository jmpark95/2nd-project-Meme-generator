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

function App() {
   const [meme, setMeme] = useState({
      template_id: null,
      image: null,
      boxCount: null,
   });

   const [userInput, setUserInput] = useState([
      { text: "test" },
      { text: "test" },
   ]);

   useEffect(() => {
      fetch("https://api.imgflip.com/get_memes")
         .then((res) => res.json())
         .then((memeData) => {
            const randomNumber = Math.floor(
               Math.random() * memeData.data.memes.length
            );
            const currentMeme = memeData.data.memes[randomNumber];

            setMeme({
               ...meme,
               image: currentMeme.url,
               boxCount: currentMeme.box_count,
               template_id: currentMeme.id,
            });
         });
   }, []);

   let inputFields = [];
   for (let i = 0; i < meme.boxCount; i++) {
      inputFields.push(<Input key={i} placeholder={`Text${i + 1}`} />);
   }

   function handleSubmit(e) {
      e.preventDefault();

      const params = new URLSearchParams();
      params.append("template_id", meme.template_id);
      params.append("username", "jmpark95");
      params.append("password", "testpasswordforapi"); //unable to use process.env.REACT_APP for some reason?? https://create-react-app.dev/docs/adding-custom-environment-variables/
      for (let i = 0; i < meme.boxCount; i++) {
         params.append(`boxes[${i}][text]`, userInput[i]["text"]);
      }

      fetch("https://api.imgflip.com/caption_image", {
         method: "POST",
         header: {
            "Content-Type": "application/x-www-form-urlencoded;",
         },
         body: new URLSearchParams(params),
      })
         .then((res) => res.json())
         .then((data) =>
            setMeme({
               ...meme,
               image: data.data.url,
            })
         )
         .catch((err) => {
            console.error("Error:", err);
         });
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
