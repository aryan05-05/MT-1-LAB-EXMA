import express from "express";

const app = express();
const PORT = 4000;
app.use(express.json());

let vehicles = [
  { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
  { id: 2, vehicleName: "Honda City", vehicleNumber: "UP14CD5678", type: "Sedan", price: 1200000 },
  { id: 3, vehicleName: "Tata Nexon", vehicleNumber: "DL3CAB9012", type: "SUV", price: 1100000 }
];

const validate = (b, needId) => {
  const fields = needId ? ["id", "vehicleName", "vehicleNumber", "type", "price"] : ["vehicleName", "vehicleNumber", "type", "price"];
  const missing = fields.filter((f) => b[f] === undefined || b[f] === "");
  if (missing.length) return `Missing fields: ${missing.join(", ")}`;
  if (typeof b.price !== "number" || b.price <= 0) return "Price must be a positive number";
  return null;
};

app.get("/vehicles", (req, res) => res.json(vehicles));

app.get("/vehicles/:id", (req, res) => {
  const vehicle = vehicles.find((v) => v.id === Number(req.params.id));
  if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
  res.json(vehicle);
});

app.post("/vehicles", (req, res) => {
  const b = req.body || {};
  const error = validate(b, true);
  if (error) return res.status(400).json({ error });
  if (vehicles.some((v) => v.id === b.id)) return res.status(400).json({ error: "ID already exists" });
  const vehicle = { id: b.id, vehicleName: b.vehicleName, vehicleNumber: b.vehicleNumber, type: b.type, price: b.price };
  vehicles.push(vehicle);
  res.status(201).json({ message: "Vehicle added successfully", vehicle });
});

app.put("/vehicles/:id", (req, res) => {
  const index = vehicles.findIndex((v) => v.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Vehicle not found" });
  const b = req.body || {};
  const error = validate(b, false);
  if (error) return res.status(400).json({ error });
  vehicles[index] = { id: vehicles[index].id, vehicleName: b.vehicleName, vehicleNumber: b.vehicleNumber, type: b.type, price: b.price };
  res.json({ message: "Vehicle updated successfully", vehicle: vehicles[index] });
});

app.delete("/vehicles/:id", (req, res) => {
  const index = vehicles.findIndex((v) => v.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Vehicle not found" });
  const [deleted] = vehicles.splice(index, 1);
  res.json({ message: "Vehicle deleted successfully", vehicle: deleted });
});

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => res.status(400).json({ error: "Invalid request / JSON" }));

app.listen(PORT, () => console.log(`Express Server running at http://localhost:${PORT}`));