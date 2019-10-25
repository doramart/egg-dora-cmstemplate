const _ = require('lodash');
const cmsTemplateAdminController = require('../controller/manage/cmsTemplate')
const cmsTemplateApiController = require('../controller/api/cmsTemplate')

module.exports = (options, app) => {

    return async function cmsTemplateRouter(ctx, next) {

        let pluginConfig = app.config.doraCmsTemplate;
        await app.initPluginRouter(ctx, pluginConfig, cmsTemplateAdminController, cmsTemplateApiController);
        await next();

    }

}