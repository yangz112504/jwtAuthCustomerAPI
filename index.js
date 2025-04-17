const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'mySecretKey';

app.use(express.json());

const users = [];

app.post('/register', (req, res)=>{
    const {username, password} = req.body;

    const existingUser = users.find((u)=> u.username === username);
    if (existingUser){
        return res.status(400).json({message: 'Username already exists'});
    }

    const newUser = {
        id: users.length+1,
        username,
        password,
    };
    users.push(newUser);

    res.status(201).json({message: 'User registered successfully'});
})

app.post('/login', (req,res)=>{
    const {username, password} = req.body;

    const user = users.find((u)=> u.username === username && u.password === password);

    if(user){
        //User authenticated, so generate token
        const token = jwt.sign({id: user.id, username: user.username}, secretKey);
        res.json({token});
    }else{
        res.status(401).json({message: 'Invalid credentials'});
    }
});

app.get('/dashboard', verifyToken, (req,res)=>{
    res.json({message: 'Welcome to the Customer Portal!'});
});

function verifyToken(req,res,next){
    const token = req.headers['authorization'];

    if(typeof token !== 'undefined'){
        jwt.verify(token, secretKey, (err, authData)=>{
            if(err){
                res.sendStatus(403);
            }else{
                req.authData = authData;
                next();
            }
        });
    }else{
        res.sendStatus(401);
    }
}

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
