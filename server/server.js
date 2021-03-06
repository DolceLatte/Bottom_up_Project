// import Category from '../src/components/Category';
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer =require('multer');
const fs = require('fs');
var https = require('https');

process.setMaxListeners(0);
const connection = mysql.createConnection({
    host:"34.97.84.97",
    user:'root',
    password:'djemals',
    database:'test'
});
connection.connect();
var multer_settings = multer({
    dest:'./'
})

var app = express();
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

router.route(app.post('/',(req,res)=>{
    var isLogin;
    try{
        var userdata=jwt.verify(req.body.token,'ddingdong');
        if(userdata.id){
            isLogin=userdata.id
        }
    }catch(err){
        isLogin=false
    }
    console.log(isLogin)
    res.send(isLogin)
}));


router.route(app.post('/list',(req,res)=>{
    var category;
    console.log(req.body)
    if(req.body.location){


    switch(req.body.category){
        case 'koreanfood':
            category="한식"
        break;
        case 'westfood':
            category="양식"
        break;
        case 'japanfood':
            category="일식"
        break;
        case 'chinafood':
            category="중식"
        break;
        case 'chicken':
            category="치킨"
        break;
        case 'pizza':
            category="피자"
        break;
        case 'pigfoot':
            category="족발"
        break;
        case 'boon':
            category="분식"
        break;
        case 'all':
            category="%"
        break;
        default:

    }
    // '+/*req.body.location*/+'
    connection.query('SELECT * FROM store where category like "'+category+'" AND postNumber like "'+req.body.location+'";',function(err,rows,fields){
        if(!err){
            // console.log(rows)
            res.send(rows);
        }else{
            console.log('Error while performing Query',err);
        }
    });
}}));

router.route(app.post('/signup',(req,res)=>{
    var data = req.body;
    var sql='INSERT INTO user VALUES("'+data.id+'","'+data.password+'","'+data.name+'","'+data.phone+'","'+data.birth+'")';
    var dir='../src/asset/images/';
        if(!fs.existsSync(dir+data.id)){
            fs.mkdirSync(dir+data.id)
        }
    connection.query(sql,function(err,result){
        if(err) {
            throw err;
        }
        console.log("INSERT OK");
        res.sendStatus(200)
    })
}));

app.post('/signin',(req,res)=>{
    console.log(res)
    var data = req.body;
    var sql = 'select (id),(password) from user where id like "'+data.id+'"';
    let isLogin;
        connection.query(sql,function(err,result){
            if(err) throw err;
            if(result.length===0){
                console.log("No result")
                isLogin="id"
            }else{
                if(data.password===result[0].password){
                    //로그인 성공
                    let token = jwt.sign({
                            id:data.id
                    },
                    'ddingdong',{
                    expiresIn:'100m'
                    })
                    isLogin={
                        token:token,
                        user:data.id
                    }
                }else{
                        isLogin="pass"//비밀번호 오류
                }
            }
            console.log("This is")
            console.log(isLogin)
            res.send(isLogin)
        })

});

router.route(app.post('/menu',(req,res)=>{
    var data = req.body;
    var sql = 'select * from store where storeID like "'+data.storeID+'"';
    connection.query(sql,function(err,result){
        if(err) throw err;
        res.send(result);
    })

}))
var server=app.listen(4000);
var io = require('socket.io').listen(server);
router.route(app.post('/storemanage',(req,res)=>{
    var order = io.of('/storemanage').on('connection',function(socket){
        console.log("HiSocket")

        socket.on('order message',function(data){
            console.log(data)
            var storeId = socket.storeID = data.storeID;
            order.emit(storeId,data.order);
        });
        socket.onclose = function(){
           socketstate = 0
        };
    })
    var token = jwt.verify(req.body.token,'ddingdong');
    var sql = 'select * from store where userid like "'+token.id+'"';
    connection.query(sql,function(err,result){
        if(err) throw err;
        res.send(result);
    })
}))

var receiveMenu;
router.route(app.post('/storemanage/menu',(req,res)=>{
    receiveMenu=req.body
}))

