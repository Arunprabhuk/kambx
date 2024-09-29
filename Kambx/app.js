const http = require("http");
const path = require("path");
const fsPromise = require("fs/promises");
const mongoClient = require("mongodb").MongoClient;
const getName = require("./router");
const dontenv = require("dotenv");
const connection = require("./connection");
const jwt = require("jsonwebtoken");
const url = require("url");
const queryString = require("querystring");

dontenv.config();

const PORT = process.env.PORT || 5000;

const setCookies = (res, name, value, options = {}) => {
  const defaultOptions = [
    `httpOnly`,
    `Max-Age=${options.maxAge || 3600}`,
    `SameSite=Strict`,
  ];
  if (options.secure) return defaultOptions.push("Secure");
  res.setHeader("Set-Cookie", `${name}=${value};${defaultOptions.join("; ")}`);
};

const parseCookie = (req) => {
  const cookieParse = req.headers?.cookie || "";
  console.log(req);

  return Object.fromEntries(
    cookieParse.split("; ").map((cookie) => cookie.split("="))
  );
};

const protectController = async (req, res) => {
  try {
    parseCookie(req);
  } catch (error) {}
};

const serveFile = async (res) => {
  try {
    const file = await fsPromise.readFile(
      path.join(__dirname, "ui", "login.html")
    );
    res.end(file);
  } catch (error) {}
};
const handleLogin = async (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const data = queryString.parse(body);
    const token = jwt.sign(
      {
        username: data?.username,
        password: data?.password,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1hr",
      }
    );

    setCookies(res, "token", token, { maxAge: 3600, secure: true });
    await res.writeHead(300, { Location: "/", "Content-Type": "text/plain" });
    res.end("Data received");
  });
};

connection();

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, false);

  if (parsedUrl.pathname === "/" && req.method === "GET") {
    serveFile(res);
  } else if (parsedUrl.pathname === "/login" && req.method === "POST") {
    handleLogin(req, res);
  } else if (parsedUrl.pathname === "/protect" && req.method === "GET") {
    protectController(req, res);
  } else {
    res.end("404 ");
  }
});

server.listen(PORT, () => {
  console.log(`Server connected : ${PORT}`);
});
