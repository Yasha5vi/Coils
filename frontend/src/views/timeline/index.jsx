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

export default function Journey() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { profile, setJourney } = useUserProfile();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(false);
  const [journeyLocal, setJourneyLocal] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    title: "",
    organization: "",
    from: null,
    to: null,
    description: "",
  });

  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
      if (profile?.journey) {
        const arr = profile.journey.map((item) => ({
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
        setJourneyLocal(arr);
      }
    }, [profile]);

  // Add new journey
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !organization || !from || !to || !description) {
      showNotification("error", "Please fill all fields!");
      return;
    }

    const fromObj = new Date(from);
    const toObj = new Date(to);

    const newJourney = {
      id: Date.now(),
      title,
      organization,
      from,
      to,
      description,
    };

    const updatedJourneys = [...journeyLocal, newJourney].map((p) => ({
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
      showNotification("loading", "Adding Journey...");

      const res = await api.post("/journey/update", {
        ...profile,
        journey: updatedJourneys,
      });

      const result = res.data; //res.data;
      const arr = Array.isArray(result)
        ? result.map((item) => ({
            id: item.id,
            title: item.title,
            organization: item.organization,
            from: item.fromStr ? new Date(item.fromStr + "T00:00:00") : null,
            to: item.toStr ? new Date(item.toStr + "T00:00:00") : null,
            description: item.description,
          }))
        : [];

      setJourney(arr);
      setJourneyLocal(arr);
      localStorage.setItem("profile", JSON.stringify({ ...profile, journey: arr }));
      showNotification("success", "Journey Added");
    } catch (err) {
      showNotification("error", "Failed to add Journey");
      console.error("Failed to add journey", err);
    } finally {
      setLoading(false);
    }

    setTitle("");
    setOrganization("");
    setFrom(null);
    setTo(null);
    setDescription("");
  };

  const handleEdit = (id) => {
    if (editingId === id) {
      setJourneyLocal((prev) =>
        prev.map((j) => (j.id === id ? { ...j, ...editValues } : j))
      );
      setEditingId(null);
      setEditValues({
        title: "",
        organization: "",
        from: null,
        to: null,
        description: "",
      });
    } else {
      const journey = journeyLocal.find((j) => j.id === id);
      setEditValues({
        id: journey.id,
        title: journey.title,
        organization: journey.organization,
        from: journey.from,
        to: journey.to,
        description: journey.description,
      });
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    const updated = journeyLocal.filter((j) => j.id !== id);
    setJourneyLocal(updated);
  };

  const handleUpdate = async () => {
    const journeysArray = Array.isArray(journeyLocal) ? journeyLocal : [];
    const invalid = journeysArray.some(
      (j) =>
        !j.title || !j.organization || !j.from || !j.to || !j.description
    );

    if (invalid) {
      showNotification("error", "Please fill all fields before updating!");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      showNotification("loading", "Updating Journey...");

      const payload = journeysArray.map((j) => ({
        ...j,
        fromStr: j.from
        ? `${j.from.getFullYear()}-${String(j.from.getMonth() + 1).padStart(2, "0")}-${String(j.from.getDate()).padStart(2, "0")}`
        : null,
      toStr: j.to
        ? `${j.to.getFullYear()}-${String(j.to.getMonth() + 1).padStart(2, "0")}-${String(j.to.getDate()).padStart(2, "0")}`
        : null,
      }));

      const res = await api.post("/journey/update", {
        ...profile,
        journey: payload,
      });

      const result = res.data;
      const arr = Array.isArray(result)
        ? result.map((item) => ({
            id: item.id,
            title: item.title,
            organization: item.organization,
            from: item.fromStr
              ? new Date(item.fromStr + "T00:00:00")
              : item.from instanceof Date
              ? item.from
              : item.from
              ? new Date(item.from)
              : null,
            to: item.toStr
              ? new Date(item.toStr + "T00:00:00")
              : item.to instanceof Date
              ? item.to
              : item.to
              ? new Date(item.to)
              : null,
            description: item.description,
          }))
        : [];

      setJourney(arr);
      setJourneyLocal(arr);
      localStorage.setItem("profile", JSON.stringify({ ...profile, journey: arr }));
      showNotification("success", "Journey Updated");
    } catch (err) {
      showNotification("error", "Failed to update Journey");
      console.error("Failed to update journey", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container 
      direction={isMobile?"column":"row"}
      justifyContent={"space-between"}>
        {/* Left Side - Add Form */}
        <Grid item 
        width={isMobile?"100%":"49%"} 
        sx={{ height: "auto"}}>
          <MainCard
            title="Add a Journey Update"
            sx={{ height: "100%" }}
          >
            <form onSubmit={handleSubmit}>
              <Grid
                container
                direction="column"
                sx={{ width: "100%" }}
              >
                <Grid item xs={12}>
                  <FormControl
                    required
                    fullWidth
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="title">Title</InputLabel>
                    <OutlinedInput
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item >
                  <FormControl
                    required
                    fullWidth
                    sx={{ ...theme.typography.customInput ,mt:2}}
                  >
                    <InputLabel htmlFor="organization">Organization</InputLabel>
                    <OutlinedInput
                      id="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid container sx={{ width: "100%", mt:2 }} justifyContent={"space-between"}>
                  <Grid item sx={{ width: isMobile ? '100%' : '48%' }}>
                    <DatePicker
                      label="From"
                      views={["year", "month"]}
                      value={from}
                      onChange={(newValue) => setFrom(newValue)}
                      slotProps={{
                        textField: { fullWidth: true, required: true },
                      }}
                    />
                  </Grid>
                  <Grid item sx={{ width: isMobile ? '100%' : '48%' }}>
                    <DatePicker
                      label="To"
                      views={["year", "month"]}
                      value={to}
                      onChange={(newValue) => setTo(newValue)}
                      slotProps={{
                        textField: { fullWidth: true, required: true },
                      }}
                      sx={{ mt: isMobile ? 2 : 0 }}
                    />
                  </Grid>
                </Grid>
                <Grid item sx={{mt:2}}>
                  <FormControl
                    required
                    fullWidth
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <OutlinedInput
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      multiline
                      minRows={isMobile?4:6}
                      sx={{
                        '& .MuiOutlinedInput-input': {
                          pt: 4
                        },
                        borderRadius: 2
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item container justifyContent="center">
                  <Button
                    size="large"
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{
                      borderRadius: 2,
                      width: isMobile ? "100%" : "50%",
                      mt:2,
                      mb:2
                    }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </form>
          </MainCard>
        </Grid>

        {/* Right Side - Journey */}
        <Grid
          item
          width={isMobile?"100%":"49%"}
          mt={isMobile?4:0}
          sx={{
            height: isMobile ? "auto" : "80vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header Card */}
          <SubCard sx={{ mb: 2}}>
            <Grid container alignItems="center" justifyContent="space-between">
              <MuiTypography variant="h4">Your Journey</MuiTypography>
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

          {/* Scrollable list of journeys */}
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
            {journeyLocal.length === 0 ? (
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
                  No journey added yet. Add one on the left!
                </MuiTypography>
              </MainCard>
            ) : (
              journeyLocal.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <MainCard
                    key={item.id}
                    title={
                      isEditing ? (
                        <OutlinedInput
                          value={editValues.title}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          size="small"
                          fullWidth
                        />
                      ) : (
                        item.title
                      )
                    }
                    sx={{ mb: 2 }}
                  >
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        {isEditing ? (
                          <OutlinedInput
                            fullWidth
                            size="small"
                            value={editValues.organization}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                organization: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          <MuiTypography variant="subtitle1">
                            {item.organization}
                          </MuiTypography>
                        )}
                      </Grid>
                      <Grid item>
                        {isEditing ? (
                          <OutlinedInput
                            fullWidth
                            size="small"
                            value={editValues.description}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            multiline
                            rows={3}
                          />
                        ) : (
                          <MuiTypography variant="body2">
                            {item.description}
                          </MuiTypography>
                        )}
                      </Grid>
                      
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                      <Grid sx={{width:"65%"}}>
                        {isEditing ? (
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <DatePicker
                                views={["year", "month"]}
                                label="From"
                                value={editValues.from}
                                onChange={(newValue) =>
                                  setEditValues((prev) => ({
                                    ...prev,
                                    from: newValue,
                                  }))
                                }
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <DatePicker
                                views={["year", "month"]}
                                label="To"
                                value={editValues.to}
                                onChange={(newValue) =>
                                  setEditValues((prev) => ({
                                    ...prev,
                                    to: newValue,
                                  }))
                                }
                              />
                            </Grid>
                          </Grid>
                        ) : (
                          <MuiTypography variant="subtitle2" color="text.secondary">
                            {item.from?.toLocaleString("default", {
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            –{" "}
                            {item.to?.toLocaleString("default", {
                              month: "short",
                              year: "numeric",
                            })}
                          </MuiTypography>
                        )}
                      </Grid>
                      
                      <Grid item>
                        <IconButton
                          onClick={() => handleEdit(item.id)}
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
                          onClick={() => handleDelete(item.id)}
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
                  </MainCard>
                );
              })
            )}
          </Grid>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
