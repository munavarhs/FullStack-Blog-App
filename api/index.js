import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import fs from 'fs';

//models
import User from './models/User.js';
import Post from './models/Post.js';
import PostModel from './models/Post.js';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const uploadMiddleware = multer({dest: 'uploads/'});
const salt = bycrypt.genSaltSync(10);
const secret = 'adfadknkfnknfkwnfkwurgjbjw';

const app = express();
app.use(cors({credentials:true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const uri = 'mongodb://localhost:27017/mydatabase';
mongoose
    .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected to Successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));


app.post('/register',async (req, res)=>{
    const {username, password} = req.body;
    try{
        const newUser = await User.create({username, password:bycrypt.hashSync(password,salt)});
        res.json(newUser);
    }catch(e){
        res.status(400).json(e);
    }
});


app.post('/login', async (req, res)=>{
    const {username, password} = req.body;
    try{
        const newUser = await User.findOne({username});
        if(!newUser){
            return res.status(404).json({error: 'User not found'});
        }
        const passOk = bycrypt.compareSync(password, newUser.password);
        //res.json({success: passOk})
        if(passOk){
            jwt.sign({username, id:newUser._id}, secret, {}, (err, token)=>{
                if (err) throw err;
                res.cookie('token', token).json({
                    id: newUser._id,
                    username
                });
            });
        }else{
            res.status(400).json('wrong credentials');
        }
    }catch(error){
        console.error("Error during login:", error);
        res.status(500).json({error: "Internal server error"});
    }

});

app.get('/profile', (req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info)=>{
        if(err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req,res)=>{
    res.cookie('token', '').json('ok')
});

app.post('/post', uploadMiddleware.single('file'), async (req,res)=>{
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
    const { originalname, path } = req.file;
    const parts =  originalname?.split('.');
    const ext = parts[parts.length-1];
    const newPath = path+'.'+ext
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info)=>{
        if(err) throw err;
        const {title, summary, content} = req.body;
        const PostDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
    });
    res.json(PostDoc);
    });
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
  
    // Handle file upload and renaming
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname?.split('.');
      const ext = parts[parts.length - 1];
      newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
    }
  
    // Extract token from cookies
    const { token } = req.cookies;
  
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) return res.status(401).json('Invalid or expired token');
  
      try {
        // Extract post details from request body
        const { id, title, summary, content } = req.body;
  
        // Find the post by ID
        const postDoc = await Post.findById(id);
        if (!postDoc) return res.status(404).json('Post not found');
  
        // Check if the user is the author
        const isAuthor =
          JSON.stringify(postDoc.author._id) === JSON.stringify(info.id);
        if (!isAuthor) {
          return res.status(403).json('Sorry, you are not the author');
        }
  
        // Update the document properties
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        if (newPath) postDoc.cover = newPath;
  
        // Save the updated document
        const updatedPost = await postDoc.save();
  
        // Respond with the updated post
        res.json(updatedPost);
      } catch (err) {
        console.error(err);
        res.status(500).json('An error occurred while updating the post');
      }
    });
  });
  

//Testing
app.get('/register', (req,res)=>{
    res.send('GET request received!!')
});

app.get('/login', (req,res)=>{
    res.send('GET request received for Login!!')
});

app.get('/post', async (req,res)=>{
    const posts = await Post.find()
    .populate('author',['username'])
    .sort({createdAt:-1})
    .limit(20);
    res.json(posts);
})

app.get('/post/:id', async (req,res)=>{
    const {id} = req.params;
   const PostDoc =  await Post.findById(id).populate('author',['username']);
   res.json(PostDoc);
})

app.listen(4000);