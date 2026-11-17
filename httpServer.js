import http from "http";
import fs from "fs";

const PORT = 3000;
const vehicles = [
  { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
  { id: 2, vehicleName: "Honda City", vehicleNumber: "UP14CD5678", type: "Sedan", price: 1200000 },
  { id: 3, vehicleName: "Tata Nexon", vehicleNumber: "DL3CAB9012", type: "SUV", price: 1100000 }
];
const required = ["id", "vehicleName", "vehicleNumber", "type", "price"];

const send = (res, code, type, body) => {
  res.writeHead(code, { "Content-Type": type });
  res.end(body);
};
const sendJson = (res, code, data) => send(res, code, "application/json", JSON.stringify(data, null, 2));

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "GET" && url === "/") {
    send(res, 200, "text/html", "<h1>Welcome to Vehicle Management</h1><p>Routes: /vehicles, /about, /info</p>");
  } else if (method === "GET" && url === "/vehicles") {
    sendJson(res, 200, vehicles);
  } else if (method === "GET" && url === "/about") {
    send(res, 200, "text/plain", "Vehicle Management App built with Node.js HTTP module.");
  } else if (method === "GET" && url === "/info") {
    fs.readFile("public/info.html", (err, data) => {
      if (err) return send(res, 500, "text/plain", "500 - Unable to read info.html");
      send(res, 200, "text/html", data);
    });
  } else if (method === "POST" && url === "/add-vehicle") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      let vehicle;
      try {
        vehicle = JSON.parse(body);
      } catch {
        return sendJson(res, 400, { error: "Invalid JSON" });
      }
      const missing = required.filter((f) => vehicle?.[f] === undefined || vehicle[f] === "");
      if (missing.length) return sendJson(res, 400, { error: "Missing fields", missing });
      vehicles.push(vehicle);
      sendJson(res, 201, { message: "Vehicle added successfully", vehicle });
    });
  } else {
    sendJson(res, 404, { error: "404 - Route not found" });
  }
});

server.listen(PORT, () => console.log(`HTTP Server running at http://localhost:${PORT}`));