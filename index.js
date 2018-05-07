const privateProps = new WeakMap();
const properties = {};

module.exports = self => {
  privateProps.set(self, properties);
  const proxy = new Proxy(self, {
    get: (obj, key) => {
      return obj[key] ? obj[key] : privateProps.get(obj)[key];
    },
    set: (obj, key, value) => {
      return obj[key] ? obj[key] = value : privateProps.get(obj)[key] ? new Error('You cannot overrwrite a private property') : privateProps.get(obj)[key] = value;
    },
    has: (obj, key) => {
      return !!privateProps.get(obj)[key];
    }
  });

  return proxy;
};