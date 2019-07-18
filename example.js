import { registerRoutes } from '.';

const fastify = require('fastify')();

registerRoutes('./routes', fastify);

fastify.listen(3000);
