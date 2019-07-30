const glob = require('glob');
const { join, normalize, resolve } = require('path');
const errors = require('./errors');

function url(...uri) {
  return normalize(join(...uri));
}

// eslint-disable-next-line
let _globalFastify;
// eslint-disable-next-line
let _globalPrefix = '';

const paths = [];

function addPath({ ...params }) {
  const { name } = params.controller.constructor;
  const { handler } = params;

  if (!paths[name]) {
    paths[name] = {};
  }

  if (!paths[name][handler]) {
    paths[name][handler] = {};
  }

  Object.assign(paths[name][handler], params);
}

module.exports.Get = path => (controller, handler) => {
  addPath({
    controller,
    handler,
    method: 'GET',
    path,
  });
};

module.exports.Post = path => (controller, handler) => {
  addPath({
    controller,
    handler,
    method: 'POST',
    path,
  });
};

module.exports.Put = path => (controller, handler) => {
  addPath({
    controller,
    handler,
    method: 'PUT',
    path,
  });
};

module.exports.Delete = path => (controller, handler) => {
  addPath({
    controller,
    handler,
    method: 'DELETE',
    path,
  });
};

module.exports.Validate = schema => (controller, handler) => {
  addPath({
    controller,
    handler,
    schema,
  });
};

module.exports.OnRequest = onRequest => (controller, handler) => {
  addPath({
    controller,
    handler,
    onRequest,
  });
};

module.exports.Prefix = prefix => (constructor) => {
  const routes = Object.values(paths[constructor.name]);

  routes.forEach((route) => {
    _globalFastify.route({
      method: route.method,
      url: url('/', _globalPrefix, prefix, route.path),
      schema: route.schema,
      handler: async (request, response) => route.controller[route.handler](request, response),
      onRequest: route.onRequest
        ? async (request, response) => route.onRequest(request, response)
        : undefined,
    });
  });
};

module.exports.registerRoutes = (folder, fastify, prefix) => {
  _globalFastify = fastify;
  _globalPrefix = prefix;

  const routes = glob.sync(`${resolve(folder)}/**/*.js`, {
    ignore: 'spec.js',
  });

  routes.forEach((route) => {
    // eslint-disable-next-line
    require(route);
  });
};

module.exports.errors = errors;
