const {
    authToken
} = require('../../utils');
const _ = require('lodash')
var qiniu = require("qiniu");
var url = require("url");

let CmsTemplateController = {

    async _checkUserToken(ctx, app, userToken) {
        if (!userToken) {
            return '';
        } else {
            let checkToken = await authToken.checkToken(userToken, app.config.encrypt_key);
            if (checkToken && typeof checkToken == 'object') {
                targetUser = await ctx.service.singleUser.item(ctx, {
                    query: {
                        _id: checkToken.userId
                    },
                    files: '_id'
                })
                if (!_.isEmpty(targetUser)) {
                    return targetUser;
                } else {
                    return '';
                }
            } else {
                return '';
            }
        }
    },

    async _getQiniuDownloadUrl(app, filePath) {

        return new Promise((resolve, reject) => {

            try {

                let targetKey = url.parse(filePath, true).pathname.substr(1);
                var config = new qiniu.conf.Config();
                config.zone = qiniu.zone.Zone_z0;
                config.useHttpsDomain = true;

                var accessKey = app.config.qiniuConfigs.accessKey;
                var secretKey = app.config.qiniuConfigs.secretKey;
                var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
                var config = new qiniu.conf.Config();
                var bucketManager = new qiniu.rs.BucketManager(mac, config);
                var privateBucketDomain = app.config.qiniuConfigs.downloadDomain;
                var deadline = parseInt(Date.now() / 1000) + app.config.qiniuConfigs.downloadDeadline; // 1小时过期
                var privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, targetKey, deadline);
                resolve(privateDownloadUrl);
            } catch (error) {
                reject(error)
            }

        })
    },

    async list(ctx, app) {

        try {

            let payload = ctx.query;
            let queryObj = {};
            let userToken = payload.singleUserToken;
            let userInfo = await this._checkUserToken(ctx, app, userToken);

            let cmsTemplateList = await ctx.service.cmsTemplate.find(payload, {
                query: queryObj,
                files: {
                    filePath: 0
                }
            });

            // 获取是否已支付状态
            if (!_.isEmpty(cmsTemplateList) && !_.isEmpty(cmsTemplateList.docs) && userInfo) {
                let newTempList = JSON.parse(JSON.stringify(cmsTemplateList.docs));
                for (const tempItem of newTempList) {
                    tempItem.hadPayed = false

                    let targetItem = await ctx.service.alipaySystem.item(ctx, {
                        query: {
                            user: userInfo._id,
                            type: '1',
                            templateModel: tempItem._id,
                            state: true
                        }
                    });
                    if (!_.isEmpty(targetItem)) {
                        tempItem.hadPayed = true
                    }

                }
                cmsTemplateList.docs = newTempList;
            }

            ctx.helper.renderSuccess(ctx, {
                data: cmsTemplateList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async getOne(ctx, app) {

        try {
            let _id = ctx.query.id;
            let authUser = ctx.query.authUser;
            let userToken = ctx.query.singleUserToken;
            let targetUser = {};

            let targetItem = await ctx.service.cmsTemplate.item(ctx, {
                query: {
                    _id: _id
                }
            });

            if (_.isEmpty(targetItem)) {
                throw new Error(res.__('validate_error_params'));
            }

            // 如果是付费模板
            if (authUser == '1' && (targetItem.amount != 0 || targetItem.discount_amount != 0)) {
                if (!userToken) {
                    throw new Error(ctx.__('label_systemnotice_nopower'));
                }
                let checkToken = await authToken.checkToken(userToken, app.config.encrypt_key);
                if (checkToken && typeof checkToken == 'object') {
                    targetUser = await ctx.service.alipaySystem.item(ctx, {
                        query: {
                            user: checkToken.userId
                        },
                        populate: ['templateModel']
                    })

                    if (!_.isEmpty(targetUser) && targetUser.state && !_.isEmpty(targetUser.templateModel) && targetUser.templateModel.filePath) {

                        let currentFileUrl = await this._getQiniuDownloadUrl(app, targetUser.templateModel.filePath);
                        targetItem.filePath = currentFileUrl;

                    } else {
                        throw new Error(ctx.__('label_systemnotice_nopower'));
                    }

                } else {
                    throw new Error(ctx.__('label_systemnotice_nopower'));
                }
            }
            // console.log('----targetItem--', targetItem);
            ctx.helper.renderSuccess(ctx, {
                data: targetItem
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

}

module.exports = CmsTemplateController;