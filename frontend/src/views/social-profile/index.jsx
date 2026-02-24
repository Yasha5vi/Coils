import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import api from 'api/axios';

const Stat = ({ label, value }) => (
  <Box sx={{ minWidth: 120 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h4">{value ?? 0}</Typography>
  </Box>
);

export default function SocialProfile() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username');

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!username) return;
    const fetchProfile = async () => {
      setLoading(true);
      setErr('');
      try {
        const res = await api.get(`/profile/${encodeURIComponent(username)}`);
        setProfile(res.data || null);
      } catch (e) {
        console.error(e);
        setErr('Could not load candidate profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const skills = useMemo(() => {
    if (!profile?.skills) return [];
    return String(profile.skills)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [profile]);

  const pd = profile?.platformDataJson || {};
  const lc = pd.leetcode || {};
  const cf = pd.codeforces || {};
  const gfg = pd.gfg || {};
  const cc = pd.codechef || {};

  return (
    <MainCard title={username ? `Candidate Profile: ${username}` : 'Candidate Profile'}>
      {loading && <CircularProgress size={24} />}
      {!loading && err && <Alert severity="error">{err}</Alert>}
      {!loading && !err && !profile && <Alert severity="info">No profile found.</Alert>}

      {!loading && !err && profile && (
        <Grid container spacing={2}>
          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h2">
                  {(profile.firstName || '').trim()} {(profile.lastName || '').trim()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  @{username} | {profile.email || 'N/A'} | {profile.phone || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {profile.bio || profile.about || 'No summary provided.'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h3" sx={{ mb: 1 }}>Skills</Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {skills.length ? skills.map((s) => <Chip key={s} label={s} size="small" />) : <Typography>No skills listed</Typography>}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h3" sx={{ mb: 1 }}>LeetCode</Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Stat label="Total" value={lc.totalSolved} />
                  <Stat label="Easy" value={lc.easySolved} />
                  <Stat label="Medium" value={lc.mediumSolved} />
                  <Stat label="Hard" value={lc.hardSolved} />
                </Stack>
                {profile.leetcode && (
                  <Link href={`https://leetcode.com/${profile.leetcode}`} target="_blank" rel="noopener noreferrer" underline="hover">
                    @{profile.leetcode}
                  </Link>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h3" sx={{ mb: 1 }}>Codeforces</Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Stat label="Rating" value={cf.rating} />
                  <Stat label="Rank" value={cf.rank || '-'} />
                </Stack>
                {profile.codeforces && (
                  <Link href={`https://codeforces.com/profile/${profile.codeforces}`} target="_blank" rel="noopener noreferrer" underline="hover">
                    @{profile.codeforces}
                  </Link>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h3" sx={{ mb: 1 }}>GeeksforGeeks</Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Stat label="Solved" value={gfg.totalProblemsSolved} />
                  <Stat label="School" value={gfg.school || '-'} />
                </Stack>
                {profile.geeksforgeeks && (
                  <Link href={`https://auth.geeksforgeeks.org/user/${profile.geeksforgeeks}`} target="_blank" rel="noopener noreferrer" underline="hover">
                    @{profile.geeksforgeeks}
                  </Link>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h3" sx={{ mb: 1 }}>CodeChef</Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Stat label="Stars" value={cc.stars} />
                  <Stat label="Rating" value={cc.rating} />
                </Stack>
                {profile.codechef && (
                  <Link href={`https://www.codechef.com/users/${profile.codechef}`} target="_blank" rel="noopener noreferrer" underline="hover">
                    @{profile.codechef}
                  </Link>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h3">Projects</Typography>
                <Divider sx={{ my: 1 }} />
                {profile.projects?.length ? (
                  profile.projects.map((p) => (
                    <Box key={p.id} sx={{ mb: 1.5 }}>
                      <Typography variant="h4">{p.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {p.techStack || 'N/A'} | {p.from || p.fromStr || '-'} to {p.to || p.toStr || '-'}
                      </Typography>
                      <Typography variant="body2">{p.description || '-'}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">No projects available.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h3">Certifications / Achievements</Typography>
                <Divider sx={{ my: 1 }} />
                {profile.achievements?.length ? (
                  profile.achievements.map((a) => (
                    <Box key={a.id} sx={{ mb: 1 }}>
                      <Typography variant="h4">{a.title || 'Achievement'}</Typography>
                      <Typography variant="body2" color="text.secondary">{a.skills || '-'}</Typography>
                      {a.certificateUrl && (
                        <Link href={a.certificateUrl} target="_blank" rel="noopener noreferrer" underline="hover">
                          View Certificate
                        </Link>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">No achievements available.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </MainCard>
  );
}
