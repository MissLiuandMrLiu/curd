/**
 * Created by My love on 2017/12/15.
 */
var mongodb = require('./db');
var ObejectId = require('mongodb').ObjectID
function Post(uname,sex,age,number,Email){
    this.uname = uname;
    this.sex = sex
    this.age = age;
    this.number = number;
    this.Email = Email;
}
//格式化时间的函数
function formatDate(num) {
    return num < 10 ? '0' + num : num
}
Post.prototype.save = function (callback) {
    var date = new Date();
    var now = date.getFullYear() + '-' + formatDate(date.getMonth() + 1) + '-' + formatDate(date.getDate()) + ' ' + formatDate(date.getHours()) + ':' + formatDate(date.getMinutes()) + ':' + formatDate(date.getSeconds());
    //收集数据
    var newContent = {
        uname:this.uname,
        sex:this.sex,
        age:this.age,
        number:this.number,
        Email:this.Email,
        time:now
    }
    //打开数据库
    mongodb.open(function (err,db) {
        if(err){
            return callback(err)
        }
        //读取posts集合
        db.collection('posts',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err)
            }
            //将数据插入到posts集合,并且跳转到首页
            collection.insert(newContent,function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc)
            })
        })
    })
}
Post.get = function (name,callback) {
    //打开数据库
    mongodb.open(function (err,db) {
        if(err){
            return callback(err)
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {}
            if(name){
                query.uname = name
            }
            collection.find(query).sort({
                time:-1
            }).toArray(function (err,docs) {
                mongodb.close();
                if(err){
                    return callback(err)
                }
                callback(null,docs)
            })
        })
    })
}
// 获取一个人的信息
/*Post.getOne = function (uname, number, Email, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                uname: uname,
                nuber: number,
                Email: Email
            }, function (err, doc) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                return callback(null, doc);
            })
        })
    })
}*/
//获取
Post.edit = function (uname,number,Email,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err)
            }
            collection.findOne({
                uname:uname,
                number:number,
                Email:Email
            },function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err)
                }
                callback(null,doc)
            })
        })
    })
}
//修改
Post.update = function (uname,sex,age,number,Email,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err)
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err)
            }
            collection.update({
                uname:uname
            },{
                $set:{
                    sex:sex,
                    age:age,
                    number:number,
                    Email:Email
                }
            },function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err)
                }
                return callback(null,doc)
            })
        })
    })
}
Post.remove = function (uname,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err)
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err)
            }
            collection.remove({
              uname:uname
            },{
                w:1
            },function (err) {
                mongodb.close()
                if(err){
                    return callback(err)
                }
                return callback(null)
            })
        })
    })
}
Post.search = function (keyword,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err)
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err)
            }
            var pattern = new RegExp(keyword,'i')
            collection.find({
                'uname':pattern,
            }, {
                uname: 1,
                sex:1,
                age:1,
                number: 1,
                Email: 1,
                time:1
            }).sort({ time: -1 }).toArray(function (err,docs) {
                mongodb.close()
                if(err){
                    return callback(err)
                }
                return callback(null,docs)
            })
        })
    })
}

module.exports = Post