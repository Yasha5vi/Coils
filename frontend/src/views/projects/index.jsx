import { useState, useEffect } from "react";
import {
  Button,
  OutlinedInput,
  InputLabel,
  FormControl,
  IconButton,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MuiTypography from "@mui/material/Typography";
import MainCard from "ui-component/cards/MainCard";
import SubCard from "ui-component/cards/SubCard";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useUserProfile } from "../../contexts/UserProfileContext";
import { useNotification } from "../../contexts/NotificationContext";
import api from "../../api/axios";

export default function Projects() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { profile, setProjects } = useUserProfile();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(false);
  const [projectsLocal, setProjectsLocal] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    title: "",
    from: null,
    to: null,
    description: "",
    githubUrl: "",
    techStack: "",
  });

  const [title, setTitle] = useState("");
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [techStack, setTechStack] = useState("");

  useEffect(() => {
    if (profile?.projects) {
      const arr = profile.projects.map((item) => ({
        ...item,
        from: item.fromStr
          ? new Date(item.fromStr + "T00:00:00")
          : item.from
          ? new Date(item.from)
          : null,
        to: item.toStr
          ? new Date(item.toStr + "T00:00:00")
          : item.to
          ? new Date(item.to)
          : null,
      }));
      setProjectsLocal(arr);
    }
  }, [profile]);

  // 🔹 Add project
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !from || !to || !description || !githubUrl || !techStack) {
      showNotification("error", "Please fill all fields!");
      return;
    } 

    // const fromObj = new Date(from);
    // const toObj = new Date(to);

    const newProject = {
      id: Date.now(),
      title,
      from,
      to,
      description,
      githubUrl,
      techStack,
    };

    // console.log(newProject)

    const updatedProjects = [...projectsLocal, newProject].map((p) => ({
      ...p,
      fromStr: p.from
        ? `${p.from.getFullYear()}-${String(p.from.getMonth() + 1).padStart(2, "0")}-${String(p.from.getDate()).padStart(2, "0")}`
        : null,
      toStr: p.to
        ? `${p.to.getFullYear()}-${String(p.to.getMonth() + 1).padStart(2, "0")}-${String(p.to.getDate()).padStart(2, "0")}`
        : null,
    }));

    if (loading) return;

    try {
      setLoading(true);
      showNotification("loading", "Adding Project...");

      const res = await api.post("/projects/update", {
        ...profile,
        projects: updatedProjects,
      });

      const result = res.data;
      const arr = Array.isArray(result)
        ? result.map((item) => ({
            id: item.id,
            title: item.title,
            from: item.fromStr ? new Date(item.fromStr + "T00:00:00") : null,
            to: item.toStr ? new Date(item.toStr + "T00:00:00") : null,
            description: item.description,
            githubUrl: item.githubUrl,
            techStack: item.techStack,
          }))
        : [];

      setProjects(arr);
      setProjectsLocal(arr);
      localStorage.setItem("profile", JSON.stringify({ ...profile, projects: arr }));
      showNotification("success", "Project Added");
    } catch (err) {
      showNotification("error", "Failed to add Project");
      console.error("Failed to add project", err);
    } finally {
      setLoading(false);
    }

    // reset form
    setTitle("");
    setFrom(null);
    setTo(null);
    setDescription("");
    setGithubUrl("");
    setTechStack("");
  };

  const handleEdit = (id) => {
    if (editingId === id) {
      setProjectsLocal((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...editValues } : p))
      );
      setEditingId(null);
      setEditValues({
        title: "",
        from: null,
        to: null,
        description: "",
        githubUrl: "",
        techStack: "",
      });
    } else {
      const project = projectsLocal.find((p) => p.id === id);
      setEditValues({ ...project });
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    const updated = projectsLocal.filter((p) => p.id !== id);
    setProjectsLocal(updated);
  };

  const handleUpdate = async () => {
    const projectsArray = Array.isArray(projectsLocal) ? projectsLocal : [];
    const invalid = projectsArray.some(
      (p) =>
        !p.title || !p.from || !p.to || !p.description || !p.githubUrl || !p.techStack
    );
    if (invalid) {
      showNotification("error", "Please fill all fields before updating!");
      return;
    }
    if (loading) return;

    try {
      setLoading(true);
      showNotification("loading", "Updating Projects...");

      const payloadProjects = projectsArray.map((p) => ({
        ...p,
        fromStr: p.from
          ? typeof p.from === "string"
            ? p.from
            : `${p.from.getFullYear()}-${String(p.from.getMonth() + 1).padStart(2, "0")}-${String(p.from.getDate()).padStart(2, "0")}`
          : null,
        toStr: p.to
          ? typeof p.to === "string"
            ? p.to
            : `${p.to.getFullYear()}-${String(p.to.getMonth() + 1).padStart(2, "0")}-${String(p.to.getDate()).padStart(2, "0")}`
          : null,
      }));

      const res = await api.post("/projects/update", {
        ...profile,
        projects: payloadProjects,
      });

      const updatedProfile = res.data;

      const arr = Array.isArray(updatedProfile)
        ? updatedProfile.map((item) => ({
            id: item.id,
            title: item.title,
            from: item.fromStr ? new Date(item.fromStr + "T00:00:00") : null,
            to: item.toStr ? new Date(item.toStr + "T00:00:00") : null,
            description: item.description,
            githubUrl: item.githubUrl,
            techStack: item.techStack,
          }))
        : [];

      setProjects(arr);
      setProjectsLocal(arr);
      localStorage.setItem("profile", JSON.stringify({ ...profile, projects: arr }));
      showNotification("success", "Projects Updated");
    } catch (err) {
      showNotification("error", "Failed to update Projects");
      console.error("Failed to update projects", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Layout like Timeline
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid
        container
        direction={isMobile ? "column" : "row"}
        justifyContent="space-between"
        sx={{ height: "auto" }}
      >
        {/* Left side - Add Project Form */}
        <Grid item width={isMobile ? "100%" : "49%"} sx={{ height: "100%" }}>
          <MainCard title="Add a Project" sx={{ height: "100%" }}>
            <form onSubmit={handleSubmit}>
              <Grid container direction="column">
                <FormControl required fullWidth sx={{ ...theme.typography.customInput, mb: 2 }}>
                  <InputLabel htmlFor="title">Title</InputLabel>
                  <OutlinedInput id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </FormControl>

                <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
                  <Grid item sx={{ width: isMobile ? "100%" : "48%" }}>
                    <DatePicker
                      label="From"
                      views={["year", "month"]}
                      value={from}
                      onChange={(newValue) => setFrom(newValue)}
                      slotProps={{ textField: { fullWidth: true, required: true } }}
                    />
                  </Grid>
                  <Grid item sx={{ width: isMobile ? "100%" : "48%" }}>
                    <DatePicker
                      label="To"
                      views={["year", "month"]}
                      value={to}
                      onChange={(newValue) => setTo(newValue)}
                      slotProps={{ textField: { fullWidth: true, required: true } }}
                      sx={{ mt: isMobile ? 2 : 0 }}
                    />
                  </Grid>
                </Grid>

                <FormControl required fullWidth sx={{ ...theme.typography.customInput, mb: 2 }}>
                  <InputLabel htmlFor="description">Description</InputLabel>
                  <OutlinedInput
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    minRows={4}
                    sx={{
                      '& .MuiOutlinedInput-input': {
                        pt: 4
                      },
                      borderRadius: 2
                    }}
                  />
                </FormControl>

                <FormControl required fullWidth sx={{ ...theme.typography.customInput, mb: 2 }}>
                  <InputLabel htmlFor="techStack">Tech Stack</InputLabel>
                  <OutlinedInput id="techStack" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
                </FormControl>

                <FormControl required fullWidth sx={{ ...theme.typography.customInput, mb: 2 }}>
                  <InputLabel htmlFor="githubUrl">GitHub URL</InputLabel>
                  <OutlinedInput id="githubUrl" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
                </FormControl>

                <Button
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{
                    borderRadius: 2,
                    width: isMobile ? "100%" : "50%",
                    alignSelf: "center",
                    mt: 2,
                    mb: 2
                  }}
                >
                  Add
                </Button>
              </Grid>
            </form>
          </MainCard>
        </Grid>

        {/* Right side - Projects list */}
        <Grid
          item
          width={isMobile ? "100%" : "49%"}
          sx={{
            height: isMobile ? "auto" : "80vh",
            display: "flex",
            flexDirection: "column",
          }}
          mt={isMobile?4:0}
        >
          {/* Header card */}
          <SubCard sx={{ mb: 2}}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <MuiTypography variant="h4">Your Projects</MuiTypography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={handleUpdate}
                  sx={{ borderRadius: 2 }}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </SubCard>

          {/* Scrollable projects list */}
          <Grid
            item
            sx={{
              flex: 1,
              overflowY: "auto",
              pr: isMobile ? 0 : 1,
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.palette.divider,
                borderRadius: "3px",
              },
            }}
          >
            {projectsLocal.length === 0 ? (
              <MainCard
                sx={{
                  textAlign: "center",
                  py: 6,
                  border: "2px dashed",
                  borderColor: theme.palette.divider,
                  backgroundColor: theme.palette.action.hover,
                }}
              >
                <MuiTypography variant="subtitle1" color="text.secondary">
                  No projects added yet. Add one on the left!
                </MuiTypography>
              </MainCard>
            ) : ( 
              projectsLocal.map((project) => {
                const isEditing = editingId === project.id;
                return (
                  <SubCard key={project.id} sx={{ mb: 2 }}>
                    <Grid container direction="column" spacing={1}>
                      {/* Title */}
                      <Grid item>
                        {isEditing ? (
                          <OutlinedInput
                            fullWidth
                            size="small"
                            value={editValues.title}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, title: e.target.value }))}
                          />
                        ) : (
                          <MuiTypography variant="h4">{project.title}</MuiTypography>
                        )}
                      </Grid>
                      
                      {/* Dates */}
                      <Grid item>
                        {isEditing ? (
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <DatePicker
                                views={["year", "month"]}
                                label="From"
                                value={editValues.from}
                                onChange={(newValue) => setEditValues((prev) => ({ ...prev, from: newValue }))}

                              />
                            </Grid>
                            <Grid item xs={6}>
                              <DatePicker
                                views={["year", "month"]}
                                label="To"
                                value={editValues.to}
                                onChange={(newValue) => setEditValues((prev) => ({ ...prev, to: newValue }))}
                              />
                            </Grid>
                          </Grid>
                        ) : (
                          <MuiTypography  variant="subtitle2" color="text.secondary">
                            {project.from?.toLocaleString("default", { month: "short", year: "numeric" })} –{" "}
                            {project.to?.toLocaleString("default", { month: "short", year: "numeric" })}
                          </MuiTypography>
                        )}
                      </Grid>

                      {/* Description */}
                      <Grid item>
                        {isEditing ? (
                          <OutlinedInput
                            fullWidth
                            size="small"
                            value={editValues.description}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, description: e.target.value }))}
                            multiline
                            rows={3}
                          />
                        ) : (
                          <MuiTypography variant="subtitle1">{project.description}</MuiTypography>
                        )}
                      </Grid>

                      {/* Tech stack */}
                      <Grid item>
                        {isEditing ? (
                          <OutlinedInput
                            fullWidth
                            size="small"
                            value={editValues.techStack}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, techStack: e.target.value }))}
                          />
                        ) : (
                          <MuiTypography variant="subtitle2" color="text.secondary">
                            Tech Stack: {project.techStack}
                          </MuiTypography>
                        )}
                      </Grid>

                      {/* GitHub + Actions */}
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item width={isMobile?"65%":"80%"}>
                          {isEditing ? (
                            <OutlinedInput
                              fullWidth
                              size="small"
                              value={editValues.githubUrl}
                              onChange={(e) => setEditValues((prev) => ({ ...prev, githubUrl: e.target.value }))}
                            />
                          ) : (
                            <MuiTypography variant="subtitle2">
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                Go to GitHub
                              </a>
                            </MuiTypography>
                          )}
                        </Grid>
                        <Grid item>
                          <IconButton
                            onClick={() => handleEdit(project.id)}
                            size="small"
                            sx={{
                              backgroundColor: theme.palette.action.hover,
                              borderRadius: 2,
                              mr: 1,
                              "&:hover": {
                                backgroundColor: theme.palette.action.selected,
                              },
                            }}
                          >
                            {isEditing ? (
                              <SaveIcon fontSize="small" color="secondary" />
                            ) : (
                              <EditIcon fontSize="small" color="secondary" />
                            )}
                          </IconButton>

                          <IconButton
                            onClick={() => handleDelete(project.id)}
                            size="small"
                            sx={{
                              backgroundColor: theme.palette.action.hover,
                              borderRadius: 2,
                              "&:hover": {
                                backgroundColor: theme.palette.action.selected,
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" color="secondary" />
                          </IconButton>

                        </Grid>
                      </Grid>
                    </Grid>
                  </SubCard>
                );
              })
            )}
          </Grid>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
