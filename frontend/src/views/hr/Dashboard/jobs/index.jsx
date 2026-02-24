import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useNavigate } from 'react-router-dom';
import api from 'api/axios';

export default function HrJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scoringJobId, setScoringJobId] = useState(null);
  const [closingJobId, setClosingJobId] = useState(null);
  const [toast, setToast] = useState({ open: false, type: 'success', message: '' });
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    minExperienceYears: '',
    location: ''
  });

  const fetchJobs = async () => {
    try {
      const res = await api.get('/hr/jobs');
      setJobs(res.data || []);
    } catch (e) {
      console.error('Failed to fetch jobs', e);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = async () => {
    if (!form.title || !form.description) {
      setToast({ open: true, type: 'error', message: 'Title and Description are required' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/hr/jobs', {
        title: form.title,
        description: form.description,
        requiredSkills: form.requiredSkills,
        minExperienceYears: form.minExperienceYears ? Number(form.minExperienceYears) : null,
        location: form.location
      });

      setToast({ open: true, type: 'success', message: 'Job posted successfully' });
      setForm({ title: '', description: '', requiredSkills: '', minExperienceYears: '', location: '' });
      await fetchJobs();
    } catch (e) {
      setToast({ open: true, type: 'error', message: 'Failed to post job' });
      console.error('Failed to create job', e);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = async (job) => {
  setDetailOpen(true);
  try {
    const res = await api.get(`/hr/jobs/${job.id}`);
    setSelectedJob(res.data || null);
  } catch (e) {
    console.error('Failed to load job details', e);
    setToast({ open: true, type: 'error', message: 'Failed to load job details' });
    setSelectedJob(null);
  }
};


  const runAiScoring = async (jobId) => {
    setScoringJobId(jobId);
    try {
      await api.post(`/hr/jobs/${jobId}/auto-score`);
      setToast({ open: true, type: 'success', message: `AI scoring completed for Job ID ${jobId}` });
      await fetchJobs();
      navigate(`/hr/matches?jobId=${jobId}`);
    } catch (e) {
      console.error('Failed to auto-score', e);
      setToast({ open: true, type: 'error', message: 'AI scoring failed' });
    } finally {
      setScoringJobId(null);
    }
  };

  const closeJob = async (jobId) => {
    setClosingJobId(jobId);
    try {
      const res = await api.post(`/hr/jobs/${jobId}/close`);
      setToast({ open: true, type: 'success', message: `Job ${jobId} closed` });
      await fetchJobs();

      if (res?.data && selectedJob?.id === jobId) {
        setSelectedJob(res.data);
      } else if (selectedJob?.id === jobId) {
        setSelectedJob((prev) => ({ ...prev, status: 'CLOSED' }));
      }
    } catch (e) {
      console.error('Failed to close job', e);
      setToast({ open: true, type: 'error', message: 'Failed to close job' });
    } finally {
      setClosingJobId(null);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h2">Post a Job</Typography>
      </Grid>

      <Grid size={12}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Title" value={form.title} onChange={(e) => handleChange('title', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Location" value={form.location} onChange={(e) => handleChange('location', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Min Experience (years)"
                  type="number"
                  value={form.minExperienceYears}
                  onChange={(e) => handleChange('minExperienceYears', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Required Skills (comma/newline separated)"
                  value={form.requiredSkills}
                  onChange={(e) => handleChange('requiredSkills', e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Description"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <Button variant="contained" color="secondary" onClick={handleCreate} disabled={loading}>
                  {loading ? 'Posting...' : 'Post Job'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={12}>
        <Card>
          <CardContent>
            <Typography variant="h3" sx={{ mb: 2 }}>
              My Jobs
            </Typography>

            <Stack spacing={2}>
              {jobs.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No jobs posted yet.
                </Typography>
              )}

              {jobs.map((job) => {
                const isClosed = String(job.status || '').toUpperCase() === 'CLOSED';

                return (
                  <div key={job.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h4">{job.title || 'N/A'}</Typography>
                      <Chip size="small" color={isClosed ? 'default' : 'success'} label={job.status || 'N/A'} />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Job ID: {job.id ?? 'N/A'} | {job.location || 'N/A'} | Min Exp: {job.minExperienceYears ?? 'N/A'}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined" onClick={() => openDetails(job)}>
                        View Details
                      </Button>

                      <Button size="small" variant="outlined" onClick={() => navigate(`/hr/matches?jobId=${job.id}`)}>
                        Open Matches
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => runAiScoring(job.id)}
                        disabled={scoringJobId === job.id || isClosed}
                      >
                        {scoringJobId === job.id ? 'Scoring...' : 'Run AI Scoring'}
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => closeJob(job.id)}
                        disabled={isClosed || closingJobId === job.id}
                      >
                        {closingJobId === job.id ? 'Closing...' : isClosed ? 'Closed' : 'Close Job'}
                      </Button>
                    </Stack>

                    <Divider sx={{ mt: 2 }} />
                  </div>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent dividers>
          {selectedJob ? (
            <Stack spacing={1}>
              <Typography>
                <b>ID:</b> {selectedJob?.id ?? 'N/A'}
              </Typography>
              <Typography>
                <b>Title:</b> {selectedJob?.title ?? 'N/A'}
              </Typography>
              <Typography>
                <b>Status:</b> {selectedJob?.status ?? 'N/A'}
              </Typography>
              <Typography>
                <b>Location:</b> {selectedJob?.location ?? 'N/A'}
              </Typography>
              <Typography>
                <b>Min Experience:</b> {selectedJob?.minExperienceYears ?? 'N/A'}
              </Typography>
              <Typography>
                <b>Required Skills:</b> {selectedJob?.requiredSkills ?? 'N/A'}
              </Typography>
              <Typography>
                <b>Description:</b>
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedJob?.description ?? 'N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Created: {selectedJob?.createdAt ?? 'N/A'} | Updated: {selectedJob?.updatedAt ?? 'N/A'}
              </Typography>
            </Stack>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setToast((prev) => ({ ...prev, open: false }))} severity={toast.type} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
