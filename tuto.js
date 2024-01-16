import fs from "fs";
import parseMD from "parse-md";
import { marked } from "marked";

const markdown = fs.readFileSync("./tuto.md", "utf-8");
const parsedMarkdown = parseMD(markdown);
const html = marked(parsedMarkdown.content);

const tuto = document.getElementById("tuto");
tuto.innerHTML = html;
