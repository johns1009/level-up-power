"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = __dirname;
const errors = [];
const notes = [];

function fail(msg) { errors.push(msg); }
function note(msg) { notes.push(msg); }

const required = ["index.html", "styles.css", "script.js", "brand-mark.svg", "logo.png", "documents/LUP-Standard-Terms-and-Conditions-of-Sale-RevA.pdf"];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) fail("Missing required file: " + file);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const js = fs.readFileSync(path.join(root, "script.js"), "utf8");

const requiredIds = ["main", "top", "journey", "approach", "products", "industries", "resources", "contact", "contact-form", "nav-menu", "year"];
for (const id of requiredIds) {
  if (!html.includes('id="' + id + '"')) fail("Missing expected id: " + id);
}

const landmarks = ["<header", "<main", "<footer", "<nav", 'lang="en"', "Skip to content"];
for (const token of landmarks) {
  if (!html.includes(token)) fail("Missing landmark or a11y token: " + token);
}

const hrefs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
for (const href of hrefs) {
  if (/^(https?:|mailto:|#)/i.test(href)) continue;
  const clean = href.split("?")[0].split("#")[0];
  const target = path.join(root, clean);
  if (!fs.existsSync(target)) fail("Broken local asset: " + href);
}

function countChar(str, ch) {
  return (str.match(new RegExp("\\" + ch, "g")) || []).length;
}
if (countChar(css, "{") !== countChar(css, "}")) fail("CSS brace mismatch");
if (countChar(js, "{") !== countChar(js, "}")) fail("JS brace mismatch");

try {
  execFileSync(process.execPath, ["--check", path.join(root, "script.js")], { stdio: "pipe" });
  execFileSync(process.execPath, ["--check", path.join(root, "validate.js")], { stdio: "pipe" });
} catch (err) {
  fail("JavaScript syntax check failed: " + (err.stderr || err.message));
}

if (!html.includes("Grid to Chip") || !html.includes("Level Up Power")) {
  fail("Core branding copy missing");
}

if (html.includes("TODO") || html.includes("FIXME") || html.includes("lorem ipsum")) {
  fail("Placeholder copy still present");
}

note("HTML length: " + html.length);
note("CSS length: " + css.length);
note("JS length: " + js.length);
note("Local assets referenced: " + hrefs.filter((h) => !/^(https?:|mailto:|#)/i.test(h)).join(", "));

if (errors.length) {
  console.error("VALIDATION FAILED");
  errors.forEach((e) => console.error(" - " + e));
  process.exit(1);
}

console.log("VALIDATION PASSED");
notes.forEach((n) => console.log(" - " + n));
