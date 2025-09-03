// material-ui
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import {
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon } from "@mui/icons-material";

// project imports
import MainCard from "ui-component/cards/MainCard";
import { useUserProfile } from "../../contexts/UserProfileContext";
import api from "../../api/axios";
import { useNotification } from "../../contexts/NotificationContext";

export default function About() {
  const { profile, setProfile } = useUserProfile();
  const { showNotification } = useNotification();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isEditing, setIsEditing] = useState(false);
  const [aboutLocal, setAboutLocal] = useState(profile.about || "");
  const [loading, setLoading] = useState(false);

  // keep local in sync if profile.about changes from backend
  useEffect(() => {
    if (profile?.about) setAboutLocal(profile.about);
  }, [profile]);

  const handleToggle = async () => {
    // If saving → call backend
    if (isEditing) {
      if (loading) return;
      try {
        setLoading(true);
        showNotification("loading", "Updating about...");

        const res = await api.post("/about/update", {
          ...profile,
          about: aboutLocal,
        });

        const updatedProfile = res.data;
        setProfile(updatedProfile);
        localStorage.setItem("profile", JSON.stringify(updatedProfile));
        showNotification("success", "About updated");
        
      } catch (err) {
        console.error(err);
        showNotification("error", "Failed to update about");
      } finally {
        setLoading(false);
      }
    }
    setIsEditing((prev) => !prev);
  };

  return (
    <MainCard
      title={
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              About Me
            </Typography>
          </Grid>
          <Grid item>
            {/* Desktop → Button */}
            {!isMobile && (
              <Button
                variant="contained"
                size="small"
                color="secondary"
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                onClick={handleToggle}
                sx={{ borderRadius: 2 }}
                disabled={loading}
              >
                {isEditing ? "Save" : "Edit"}
              </Button>
            )}
            {/* Mobile → Icon */}
            {isMobile && (
              <Tooltip title={isEditing ? "Save" : "Edit"}>
                <IconButton
                  aria-label={isEditing ? "save" : "edit"}
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.secondary.light,
                    color: theme.palette.secondary.main,
                    borderRadius: 2,
                    ml: 1,
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.secondary.contrastText,
                    },
                  }}
                  onClick={handleToggle}
                  disabled={loading}
                >
                  {isEditing ? (
                    <SaveIcon fontSize="small" />
                  ) : (
                    <EditIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        </Grid>
      }
    >
      {/* Profile.bio (always visible, not editable here) */}
      <Typography variant="body1" sx={{ mb: 2 }}>
        {profile.bio && profile.bio.length > 0
          ? profile.bio
          : "Please set your bio in settings"}
      </Typography>

      {/* Editable About section */}
      {isEditing ? (
        <TextField
          fullWidth
          multiline
          minRows={5}
          value={aboutLocal}
          onChange={(e) => setAboutLocal(e.target.value)}
          placeholder="Write something about yourself..."
        />
      ) : (
        <Typography variant="body2" color="textSecondary">
          {aboutLocal && aboutLocal.length > 0
            ? aboutLocal
            : "Click edit to add more about yourself"}
        </Typography>
      )}
    </MainCard>
  );
}
