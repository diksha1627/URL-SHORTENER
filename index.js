import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { nanoid } from 'nanoid';
import URLModel from './models/shortUrl.js'; // Make sure you have the correct path to your model
import path from 'path';
import 'dotenv/config';

const CONNECTION_URL = process.env.DATABASE;
const PORT = 3000 || process.env.PORT;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const publicDir = path.resolve(new URL(import.meta.url).pathname, './public');
app.use(express.static(publicDir));

app.get('/', async (req, res) => {
  const urls = await URLModel.find({});

  res.render('home', { urls });
});

app.post('/', async (req, res) => {
  const url = req.body.url;

  const shortedId = nanoid(5);
  try {
    await URLModel.create({ url:url ,  shortId:shortedId});
  } catch (error) {
    console.log(error);
  }
});

app.get('/:shortId',async(req,res)=>{

  const {shortId} = req.params;

  try {

    const shortedUrl = await URLModel.findOne({shortId});

    try {
      if(shortedUrl){
      shortedUrl.clicks++;
      await shortedUrl.save();
      res.redirect(shortedUrl.url);
    }
   
    } catch (error) {
      console.log(error);
    }
    
  } catch (error) {
    
    console.log(error)
  }
 
})

mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    console.log('MongoDb Connected');
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  })
  .catch((error) => console.log('server not connecting', error));
