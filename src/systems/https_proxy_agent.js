// Not using ES6 in this file to make it easier for testing with 'node https_proxy_agent.js'
const HttpsProxyAgent = require("https-proxy-agent");
const url = require("url");
const fs = require("fs");
let proxyOpts;

if (process.env.OS_ENV === "mac") {
  proxyOpts = url.parse("http://proxy-amer.nslb.ad.moodys.net:80");
} else {
  proxyOpts = url.parse("http://wwwproxy.nslb.ad.moodys.net:80");
  proxyOpts.ca = [
    fs.readFileSync("/etc/ssl/certs/PTC-WBRTCERT702.pem"),
    fs.readFileSync("/etc/ssl/certs/PTC-WBISCERT702.pem"),
    fs.readFileSync("/etc/ssl/certs/PTC-WCISCERT701.pem"),
    fs.readFileSync("/etc/ssl/certs/PTC-WCRTCERT701.pem")
  ];
}

proxyOpts.rejectUnauthorized = false;
exports.agent = new HttpsProxyAgent(proxyOpts);
