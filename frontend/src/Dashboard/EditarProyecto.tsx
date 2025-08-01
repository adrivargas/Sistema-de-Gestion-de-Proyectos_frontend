import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Box,
  Alert
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

interface ProjectType {
  id: number;
  name: string;
}

const EditarProyecto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [types, setTypes] = useState<ProjectType[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    project_type_id: "",
    status: "pendiente",
    start_date: "",
    end_date: "",
    budget: "",
    owner_id: "" 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios.get("/project-types")
      .then(res => setTypes(res.data))
      .catch(() => setError("Error al cargar tipos de proyecto"));

    axios.get(`/projects/${id}`)
      .then(res => {
        const p = res.data;
        setForm({
          name: p.name,
          description: p.description,
          project_type_id: p.project_type.id.toString(),
          status: p.status,
          start_date: p.start_date,
          end_date: p.end_date,
          budget: p.budget.toString(),
          owner_id: p.owner_id.toString()
        });
      })
      .catch(() => setError("No se pudo cargar el proyecto"));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/projects/${id}`, {
        ...form,
        budget: parseFloat(form.budget),
        project_type_id: parseInt(form.project_type_id)
      });
      setSuccess("Proyecto actualizado correctamente");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch {
      setError("Error al actualizar el proyecto");
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={4} sx={{ p: 5, mt: 6, backgroundColor: "#fefefe" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Editar Proyecto
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
          <TextField
            label="Nombre del Proyecto"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Descripción"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            required
          />
          <TextField
            label="Tipo de proyecto"
            name="project_type_id"
            select
            value={form.project_type_id}
            onChange={handleChange}
            fullWidth
            required
          >
            {types.map((type) => (
              <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Estado"
            name="status"
            select
            value={form.status}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="en progreso">En Progreso</MenuItem>
            <MenuItem value="completado">Completado</MenuItem>
          </TextField>
          <Box display="flex" gap={2}>
            <TextField
              label="Fecha inicio"
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fecha fin"
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <TextField
            label="Presupuesto"
            name="budget"
            type="number"
            value={form.budget}
            onChange={handleChange}
            fullWidth
            required
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => navigate("/dashboard")}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Guardar Cambios
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditarProyecto;
