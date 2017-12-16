/**
 * Created by My love on 2017/12/14.
 */
var setting = require('../setting');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server
//数据库的实例对象
module.exports = new Db(setting.db,new Server(setting.host,setting.port),{safe:true})