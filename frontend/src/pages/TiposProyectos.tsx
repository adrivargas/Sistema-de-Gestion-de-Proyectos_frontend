import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Button,
  Container,
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Box,
  Alert,
} from "@mui/material";
import { Edit, Delete, Logout } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

// Tipos
interface ProjectType {
  id: number;
  name: string;
  color: string;
}
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}
interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  owner_id: number;
  project_type: {
    name: string;
    color: string;
  };
}

const TiposProyecto = () => {
  const { logout } = useAuth();
  const [tab, setTab] = useState(0);

  // Tipos de proyecto
  const [tipos, setTipos] = useState<ProjectType[]>([]);
  const [form, setForm] = useState({ name: "", color: "" });
  const [editId, setEditId] = useState<number | null>(null);

  // Usuarios
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Proyectos
  const [projects, setProjects] = useState<Project[]>([]);

  const [message, setMessage] = useState("");

  // Fetch
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
  try {
    const token = localStorage.getItem("token"); // o desde tu context
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [t, u, p] = await Promise.all([
      axios.get("/project-types", { headers }),
      axios.get("/users", { headers }),
      axios.get("/projects", { headers }), // <-- Aquí estaba el problema
    ]);
    setTipos(t.data);
    setUsers(u.data);
    setProjects(p.data);
  } catch (err) {
    console.error("Error al traer datos:", err);
  }
};


  // Tipo Proyecto
  const handleTipoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/project-types/${editId}`, form);
        setMessage("Tipo actualizado");
      } else {
        await axios.post("/project-types", form);
        setMessage("Tipo creado");
      }
      setForm({ name: "", color: "" });
      setEditId(null);
      fetchAll();
    } catch {
      setMessage("Error al guardar tipo");
    }
  };

  const handleTipoEdit = (tipo: ProjectType) => {
    setForm({ name: tipo.name, color: tipo.color });
    setEditId(tipo.id);
  };

  const handleTipoDelete = async (id: number) => {
    await axios.delete(`/project-types/${id}`);
    fetchAll();
  };

  // Usuarios
  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleDeleteUser = async (id: number) => {
    await axios.delete(`/users/${id}`);
    fetchAll();
  };

  const handleChangeUserField = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (!editingUser) return;
    setEditingUser({ ...editingUser, [name as string]: value });
  };

  const handleUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      await axios.put(`/users/${editingUser.id}`, editingUser);
      setEditingUser(null);
      fetchAll();
    }
  };

  return (
    <>
      {/* Barra Superior */}
      <AppBar position="static" sx={{ backgroundColor: "#1e293b" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Panel de Administración</Typography>
          <Button color="inherit" startIcon={<Logout />} onClick={logout}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 5 }}>
        {/* Tabs de navegación */}
        <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} textColor="primary" indicatorColor="primary">
          <Tab label="Tipos de Proyecto" />
          <Tab label="Usuarios" />
          <Tab label="Proyectos" />
        </Tabs>

        {/* TAB 0: Tipos de Proyecto */}
        {tab === 0 && (
          <>
            <Typography variant="h5" mt={3}>Tipos de Proyecto</Typography>
            {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
            <Paper sx={{ p: 3, mb: 4, mt: 2 }}>
              <form onSubmit={handleTipoSubmit}>
                <TextField
                  label="Nombre"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  fullWidth sx={{ mb: 2 }}
                  required
                />
                <TextField
                  label="Color"
                  name="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  fullWidth sx={{ mb: 2 }}
                  required
                />
                <Button type="submit" variant="contained">
                  {editId ? "Actualizar" : "Crear"}
                </Button>
              </form>
            </Paper>

            <Typography variant="h6">Lista de Tipos</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tipos.map((tipo) => (
                  <TableRow key={tipo.id}>
                    <TableCell>{tipo.name}</TableCell>
                    <TableCell>
                      <Box sx={{ width: 20, height: 20, backgroundColor: tipo.color, borderRadius: 1 }} />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleTipoEdit(tipo)}><Edit /></IconButton>
                      <IconButton onClick={() => handleTipoDelete(tipo.id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {/* TAB 1: Usuarios */}
        {tab === 1 && (
          <>
            <Typography variant="h5" mt={3}>Usuarios</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditUser(user)}><Edit /></IconButton>
                      <IconButton onClick={() => handleDeleteUser(user.id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Formulario de edición de usuario */}
            {editingUser && (
            <Paper sx={{ mt: 4, p: 3 }}>
                <Typography variant="h6">Editar Usuario</Typography>
                <form onSubmit={handleUserUpdate}>
                <TextField
                    id="edit-username"
                    label="Nombre"
                    name="username"
                    value={editingUser.username}
                    onChange={handleChangeUserField}
                    fullWidth sx={{ mb: 2 }}
                    required
                />
                <TextField
                    id="edit-email"
                    label="Correo"
                    name="email"
                    value={editingUser.email}
                    onChange={handleChangeUserField}
                    fullWidth sx={{ mb: 2 }}
                    required
                />
                <Select
                    id="edit-role"
                    name="role"
                    value={editingUser.role}
                    fullWidth sx={{ mb: 2 }}
                    required
                >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </Select>
                <Button type="submit" variant="contained">Actualizar</Button>
                </form>
            </Paper>
            )}

          </>
        )}

        {/* TAB 2: Proyectos */}
       {tab === 2 && (
        <>
          <Typography variant="h6" gutterBottom>Lista de Proyectos</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Tipo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{project.project_type?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      </Container>
    </>
  );
};

export default TiposProyecto;
