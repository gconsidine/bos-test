var privateStuff = { 
    deeply: {
        nested: {
            object: {
                value: 'here'
            }
        }
    }
};

function theDeeplyNestedValueIs () {
  return privateStuff.deeply.nested.object.value;
}

function sum (a, b) { 
    return a + b;
}

function diff (a, b) {
  return Math.abs(a - b);
}

module.exports = {
    sum: sum
};
