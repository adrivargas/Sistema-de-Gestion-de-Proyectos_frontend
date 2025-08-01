import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Box,
  Chip
} from "@mui/material";

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  project_type: {
    id: number;
    name: string;
    color: string;
  };
  owner_id: number;
  start_date: string;
  end_date: string;
  budget: number;
}

const DetalleProyecto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(() => navigate("/dashboard"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <CircularProgress />;

  if (!project) return <Typography>No se encontró el proyecto</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>{project.name}</Typography>
      <Typography variant="subtitle1" gutterBottom>{project.description}</Typography>
      <Chip label={project.project_type.name} sx={{ backgroundColor: project.project_type.color, color: 'white' }} />
      <Box mt={2}>
        <Typography>Estado: {project.status}</Typography>
        <Typography>Inicio: {project.start_date}</Typography>
        <Typography>Fin: {project.end_date}</Typography>
        <Typography>Presupuesto: ${project.budget}</Typography>
        <Typography>Propietario ID: {project.owner_id}</Typography>
      </Box>

      <Box mt={3} display="flex" gap={2}>
        <Button variant="outlined" onClick={() => navigate("/dashboard")}>
          Volver
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate(`/proyecto/${project.id}/editar`)}>
          Editar
        </Button>
        {/* Aquí luego puedes agregar botón de eliminar */}
      </Box>
    </Container>
  );
};

export default DetalleProyecto;
