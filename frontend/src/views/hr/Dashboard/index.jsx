import { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import api from 'api/axios';

export default function HrDashboard() {
  const [jobs, setJobs] = useState([]);
  const [matchMap, setMatchMap] = useState({}); // { [jobId]: matches[] }

  const fetchDashboardData = async () => {
    try {
      const jobsRes = await api.get('/hr/jobs');
      const jobsData = jobsRes.data || [];
      setJobs(jobsData);

      const results = await Promise.all(
        jobsData.map(async (job) => {
          try {
            const mRes = await api.get(`/hr/jobs/${job.id}/matches`);
            return { jobId: job.id, matches: mRes.data || [] };
          } catch {
            return { jobId: job.id, matches: [] };
          }
        })
      );

      const mm = {};
      results.forEach((r) => {
        mm[r.jobId] = r.matches;
      });
      setMatchMap(mm);
    } catch (e) {
      console.error('Failed to fetch HR dashboard data', e);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const openJobs = jobs.filter((j) => String(j.status).toUpperCase() === 'OPEN').length;

    let candidatesEvaluated = 0;
    let topMatchScore = 0;

    Object.values(matchMap).forEach((arr) => {
      candidatesEvaluated += arr.length;
      arr.forEach((m) => {
        const s = Number(m.score || 0);
        if (s > topMatchScore) topMatchScore = s;
      });
    });

    return [
      { title: 'Total Jobs Posted', value: totalJobs },
      { title: 'Open Jobs', value: openJobs },
      { title: 'Candidates Evaluated', value: candidatesEvaluated },
      { title: 'Top Match Score', value: `${topMatchScore.toFixed(2)}` }
    ];
  }, [jobs, matchMap]);

  const recentJobs = useMemo(() => jobs.slice(0, 5), [jobs]);

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h2">HR Dashboard</Typography>
      </Grid>

      {stats.map((item) => (
        <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                {item.title}
              </Typography>
              <Typography variant="h3">{item.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Grid size={12}>
        <Card>
          <CardContent>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Recent Jobs
            </Typography>
            <Stack spacing={1.5}>
              {recentJobs.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No jobs posted yet.
                </Typography>
              )}

              {recentJobs.map((job) => {
                const jobMatches = matchMap[job.id] || [];
                const topScore = jobMatches.length > 0 ? Math.max(...jobMatches.map((m) => Number(m.score || 0))) : 0;

                return (
                  <div key={job.id}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h4">
                        {job.title} (ID: {job.id})
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip size="small" label={`Matches: ${jobMatches.length}`} />
                        <Chip size="small" color="secondary" label={`Top: ${topScore.toFixed(2)}`} />
                      </Stack>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {job.location || 'N/A'} | Status: {job.status}
                    </Typography>
                    <Divider sx={{ mt: 1 }} />
                  </div>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
