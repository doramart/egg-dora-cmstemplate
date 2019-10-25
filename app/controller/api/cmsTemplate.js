

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

}

module.exports = CmsTemplateController;