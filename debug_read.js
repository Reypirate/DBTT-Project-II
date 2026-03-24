import fs from "fs";

try {
  const content = fs.readFileSync("Subscriber.md");
  console.log("File size:", content.length);
  console.log("Hex content:", content.toString("hex").slice(0, 100));
  console.log("UTF-8 content:", content.toString("utf8"));
} catch (err) {
  console.error("Error reading file:", err);
}
