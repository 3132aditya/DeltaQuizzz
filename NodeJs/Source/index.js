const  express = require('express');
const ejs = require('ejs');
const path = require('path');
const collection = require('./mongo');
const collection1 = require('./mongo1');
const collectionProfile = require('./mongoProfile');


let questionData;
let i=0;
let score = 0;

const tempPath = path.join(__dirname,'../templates');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set("view engine", "ejs");
app.set("views",tempPath);
app.use('/public',express.static('public'));
app.use('/img',express.static('img'));



app.get('/',(req,resp)=>{
    resp.render('signin',{
        status:'',
    });
});
app.get('/home',(req,resp)=>{
    resp.render('home');
});

app.get('/registration',(req,resp)=>{
    resp.render('registration',{
        status:'',
    });
});

app.get('/post',(req,resp)=>{
    resp.render('post',{
        status:'',
    });
});

app.get('/signin',(req,resp)=>{
    resp.render('signin',{
        status:'',
    });
});
app.get('/search',(req,resp)=>{
    resp.render('search',{
        status:'',
    });
});



app.post("/registration", async (req,resp)=>{

    const data = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    };
    if(req.body.password===req.body.reenter){
    await collection.insertMany([data]);
    }
    else{
        
        resp.render('registration',{
            status:'Passwords Doesnot Match!!',
        });
    }
    resp.render('home',{
        name:data.name
    });
    
    

});

app.post('/post' , async (req,resp)=>{

    let db = await collection.findOne({username:req.body.username});

        let data = {
            username: req.body.username,
            question : req.body.question,
            answer : req.body.answer,
            name : db.name
        }
    
        await collection1.insertMany([data]);
    
   resp.render('post',{
    status:'Successfully Uploaded',
   });
  
});

app.post('/signin', async (req,resp)=>{
    try {
        let check = await collection.findOne({username:req.body.username});
        if(check.password===req.body.password){
            resp.render('home',{
                name: check.name,
                
            });
        }

        else{
            resp.render('signin',{
                status:'Incorrect Username or Password!!',
            });
        }
    }
     catch{
        resp.send("Wrong SignIn Details");
    }

    
});


app.post('/search', async (req,resp)=>{


    
    questionData = await collection1.find({
        '$or':[
            {name:{$regex:`${req.body.name}`}}
        ]
    });

    if(questionData.length==0){
        resp.render('search',{
            status:'Quiz belonging to the name doesnot exist!!',
        })
    }

    else{

    resp.render('searchResult',{
        question:questionData[i].question,
        value:'',
        
    });
    
     await collectionProfile.insertMany({question:questionData.question});

}

});


app.post('/searchResult', async (req,resp)=>{
    

    if(questionData[i].answer===req.body.inputAnswer && i<questionData.length-1){
        resp.render('searchResult',{
            value:'Correct',
            question:questionData[++i].question,
        });

        score++;
    }

    else if(questionData[i].answer!=req.body.inputAnswer && i<questionData.length-1){
        resp.render('searchResult',{
            value:'Incorrect',
            question:questionData[++i].question,
        });

        
    }

    else if(i=questionData.length-1){
        if(questionData[i].answer!=req.body.inputAnswer){
            resp.render('result',{
                value:'Incorrect',
                length: questionData.length,
                mark: score
            });
        }

        else {
            resp.render('result',{
                value:'Correct',
                length: questionData.length,
                mark: score+1

            });
        }
        i=0;
        score=0;

    }
});

app.listen(4500,()=>{
    console.log('Port Connected');
});
