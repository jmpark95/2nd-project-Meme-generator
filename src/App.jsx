import { useEffect, useState } from "react";
import styled from "styled-components";
import { small, medium, large } from "./responsive";

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

const Main = styled.main``;

const ImageSection = styled.div`
   margin-bottom: 1rem;
`;

const ImageWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 30vh;
`;

const Image = styled.img`
   object-fit: contain;
   max-width: 100%;
   max-height: 100%;
`;

const Form = styled.form`
   display: flex;
   flex-direction: column;
   justify-content: space-around;
   width: 60%;
   height: 100%;
   margin: auto;
   ${small({ width: "50%" })}
   ${medium({ width: "30%" })}
   ${large({ width: "20%" })}
`;

const FormSection = styled.div`
   margin-bottom: 1rem;
`;

const Input = styled.input`
   padding: 0.3rem 0.5rem;
`;

const Button = styled.button`
   background: lightgray;
   border: 1px solid;
   border-radius: 0.2rem;
   padding: 0.5rem 0.5rem;
   cursor: pointer;
   width: 100%;
   margin-bottom: 1rem;
`;

function App() {
   const [meme, setMeme] = useState({
      template_id: null,
      image: null,
   });
   const [userInput, setUserInput] = useState({});

   useEffect(() => {
      fetchMemesAndUpdateState();
   }, []);

   function fetchMemesAndUpdateState() {
      fetch("https://api.imgflip.com/get_memes")
         .then((res) => res.json())
         .then((memeData) => {
            const randomNumber = Math.floor(
               Math.random() * memeData.data.memes.length
            );
            const currentMeme = memeData.data.memes[randomNumber];
            const currentMemeBoxCount =
               memeData.data.memes[randomNumber].box_count;

            setMeme({
               ...meme,
               image: currentMeme.url,
               template_id: currentMeme.id,
            });

            let initialState = {};
            for (let i = 0; i < currentMemeBoxCount; i++) {
               initialState[`text${i}`] = "";
            }
            setUserInput(initialState);
         });
   }

   function handleSubmit(e) {
      if (userInput) {
         e.preventDefault();

         const params = new URLSearchParams();
         params.append("template_id", meme.template_id);
         params.append("username", "jmpark95");
         params.append("password", "testpasswordforapi"); //unable to use process.env.REACT_APP for some reason?? https://create-react-app.dev/docs/adding-custom-environment-variables/
         for (let i = 0; i < Object.keys(userInput).length; i++) {
            params.append(`boxes[${i}][text]`, userInput[`text${i}`]);
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
   }

   function handleChange(e) {
      setUserInput({ ...userInput, [e.target.name]: e.target.value });
   }

   function handleRefresh(e) {
      e.preventDefault();
      fetchMemesAndUpdateState();
   }

   let inputFields = [];
   for (let i = 0; i < Object.keys(userInput).length; i++) {
      inputFields.push(
         <Input
            type="text"
            name={`text${i}`}
            key={i}
            placeholder={`Text${i + 1}`}
            value={userInput[`text${i}`]}
            onChange={handleChange}
            style={{ marginBottom: "1rem" }}
         />
      );
   }

   return (
      <AppContainer>
         <Header>Random meme generator</Header>
         <Main>
            <ImageSection>
               <ImageWrapper>
                  <Image src={meme.image} alt="meme-image" />
               </ImageWrapper>
            </ImageSection>

            <FormSection>
               <Form onSubmit={handleSubmit}>
                  {inputFields}
                  <Button>Create your meme</Button>
                  <Button type="refresh" onClick={handleRefresh}>
                     Generate new random meme
                  </Button>
               </Form>
            </FormSection>
         </Main>
      </AppContainer>
   );
}

export default App;
