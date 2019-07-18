function createError(code, message) {
  const error = new Error();
  error.message = message || 'No message was specified for this error';
  error.status = code;
  return error;
}

module.exports.ErrorBadRequest = message => createError(400, message);

module.exports.ErrorUnauthorised = message => createError(401, message);

module.exports.ErrorForbidden = message => createError(403, message);

module.exports.ErrorNotFound = message => createError(404, message);
