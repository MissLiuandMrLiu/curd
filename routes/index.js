var crypto = require('crypto')
//引入users集合操作方法
var User = require('../model/user')
var Post = require('../model/post')
var mongodb = require('../model/db')

module.exports = function (app) {
    app.get('/',function (req,res) {
        Post.get(null,function (err,docs) {
            if(err){
                req.flash('error',err);
                return res.redirect('/')
            }
            res.render('index',{
                title:'首页',
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                docs:docs
            })
        })
    })
    app.get('/reg',function (req,res) {
        res.render('reg',{
            title:'注册',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
    app.post('/reg',function (req,res) {
        var username = req.body.username;
        var password = req.body.password;
        var password_repeat = req.body['password_repeat'];

        //检查两次密码是否一样
        if(password_repeat != password){
            req.flash('error','两次密码不一样')
            return res.redirect('/reg')
        }
        //对密码进行加密
        var md5 = crypto.createHash('md5');
        req.body.password = md5.update(req.body.password).digest('hex')
        //将注册信息传入user对象
        var newUser = new User(req.body)
        console.log(newUser)
        //判断用户名是否存在
        User.get(newUser.username,function (err,user) {
            if(err){
                req.flash('error',err);
                return res.redirect('/reg')
            }
            if(user){
                req.flash('error','用户名已存在')
                return res.redirect('/reg')
            }
            //将用户信息存入数据库,并且跳转到登录
            newUser.save(function (err,user) {
                if(err){
                    req.flash('error',err);
                    return res.redirect('/reg')
                }
                req.session.user = newUser;
                req.flash('success','注册成功');
                return res.redirect('/login')
            })
        })



    })
    app.get('/login',function (req,res) {
        res.render('login',{
            title:'登录',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
    app.post('/login',function (req,res) {
        //对密码进行加密
        console.log(req.body)
        var md5 = crypto.createHash('md5')
        var password = md5.update(req.body.password).digest('hex')
        //判断用户名是否存在
        User.get(req.body.username,function (err,user) {
            if(err){
                req.flash('error',err);
                return res.redirect('/login')
            }
            console.log(user)
            if(!user){

                req.flash('error',"用户名不存在");
                return res.redirect('/login')
            }

            if(user.password != password){
                req.flash('error','密码错误');
                return res.direction('/login')
            }

            //把用户保存到session中,并给出提示 ,登陆成功
            req.session.user = user;
            req.flash('success','登陆成功');
            return res.redirect('/');

        })
    })
    app.get('/add',function (req,res) {
        res.render('add',{
            title:'添加同学',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
    app.post('/add',function (req,res) {
        //获取当前登录用户的用户名
        var currentName = req.body.uname;
        var newPost = new Post(currentName,req.body.sex,req.body.age,req.body.number,req.body.Email);
        newPost.save(function (err) {
            if(err){
                req.flash('error',err)
                return res.redirect('/')
            }
            req.flash('success','添加成功');
             res.redirect('/')
        })
    })
    app.get('/logout',function (req,res) {
        req.session.user = null;
        req.flash('success','退出成功');
        return res.redirect('/');
    })
    app.get('/edit/:uname/:number/:Email',function (req,res) {
        Post.edit(req.params.uname,req.params.number,req.params.Email,function (err,doc) {
            if(err){
                req.flash('error',err);
                return res.redirect('/')
            }
            console.log(doc)
            return res.render('edit',{
                title:'编辑页面',
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                doc:doc
            })
        })
    })
    app.post('/edit',function (req,res) {
        Post.update(req.body.uname,req.body.sex,req.body.age,req.body.number,req.body.Email,function (err,doc) {
        if(err){
            req.flash('error',err)
            return res.redirect('/')
        }
        req.flash('success','修改成功')
        return res.redirect('/')
    })
    });
    app.get('/remove/:uname',function (req,res) {
        Post.remove(req.params.uname,function (err) {
            if(err){
                req.flash('error',err);
                return res.redirect('/')
            }
            req.flash('success','删除成功')
            return res.redirect('/')
        })
    })
    app.get('/search',function (req,res) {
        Post.search(req.query.keyword,function (err,docs) {
            console.log(docs)
            if(err){
                req.flash('error',err)
                return res.redirect('/')
            }
            return res.render('index',{
                title:'搜索结果',
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                docs:docs
            })
        })
    })
}