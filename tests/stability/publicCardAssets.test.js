const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const names = [
  ...Array.from({ length: 16 }, (_, index) => `Num${index + 1}.jpg`),
  "green1.jpg",
  "green2.jpg",
];

test("legacy public card fronts and backs are published unchanged at /static", () => {
  for (const name of names) {
    const original = readFileSync(path.join(root, "static", name));
    const published = readFileSync(path.join(root, "public/static", name));
    assert.deepEqual(published, original, `${name} must retain its original bytes`);
    assert.equal(published.readUInt16BE(0), 0xffd8, `${name} must be JPEG`);
  }
});
