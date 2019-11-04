const {
    authToken
} = require('../../utils');
const _ = require('lodash')
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

    async getOne(ctx) {

        try {
            let _id = ctx.query.id;

            let targetItem = await ctx.service.cmsTemplate.item(ctx, {
                query: {
                    _id: _id
                }
            });

            ctx.helper.renderSuccess(ctx, {
                data: targetItem
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

    async cdnauth(ctx, app) {

        try {
            let fields = ctx.request.body;
            let userToken = fields.singleUserToken;
            let targetUser = {};
            // console.log('--fields--', fields);
            if (!userToken) {
                throw new Error(ctx.__('validate_error_params'));
            }
            let checkToken = await authToken.checkToken(userToken, app.config.encrypt_key);
            if (checkToken && typeof checkToken == 'object') {
                targetUser = await ctx.service.alipaySystem.item(ctx, {
                    query: {
                        user: checkToken.userId
                    }
                })
            } else {
                throw new Error(ctx.__('validate_error_params'));
            }

            if (!_.isEmpty(targetUser)) {
                if (targetUser.state) {
                    ctx.helper.renderSuccess(ctx, {
                        data: targetUser.state
                    });
                } else {
                    ctx.helper.renderFail(ctx, {
                        message: 'no auth'
                    });
                }
            } else {
                throw new Error(ctx.__('validate_error_params'));
            }

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },

}

module.exports = CmsTemplateController;