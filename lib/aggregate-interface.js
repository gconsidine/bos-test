function buildExports() {
    var api = {};

    delete global.services;
    delete global.serviceLoader;

    api = expose(api, require('./rewire'));
    api = expose(api, require('./test-tools'));
    api = expose(api, require('./inject'));

    api.reset = buildExports;

    return api;
}

function expose(api, add) {
    for (var property in add) {
        if (add.hasOwnProperty(property)) {
            if (property === '_') {
                if (!add.expose) {
                  add.expose = {};
                }

                for (var internal in add._) {
                    api.expose[internal] = add._[internal];
                }
            } else {
                api[property] = add[property];            
            }
        }
    }

    return api;
}

module.exports = buildExports();
