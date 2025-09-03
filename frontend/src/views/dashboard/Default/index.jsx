import { useEffect, useState } from 'react';

// material-ui
import Grid from "@mui/material/Grid";

// project imports
import TotalSolved from './TotalSolved';
import DifficultyBreakdown from './DifficultyBreakdown';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import { Typography } from '@mui/material'; 

import { gridSpacing } from 'store/constant';
import { useUserProfile } from 'contexts/UserProfileContext';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const platform = ["Leetcode", "Codeforces", "Codechef","GeeksForGeeks"];

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { profile } = useUserProfile();

  const gfg = profile?.platformDataJson?.gfg || {};
  const lc = profile?.platformDataJson?.leetcode || {};
  const cf = profile?.platformDataJson?.codeforces || {};
  const cc = profile?.platformDataJson?.codechef || {};


  const gfgSolved = gfg?.solvedStats || {};
  const lcSolved = lc?.submissions || {};

  const basic = gfgSolved?.Basic || 0;
  const easy = (gfgSolved?.Easy || 0) + (lcSolved?.Easy || 0);
  const medium = (gfgSolved?.Medium || 0) + (lcSolved?.Medium || 0);
  const hard = (gfgSolved?.Hard || 0) + (lcSolved?.Hard || 0); 

  const total = basic + easy + medium + hard;

  const ccRating = cc?.maxRank ?? "-";
  const cfCurRating = cf?.rating ?? "-";
  const cfMaxRating = cf?.maxRating ?? "-";

  let lcRating = lc?.contestBadge ?? "-";
  if (lcRating === null) {
    lcRating = "< 1850";
  }


  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container justifyContent={isMobile?"center":"space-between"} >
      {/* First Column */}
      <Grid item sx={{mb:isMobile?3:0}} width={isMobile?"100%":"32%"} container direction="column" spacing={gridSpacing}>
        <Grid item>
          <TotalSolved isLoading={isLoading} total={total}/>
        </Grid>
        <Grid item>
          <DifficultyBreakdown isLoading={isLoading} basic={basic} easy={easy} medium={medium} hard={hard}/>
        </Grid>
      </Grid>

      {/* Second Column */}
      <Grid item sx={{mb:isMobile?3:0}} width={isMobile?"100%":"32%"} container direction="column" spacing={gridSpacing}>
        <SubCard>
          <Typography variant="subtitle1">Rating breakdown</Typography>
        </SubCard>
        {[lcRating, cfCurRating, ccRating,"-"].map((total, idx) => (
          <Grid item key={idx} xs={12}>
            <TotalIncomeLightCard
              isLoading={isLoading}
              total={total}
              label={platform[idx]}
              icon={<StorefrontTwoToneIcon fontSize="inherit" />}
            />
          </Grid>
        ))}
      </Grid>


      {/* Third Column */}
      <Grid item sx={{mb:isMobile?3:0}} width={isMobile?"100%":"32%"}>
        <TotalGrowthBarChart isLoading={isLoading} basic={basic} easy={easy} medium={medium} hard={hard} />
      </Grid>
    </Grid>
  );
}
