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
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 IMPORTANTE

interface ProjectType {
  id: number;
  name: string;
}

const CrearProyecto = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 👈 Accede al usuario actual

  const [types, setTypes] = useState<ProjectType[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    project_type_id: "",
    status: "pendiente",
    start_date: "",
    end_date: "",
    budget: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get("/project-types")
      .then(res => setTypes(res.data))
      .catch(() => setError("No se pudieron cargar los tipos de proyecto"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validar que el usuario esté disponible
  if (!user || !user.id) {
    setError("Usuario no autenticado");
    setSuccess(false);
    return;
  }

  try {
    await axios.post("/projects", {
      ...form,
      budget: parseFloat(form.budget),
      project_type_id: parseInt(form.project_type_id),
      owner_id: user.id, // 👈 Este campo es obligatorio
    });

    setSuccess(true);
    setError("");

    // Redirige al dashboard luego de 2 segundos
    setTimeout(() => navigate("/dashboard"), 2000);
  } catch (err) {
    console.error("Error al crear proyecto:", err);
    setError("Error al crear el proyecto");
    setSuccess(false);
  }
};



  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Crear nuevo proyecto
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>¡Proyecto creado correctamente!</Alert>}


        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nombre del proyecto"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Descripción"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            required
          />
          <TextField
            label="Tipo de proyecto"
            name="project_type_id"
            select
            value={form.project_type_id}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            {types.map(type => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Estado"
            name="status"
            select
            value={form.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="en progreso">En progreso</MenuItem>
            <MenuItem value="completado">Completado</MenuItem>
            <MenuItem value="active">Activo (active)</MenuItem> {/* según tu backend */}
          </TextField>
          <TextField
            label="Fecha de inicio"
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Fecha de fin"
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Presupuesto"
            name="budget"
            type="number"
            value={form.budget}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Crear Proyecto
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CrearProyecto;
