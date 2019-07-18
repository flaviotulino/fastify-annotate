function createError(code, message) {
  const error = new Error();
  error.message = message || 'No message was specified for this error';
  error.status = code;
  return error;
}

export function ErrorBadRequest(message) {
  return createError(400, message);
}

export function ErrorUnauthorised(message) {
  return createError(401, message);
}

export function ErrorForbidden(message) {
  return createError(403, message);
}

export function ErrorNotFound(message) {
  return createError(404, message);
}
