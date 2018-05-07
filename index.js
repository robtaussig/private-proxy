const privateProperties = new WeakMap();
const properties = {};

module.exports = self => {
  privateProperties.set(self, properties);
  const proxy = new Proxy(self, {
    get: (obj, key) => {
      return obj[key] ? obj[key] : privateProperties.get(obj)[key];
    },
    set: (obj, key, value) => {
      return obj[key] ? obj[key] = value : privateProperties.get(obj)[key] ? new Error('You cannot overrwrite a private property') : privateProperties.get(obj)[key] = value;
    },
    has: (obj, key) => {
      return !!privateProperties.get(obj)[key];
    }
  });

  return proxy;
};