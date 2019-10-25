'use strict'

/**
 * egg-dora-cmstemplate default config
 * @member Config#eggDoraCmsTemplate
 * @property {String} SOME_KEY - some description
 */

const pkgInfo = require('../package.json');
exports.doraCmsTemplate = {
    alias: 'cmsTemplate', // 插件目录，必须为英文
    pkgName: 'egg-dora-cmstemplate', // 插件包名
    enName: 'doraCmsTemplate', // 插件名
    name: '系统模板', // 插件名称
    description: '系统模板', // 插件描述
    isadm: 1, // 是否有后台管理，1：有，0：没有，入口地址:'/ext/devteam/admin/index'
    isindex: 0, // 是否需要前台访问，1：需要，0：不需要,入口地址:'/ext/devteam/index/index'
    version: pkgInfo.version, // 版本号
    iconName: 'icon_service', // 主菜单图标名称
    adminUrl: 'https://cdn.html-js.cn/cms/plugins/static/admin/cmsTemplate/js/app.js',
    adminApi: [{
        url: 'cmsTemplate/getList',
        method: 'get',
        controllerName: 'list',
        details: '获取系统模板列表',
    }, {
        url: 'cmsTemplate/getOne',
        method: 'get',
        controllerName: 'getOne',
        details: '获取单条系统模板信息',
    }, {
        url: 'cmsTemplate/addOne',
        method: 'post',
        controllerName: 'create',
        details: '添加单个系统模板',
    }, {
        url: 'cmsTemplate/updateOne',
        method: 'post',
        controllerName: 'update',
        details: '更新系统模板信息',
    }, {
        url: 'cmsTemplate/delete',
        method: 'get',
        controllerName: 'removes',
        details: '删除系统模板',
    }],
    fontApi: [{
        url: 'cmsTemplate/getList',
        method: 'get',
        controllerName: 'list',
        details: '获取系统模板列表',
    }, {
        url: 'cmsTemplate/getOne',
        method: 'get',
        controllerName: 'getOne',
        details: '获取单条系统模板信息',
    }],

    initData: 'cmstemplates.json', // 初始化数据脚本
    pluginsConfig: ` 
    exports.doraCmsTemplate = {\n
        enable: true,\n        package: 'egg-dora-cmstemplate', 
    };\n
    `, // 插入到 plugins.js 中的配置
    defaultConfig: `
    cmsTemplateRouter:{\n
        match: [ctx => ctx.path.startsWith('/manage/cmsTemplate'), ctx => ctx.path.startsWith('/api/cmsTemplate')],\n
    },\n
    `, // 插入到 config.default.js 中的配置
}