module.exports = app => {
    const mongoose = app.mongoose
    var shortid = require('shortid');
    var path = require('path');
    var Schema = mongoose.Schema;
    var moment = require('moment')

    var CmsTemplateSchema = new Schema({
        _id: {
            type: String,
            'default': shortid.generate
        },
        createTime: {
            type: Date,
        },
        updateTime: {
            type: Date,
        },
        name: String, // 名称 
        alias: String, // 别名 
        version: String, // 版本号 
        sImg: String, // 缩略图 
        state: {
            type: String,
            default: '0'
        }, // 状态 
        downloadNum: {
            type: Number,
            default: 0
        }, // 下载次数 
        author: String, // 作者 
        filePath: String, // 路径 
        comment: String, // 备注 

    });

    CmsTemplateSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });
    CmsTemplateSchema.set('toObject', {
        getters: true,
        virtuals: true
    });

    CmsTemplateSchema.path('createTime').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });
    CmsTemplateSchema.path('updateTime').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });

    return mongoose.model("CmsTemplate", CmsTemplateSchema, 'cmstemplates');

}