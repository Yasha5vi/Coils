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

import { useUserProfile } from "../../contexts/UserProfileContext";
import { useNotification } from "../../contexts/NotificationContext";
import api from "../../api/axios";

export default function Certifications() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { profile, setAchievements } = useUserProfile();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(false);
  const [achievementsLocal, setAchievementsLocal] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    title: "",
    skills: "",
    certificateUrl: "",
  });

  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");

  useEffect(() => {
    if (profile?.achievements) {
      setAchievementsLocal(profile.achievements);
    }
  }, [profile]);

  // Add certification
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !skills.trim() || !certificateUrl.trim()) {
      showNotification("error", "Please fill all fields!");
      return;
    }

    const newAchievement = {
      id: Date.now(),
      title,
      skills,
      certificateUrl,
    };

    const updatedAchievements = [...achievementsLocal, newAchievement];
    if (loading) return;

    try {
      setLoading(true);
      showNotification("loading", "Adding Certification...");

      const res = await api.post("/certifications/update", {
        ...profile,
        achievements: updatedAchievements,
      });

      const result = res.data;
      const arr = Array.isArray(result)
        ? result.map((item) => ({
            id: item.id,
            title: item.title,
            skills: item.skills,
            certificateUrl: item.certificateUrl,
          }))
        : [];

      setAchievements(arr);
      setAchievementsLocal(arr);
      localStorage.setItem(
        "profile",
        JSON.stringify({ ...profile, achievements: arr })
      );
      showNotification("success", "Certification Added");
    } catch (err) {
      showNotification("error", "Failed to add Certification");
      console.error("Failed to add certification", err);
    } finally {
      setLoading(false);
    }

    setTitle("");
    setSkills("");
    setCertificateUrl("");
  };

  const handleEdit = (id) => {
    if (editingId === id) {
      setAchievementsLocal((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...editValues } : a))
      );
      setEditingId(null);
      setEditValues({ title: "", skills: "", certificateUrl: "" });
    } else {
      const ach = achievementsLocal.find((a) => a.id === id);
      setEditValues({ ...ach });
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    const updated = achievementsLocal.filter((a) => a.id !== id);
    setAchievementsLocal(updated);
  };

  const handleUpdate = async () => {
    const achievementsArray = Array.isArray(achievementsLocal)
      ? achievementsLocal
      : [];

    const invalid = achievementsArray.some(
      (ach) =>
        !ach.title?.trim() || !ach.skills?.trim() || !ach.certificateUrl?.trim()
    );
    if (invalid) {
      showNotification("error", "Please fill all fields before updating!");
      return;
    }
    if (loading) return;

    try {
      setLoading(true);
      showNotification("loading", "Updating Certifications...");

      const res = await api.post("/certifications/update", {
        ...profile,
        achievements: achievementsArray,
      });

      const updatedProfile = res.data;
      const arr = Array.isArray(updatedProfile)
        ? updatedProfile.map((item) => ({
            id: item.id,
            title: item.title,
            skills: item.skills,
            certificateUrl: item.certificateUrl,
          }))
        : [];

      setAchievements(arr);
      setAchievementsLocal(arr);
      localStorage.setItem(
        "profile",
        JSON.stringify({ ...profile, achievements: arr })
      );
      showNotification("success", "Certifications Updated");
    } catch (err) {
      showNotification("error", "Failed to update Certifications");
      console.error("Failed to update certifications", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      direction={isMobile ? "column" : "row"}
      justifyContent="space-between"
      sx={{ height: "auto" }}
    >
      {/* Left side - Add Certification Form */}
      <Grid item width={isMobile ? "100%" : "49%"} sx={{ height: "100%" }}>
        <MainCard title="Add a Certification" sx={{ height: "100%" }}>
          <form onSubmit={handleSubmit}>
            <Grid container direction="column">
              <FormControl
                required
                fullWidth
                sx={{ ...theme.typography.customInput, mb: 2 }}
              >
                <InputLabel htmlFor="title">Title</InputLabel>
                <OutlinedInput
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>

              <FormControl
                required
                fullWidth
                sx={{ ...theme.typography.customInput, mb: 2 }}
              >
                <InputLabel htmlFor="skills">Skills Learned</InputLabel>
                <OutlinedInput
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </FormControl>

              <FormControl
                required
                fullWidth
                sx={{ ...theme.typography.customInput, mb: 2 }}
              >
                <InputLabel htmlFor="certificateUrl">Certification URL</InputLabel>
                <OutlinedInput
                  id="certificateUrl"
                  value={certificateUrl}
                  onChange={(e) => setCertificateUrl(e.target.value)}
                />
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

      {/* Right side - Certifications list */}
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
        {/* Header */}
        <SubCard sx={{ mb: 2}}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <MuiTypography variant="h4">Your Certifications</MuiTypography>
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

        {/* Scrollable list */}
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
          {achievementsLocal.length === 0 ? (
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
                No certifications added yet. Add one on the left!
              </MuiTypography>
            </MainCard>
          ) : (
            achievementsLocal.map((achievement) => {
              const isEditing = editingId === achievement.id;
              return (
                <SubCard key={achievement.id} sx={{ mb: 2 }}>
                  <Grid container direction="column" spacing={1}>
                    {/* Title */}
                    <Grid item>
                      {isEditing ? (
                        <OutlinedInput
                          fullWidth
                          size="small"
                          value={editValues.title}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <MuiTypography variant="subtitle1">
                          {achievement.title}
                        </MuiTypography>
                      )}
                    </Grid>

                    {/* Skills */}
                    <Grid item>
                      {isEditing ? (
                        <OutlinedInput
                          fullWidth
                          size="small"
                          value={editValues.skills}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              skills: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <MuiTypography variant="subtitle2" color="text.secondary">
                          Skills Learned: {achievement.skills}
                        </MuiTypography>
                      )}
                    </Grid>

                    {/* URL + Actions */}
                    <Grid
                      item
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item width={isMobile ? "65%" : "80%"}>
                        {isEditing ? (
                          <OutlinedInput
                            fullWidth
                            size="small"
                            value={editValues.certificateUrl}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                certificateUrl: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <MuiTypography variant="subtitle2">
                            <a
                              href={achievement.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Go to Certificate
                            </a>
                          </MuiTypography>
                        )}
                      </Grid>
                      <Grid item>
                        <IconButton
                          onClick={() => handleEdit(achievement.id)}
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
                          onClick={() => handleDelete(achievement.id)}
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
  );
}
