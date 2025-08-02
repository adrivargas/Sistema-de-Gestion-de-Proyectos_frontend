import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

const EditarProyecto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get(`/projects/${id}`)
      .then((res) => setProyecto(res.data))
      .catch(() => setError("No se pudo cargar el proyecto"));
  }, [id]);

 const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
  const { name, value } = e.target;
  if (!name) return;
  setProyecto((prev: any) => ({
    ...prev,
    [name]: value,
  }));
};
  const handleUpdate = async () => {
    try {
      await axios.put(`/projects/${id}`, {
        name: proyecto.name,
        description: proyecto.description,
        status: proyecto.status,
        budget: proyecto.budget,
        start_date: proyecto.start_date,
        end_date: proyecto.end_date,
        project_type_id: proyecto.project_type.id, // asegúrate de enviar solo el id
        owner_id: proyecto.owner_id,
      });

      setSuccess("Proyecto actualizado correctamente");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch {
      setError("Error al actualizar el proyecto");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setProyecto((prev: any) => ({
    ...prev,
    [name]: value,
  }));
};

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setProyecto((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };


  if (error) {
    return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  }

  if (!proyecto) return null;

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Editar Proyecto
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <TextField
          label="Nombre"
          name="name"
          value={proyecto.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción"
          name="description"
          value={proyecto.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Presupuesto"
          name="budget"
          type="number"
          value={proyecto.budget}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="estado-label">Estado</InputLabel>
          <Select
            labelId="estado-label"
            name="status"
            value={proyecto.status}
            label="Estado"
            onChange={handleSelectChange}
          >
            <MenuItem value="en progreso">En progreso</MenuItem>
            <MenuItem value="completado">Completado</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Fecha de inicio"
          name="start_date"
          type="date"
          value={proyecto.start_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha de fin"
          name="end_date"
          type="date"
          value={proyecto.end_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleUpdate}>
            Guardar Cambios
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditarProyecto;
