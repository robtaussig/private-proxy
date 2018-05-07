const p = require('./index.js');
const assert = require('assert');
    
describe('PrivateProps', () => {
  it('does not affect properties that were defined before conversion', () => {
    const myObj = {};
    myObj.name = 'Robert';
    const privateObj = p(myObj);
    
    assert(privateObj.name === 'Robert', 'Public property is accessible directly');
    assert(Object.keys(privateObj).find(key => key === 'name'), 'Public properties are enumerable');
    
    privateObj.name = 'Joey';
    assert(privateObj.name === 'Joey', 'Public properties can be set to new values');
  });

  it('locks an object upon conversion, so that all keys defined thereafter are considered private', () => {
    const privateObj = p({});
    privateObj.name = 'Rob';
    privateObj.name = 'Joey';

    assert(privateObj.name === 'Rob', 'Private properties are immutable once defined');
    assert(Object.keys(privateObj).length === 0, 'Private properties are not enumerable');
  });

  it('supports custom class objects, without modifying their prototype', () => {
    class Animal {
      constructor(name) {
        this.name = name;
      }
    }
    const privateAnimal = p(new Animal('Fido'));

    assert(privateAnimal instanceof Animal, 'Class instance is unchanged');
    assert(privateAnimal.name === 'Fido', 'Class attributes are unaffected');

    privateAnimal.name = 'John';
    assert(privateAnimal.name === 'John', 'Class attributes are mutable');

    privateAnimal.age = 25;
    assert(privateAnimal.age === 25, 'Class properties can be set if not already defined');
    
    privateAnimal.age = 30;
    assert(privateAnimal.age !== 30, 'Private properties are immutable once set');
  });

  it('supports objects with both private and public properties, only exposing public properties when enumerating', () => {
    const myObj = {
      name: 'Rob'
    };
    const privateObj = p(myObj);
    privateObj.age = 25;
    assert(Object.keys(privateObj).length === 1 && Object.keys(privateObj)[0] === 'name', 'Only public properties are enumerable');
  });
})

// console.log(myObj);
// let myObj2 = {};
// console.log(myObj2);
// myObj.name = 'Rob';
// console.log(myObj);
// myObj2.name = 'Rob';
// console.log(myObj2);
// myObj2 = privateProps(myObj2);
// console.log(myObj2, myObj2.name);
// myObj.name = 'Joey';
// console.log(myObj, myObj.name);
// myObj2.name = 'Joey';
// console.log(myObj2.name);
// console.log(myObj.name);