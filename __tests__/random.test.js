const checkIfEqual = require("../lib/random.js");

test("Check if 10 is equal to 10", () => {
    expect(checkIfEqual(10, 10)).toBe(true);
});