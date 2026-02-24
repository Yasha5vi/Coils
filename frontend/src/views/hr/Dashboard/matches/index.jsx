import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Chip from '@mui/material/Chip';
import { useSearchParams } from 'react-router-dom';
import api from 'api/axios';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';




export default function HrMatchesPage() {
  const [jobId, setJobId] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, type: 'info', message: '' });
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const qJobId = searchParams.get('jobId');
    if (qJobId) setJobId(qJobId);
  }, [searchParams]);

  const loadMatches = async (id = jobId) => {
    if (!id) {
      setToast({ open: true, type: 'error', message: 'Please enter Job ID' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/hr/jobs/${id}/matches`);
      setMatches(res.data || []);
      setToast({ open: true, type: 'success', message: 'Matches loaded' });
    } catch (e) {
      console.error('Failed to load matches', e);
      setMatches([]);
      setToast({ open: true, type: 'error', message: 'Failed to load matches' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) loadMatches(jobId);
  }, [jobId]);

  const scoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h2">Candidate Matches</Typography>
      </Grid>

      <Grid size={12}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField fullWidth label="Job ID" value={jobId} onChange={(e) => setJobId(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Button variant="contained" color="secondary" onClick={() => loadMatches()} disabled={loading}>
                  {loading ? 'Loading...' : 'Load Matches'}
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
              Ranked Candidates
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Candidate</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Matched Skills</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No matches found
                      </TableCell>
                    </TableRow>
                  ) : (
                    matches.map((m) => (
                      <TableRow key={m.candidateUserId}>
                        <TableCell>
                      <Link
                        component={RouterLink}
                        to={`/socialProfile?username=${encodeURIComponent(m.username)}`}
                        underline="hover"
                      >
                        {m.username}
                      </Link>
                    </TableCell>


                        <TableCell>{m.email}</TableCell>
                        <TableCell>
                          <Chip label={Number(m.score || 0).toFixed(2)} color={scoreColor(Number(m.score || 0))} size="small" />
                        </TableCell>
                        <TableCell>{m.matchedSkills || '-'}</TableCell>
                        <TableCell>{m.remarks || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setToast((p) => ({ ...p, open: false }))} severity={toast.type} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
