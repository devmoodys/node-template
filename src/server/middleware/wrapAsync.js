export default function wrapAsync(fn) {
  return function(request, response, next) {
    Promise.resolve(fn(request, response, next)).catch(next);
  };
}
