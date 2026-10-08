const Supplier = require("../models/Supplier");

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching suppliers", error: err.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { name, contactPerson, phone, email, address, categoriesSupplied } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ message: "Supplier name and phone are required" });
    }
    const supplier = new Supplier({ name, contactPerson, phone, email, address, categoriesSupplied });
    await supplier.save();
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ message: "Error creating supplier", error: err.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Supplier.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Supplier not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating supplier", error: err.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Supplier.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Supplier not found" });
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting supplier", error: err.message });
  }
};

module.exports = { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier };
