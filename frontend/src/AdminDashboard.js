import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Drawer,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function AdminDashboard({ token }) {
  const [products, setProducts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({});
  const headers = { Authorization: "Bearer " + token };

  // Load products from backend
  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/products", { headers });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  // Save or update product
  const saveProduct = async () => {
    try {
      if (form._id) {
        await axios.put(
          `http://localhost:5001/products/${form._id}`,
          form,
          { headers }
        );
      } else {
        await axios.post("http://localhost:5001/products", form, { headers });
      }
      setDrawerOpen(false);
      setForm({});
      loadProducts();
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/products/${id}`, { headers });
      loadProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    window.location.reload();          // refresh to go back to login page
  };

  // Load products on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <>
      {/* Top AppBar */}
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Admin Dashboard</Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box p={4}>
        <Typography variant="h4" mb={3}>
          Product Management
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            setForm({});
            setDrawerOpen(true);
          }}
          sx={{ mb: 2 }}
        >
          + Add Product
        </Button>

        {/* Product Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ background: "#f0f0f0" }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>${p.price}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>
                    <img
                      src={p.imageUrl}
                      alt=""
                      width="60"
                      style={{ borderRadius: 6 }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setForm(p);
                        setDrawerOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => deleteProduct(p._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Drawer for Add/Edit Product Form */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box p={3} width={350}>
            <Typography variant="h6">
              {form._id ? "Edit Product" : "Add Product"}
            </Typography>

            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Price"
              fullWidth
              margin="normal"
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <TextField
              label="Category"
              fullWidth
              margin="normal"
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <TextField
              label="Image URL"
              fullWidth
              margin="normal"
              value={form.imageUrl || ""}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={saveProduct}
            >
              Save
            </Button>
          </Box>
        </Drawer>
      </Box>
    </>
  );
}
