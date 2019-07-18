import glob from 'glob';
import { join, normalize, resolve } from 'path';
import * as errors from './errors';

function url(...uri) {
  return normalize(join(...uri));
}

let _globalFastify, _globalPrefix = '';

const paths = [];

function addPath({ ...params }) {
  const { name } = params.controller.constructor;

  try {
    paths[name][params.handler] = params;
  } catch (e) {
    paths[name] = {
      [params.handler]: params,
    };
  }
}

export function Get(path) {
  return (controller, handler) => {
    addPath({
      controller,
      handler,
      method: 'GET',
      path,
    });
  };
}

export function Post(path) {
  return (controller, handler) => {
    addPath({
      controller,
      handler,
      method: 'POST',
      path,
    });
  };
}

export function Put(path) {
  return (controller, handler) => {
    addPath({
      controller,
      handler,
      method: 'PUT',
      path,
    });
  };
}

export function Delete(path) {
  return (controller, handler) => {
    addPath({
      controller,
      handler,
      method: 'DELETE',
      path,
    });
  };
}

export function Validate(schema) {
  return (controller, handler) => {
    addPath({
      controller,
      handler,
      schema,
    });
  };
}

export function Prefix(prefix) {
  return (constructor) => {
    const routes = Object.values(paths[constructor.name]);

    routes.forEach((route) => {
      _globalFastify.route({
        method: route.method,
        url: url('/', _globalPrefix, prefix, route.path),
        schema: route.schema,
        handler: async (request, response) => route.controller[route.handler](request, response),
      });
    });
  };
}

export function registerRoutes(folder, fastify, prefix) {
  _globalFastify = fastify;
  _globalPrefix = prefix;

  const routes = glob.sync(`${resolve(folder)}/**/*.js`, {
    ignore: 'spec.js',
  });

  routes.forEach((route) => {
    // eslint-disable-next-line
    require(route);
  });
}

export { errors };
