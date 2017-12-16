/**
 * Created by My love on 2017/12/15.
 */
//连接数据库实例
var mongodb = require('./db')

//创建一个构造函数,命名为user,里面有username,password,email
//分别存储 用户名,密码,邮箱
function User(user) {
        this.username = user.username;
        this.password = user.password;
        this.email = user.email
}
User.prototype.save = function (callback) {
    //收集即将存入数据库中的数据
    var user = {
        username:this.username,
        password:this.password,
        email:this.email
    }
    //打开数据库
    mongodb.open(function (err,db) {
        //如果打开数据库发生错误,将错误结果返回
        if(err){
            return callback(err)
        }

        //读取user集合
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            //将数据插入到users集合中
            collection.insert(user,{safe:true},function (err,user) {
                mongodb.close();
                if(err){
                    return callback(err)
                }
                return callback(null,user)
            })
        })
    })
}
User.get = function (username,callback) {
    //1打开数据库
    mongodb.open(function (err,db) {
        if(err){
            return callback(err)
        }
        //读取user集合
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err)
            }
            //查询出name为 指定用户名的用户信息,将结果返回
            collection.findOne({username:username},function (err,user) {
                mongodb.close();//关闭数据库

                if(err){
                    return callback(err)
                }
                return callback(null,user)
            })
        })
    })
}
module.exports = User