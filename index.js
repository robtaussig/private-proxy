const privateObject = new WeakMap();
const properties = {};

module.exports = self => {
  privateObject.set(self, properties);
  const proxy = new Proxy(self, {
    get: (obj, key) => {
      return obj[key] ? obj[key] : privateObject.get(obj)[key];
    },
    set: (obj, key, value) => {
      return obj[key] ? obj[key] = value : privateObject.get(obj)[key] ? new Error('You cannot overrwrite a private property') : privateObject.get(obj)[key] = value;
    },
    has: (obj, key) => {
      return !!privateObject.get(obj)[key];
    }
  });

  return proxy;
};