import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  Chip,
  Button
} from '@mui/material';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

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
}

interface ProjectType {
  id: number;
  name: string;
  color: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, typesRes] = await Promise.all([
          axios.get('/projects'),
          axios.get('/project-types')
        ]);
        setProjects(projectsRes.data);
        setProjectTypes(typesRes.data);
      } catch (err) {
        console.error('Error cargando los datos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = projects.filter((p) =>
    (!typeFilter || p.project_type?.id === parseInt(typeFilter)) &&
    (!statusFilter || p.status === statusFilter) &&
    (!ownerFilter || p.owner_id === parseInt(ownerFilter))
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Proyectos
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Filtrar por tipo"
          select
          fullWidth
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          {projectTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Filtrar por estado"
          select
          fullWidth
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="en progreso">En progreso</MenuItem>
          <MenuItem value="completado">Completado</MenuItem>
          <MenuItem value="pendiente">Pendiente</MenuItem>
        </TextField>

        <TextField
          label="Filtrar por propietario (ID)"
          type="number"
          fullWidth
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
        />
      </Box>
      <Button variant="contained" onClick={() => navigate("/crear")}>
        Crear nuevo proyecto
      </Button>


      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }}
          gap={3}
        >
          {filtered.map((project) => (
            <Card key={project.id} onClick={() => navigate(`/proyecto/${project.id}`)} sx={{ cursor: 'pointer' }}>
              <CardHeader
                title={project.name}
                subheader={`Estado: ${project.status}`}
              />
              <CardContent>
                <Typography variant="body2" gutterBottom>
                  {project.description}
                </Typography>
                <Chip
                  label={project.project_type?.name}
                  sx={{
                    backgroundColor: project.project_type?.color || 'gray',
                    color: 'white',
                    mt: 1,
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
