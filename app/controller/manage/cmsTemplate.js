const xss = require("xss");
const _ = require('lodash');

const cmsTemplateRule = (ctx) => {
    return {

        name: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("名称")])
        },


        alias: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("别名")])
        },


        version: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("版本号")])
        },


        sImg: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("缩略图")])
        },


        state: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("状态")])
        },


        author: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("作者")])
        },


        filePath: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("路径")])
        },


        comment: {
            type: "string",
            required: true,
            message: ctx.__("validate_error_field", [ctx.__("备注")])
        },


    }
}



let CmsTemplateController = {

    async list(ctx) {

        try {

            let payload = ctx.query;
            let queryObj = {};

            let cmsTemplateList = await ctx.service.cmsTemplate.find(payload, {
                query: queryObj,
            });

            ctx.helper.renderSuccess(ctx, {
                data: cmsTemplateList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async create(ctx) {


        try {

            let fields = ctx.request.body || {};
            const formObj = {

                name: fields.name,
                alias: fields.alias,
                version: fields.version,
                sImg: fields.sImg,
                state: fields.state,
                amount: fields.amount,
                buy_tips: fields.buy_tips,
                discount_amount: fields.discount_amount,
                author: fields.author,
                filePath: fields.filePath,
                comment: fields.comment,
                createTime: new Date()
            }

            if (fields.amount) {
                let amount = parseFloat(fields.amount);
                if (isNaN(amount) || amount <= 0) {
                    throw new Error("金额输入错误.");
                } else {
                    fields.amount = amount.toFixed(2);
                }
            }

            ctx.validate(cmsTemplateRule(ctx), formObj);

            if (fields.version.indexOf(',') >= 0) {
                formObj.version = (fields.version).split(',');
            }
            if (fields.version.indexOf('，') >= 0) {
                formObj.version = (fields.version).split('，');
            }

            await ctx.service.cmsTemplate.create(formObj);

            ctx.helper.renderSuccess(ctx);

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


    async update(ctx) {


        try {

            let fields = ctx.request.body || {};
            const formObj = {
                name: fields.name,
                alias: fields.alias,
                version: fields.version,
                sImg: fields.sImg,
                state: fields.state,
                amount: fields.amount,
                buy_tips: fields.buy_tips,
                discount_amount: fields.discount_amount,
                author: fields.author,
                filePath: fields.filePath,
                comment: fields.comment,
                updateTime: new Date()
            }

            if (fields.amount) {
                let amount = parseFloat(fields.amount);
                if (isNaN(amount) || amount <= 0) {
                    throw new Error("金额输入错误.");
                } else {
                    fields.amount = amount.toFixed(2);
                }
            }

            ctx.validate(cmsTemplateRule(ctx), formObj);

            if (fields.version.indexOf(',') >= 0) {
                formObj.version = (fields.version).split(',');
            }
            if (fields.version.indexOf('，') >= 0) {
                formObj.version = (fields.version).split('，');
            }

            await ctx.service.cmsTemplate.update(ctx, fields._id, formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },


    async removes(ctx) {

        try {
            let targetIds = ctx.query.ids;
            await ctx.service.cmsTemplate.removes(ctx, targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

}

module.exports = CmsTemplateController;