router.route(app.post('/order',(req,res)=>{
    var order = req.body.order
    var store = req.body.store

    // console.log(order.order[0])
    // for(var i in order){
    //     console.log(order[i])
    // }
    console.log(store)
    var sql='select (menu) from store where storename like "'+store+'";';
    connection.query(sql,function(err,result){
        if(err) throw err;
        var menu = JSON.parse(result[0].menu)
        console.log(order)
        console.log(menu)
        for(var i in menu){
            for(var j in order){
                if(order[j].menuname===menu[i].name){
                    console.log("i"+i)
                    console.log("j"+j)
                    console.log(order[j].menuname)
                    console.log(menu[i].name)
                    var temp=parseInt(menu[i].click)
                    menu[i].click += parseInt(order[j].menumany)
                }
            }
        }
        console.log(menu)
        sql="UPDATE store SET menu ='"+JSON.stringify(menu)+"' where storename like '"+store+"';";
        console.log(sql)
        connection.query(sql,function(err,result){
            if(err) throw err;
            console.log("updata")
        })
    })
}))

router.route(app.post('/storemanage/fix',multer_settings.fields([{name:'mainImg'},{name:'menuImg'}]),(req,res)=>{
    console.log(receiveMenu)
    const file = req.files;
    const input_data=req.body;
    //DB에 추가
    if(input_data.subbtn==="추가하기"){
        var sql = "insert into store (storename,userid,tel,location,menu,openinghours,description,category,postNumber) values('"+input_data.storename+"','"+input_data.userId+"','"+input_data.storetel+"','"+input_data.address+"','"+JSON.stringify(receiveMenu.menu)+"','"+input_data.storetime+"','"+input_data.storedesc+"','"+ input_data.storecategory +"','"+receiveMenu.postcode+"');"
        connection.query(sql, function(err) {
            if (err) {
            throw err;
            }else{
                console.log("insert OK")
            }

        })
    }else if(input_data.subbtn==="수정하기"){
        var sql = "update store set storename='"+input_data.storename+"',tel='"+ input_data.storetel +"',menu='"+ JSON.stringify(receiveMenu.menu) +"',location='"+input_data.address+"',openinghours='"+ input_data.storetime+"',description='"+ input_data.storedesc +"',category='"+ input_data.storecategory+"',postNumber='"+ receiveMenu.postcode + "'where userid='"+input_data.userId+"';"
        connection.query(sql, function(err) {
          if (err) {
            throw err;
          }else{
              console.log("updata OK")
          }
        })
    }
    var dir='../src/asset/images/'+input_data.userId+"/";
    console.log(file['mainImg'])
    if(file['mainImg']){
        fs.readFile(file['mainImg'][0].path,(err,data)=>{
            var filepath = dir+"main.jpg";
            fs.writeFile(filepath,data,function(err){
                if(err){
                    throw err;
                }else{
                    fs.unlink(file['mainImg'][0].path,function(remove){
                        if(remove){
                            throw remove;
                        }
                    })
                }
            })
        })
    }
    console.log(file['menuImg'])
    if(file['menuImg']){
        var count=0;
        for(var i =0;i<receiveMenu.fix.length;i++){
            console.log(receiveMenu.fix[i])
            console.log(count)
            if(receiveMenu.fix[i]){
                var data =fs.readFileSync(file['menuImg'][count].path)
                var filepath = dir+file['menuImg'][count].originalname;
                console.log(filepath)
                count++
                fs.writeFileSync(filepath,data);
            }
        }
    }
    res.redirect("http://ddingdong.gq/storemanage")
}))

app.post('/menu/search', (req, res) => {
    var client = require('cheerio-httpcli');
    var data = req.body.data;
    var word = encodeURIComponent(data)
    let url = 'https://search.naver.com/search.naver?sm=tab_hty.top&where=post&query=' + word;
    var re = []
    client.fetch(url, re, function(err, $, res) {
      if (err) {
        console.log(err);
        return;
      }
      $(".sh_blog_top").each(function(post) {
        var param = {
          title : $(this).find('.sh_blog_title').text(),
          link : $(this).find('.sh_blog_title').attr('href'),
          image : $(this).find('.sh_blog_thumbnail').attr('src'),
          passage : $(this).find('.sh_blog_passage').text()
        }
        re.push(param)
      })
   })
   setTimeout(function() {
     res.send(re.slice(0,5));
   }, 1500);
  });
