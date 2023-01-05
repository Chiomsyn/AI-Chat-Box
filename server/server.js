import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

console.log(process.env.OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration); // instance of api

const app = express();
// setup middlewares
app.use(cors()); //allow us make cross origin request and call our server to the front end
app.use(express.json()); // allow us parse json from the front end to back-end

// dummy root route
app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello You',
  });
});

app.post('/', async (req, res) => {
  try {
    // higher temperature value like (0.7) means the module will take more risk
    // maximum number of tokens determines the length of the response one tokenis roughly four characters of english text
    // frequency_penalty: 0 means its not going to repeat more than one sentences but with 0.5 it can repeat incase u ask it a similar question
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.5,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({ error });
  }
});

app.listen(5000, () =>
  console.log('Server is listening on port http://localhost:5000')
);

//difference btw app.get and app.post is that with the former u can't receive much info from the front end but with the later you can get a body
