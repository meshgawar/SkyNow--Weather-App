import { use, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { getAQI } from './API';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  // color: (theme.vars ?? theme).palette.text.secondary,
  borderRadius: '16px', // rounded corners
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // subtle shadow
  display: 'flex',
  flexWrap: 'nowwrap',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgb(0 0 0 / 60%)',
  color: 'white'
}));

export default function WeatherInfoCard({ result, city, idx }) {
  const [AQI, setAQI] = useState("");

  useEffect(() => {
    if (!city) return;
    async function fetchAQI() {
      const res = await getAQI(city);
      setAQI(res);
    }
    fetchAQI();
  }, [city]);

  useEffect(() => {
    console.log(result);
  }, [result]);

  const hasData = Array.isArray(result) && idx !== -1 && result[idx];

  return (
    <Box sx={{ flexGrow: 1, p: 2,maxHeight: '100%' }}>
      {/* First Row */}
      <Grid container spacing={1} columns={16}>
        <Grid size={{ xs: 16, sm: 8 }}>
          <Item sx={{ height: { xs: 50, sm: 100 } }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined">air</span>
              <h4 style={{ margin: 0 }}>Wind</h4>
            </div>
            <p style={{ margin: 0 }}>{hasData ? `${result[idx].wind} Km/h` : "--"}</p>
          </Item>
        </Grid>
        <Grid size={{ xs: 16, sm: 8 }}>
          <Item sx={{ height: { xs: 50, sm: 100 } }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined">water_drop</span>
              <h4 style={{ margin: 0 }}>Humidity</h4>
            </div>
            <p style={{ margin: 0 }}>{hasData ? `${result[idx].humidity}%` : "--"}</p>
          </Item>
        </Grid>
      </Grid>

      {/* Second Row */}
      <Grid container spacing={1} columns={16} sx={{ marginTop: 1 }}>
        <Grid size={{ xs: 16, sm: 8 }}>
          <Item sx={{ height: { xs: 50, sm: 100 } }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined">thermostat</span>
              <h4 style={{ margin: 0 }}>Temperature</h4>
            </div>
            <p style={{ margin: 0 }}>{hasData ? `${Math.round(result[idx].temp)}°C` : "--"}</p>
          </Item>
        </Grid>
        <Grid size={{ xs: 16, sm: 8 }}>
          <Item sx={{ height: { xs: 50, sm: 100 } }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 'large', fontWeight: 'bold' }}>AQI</span>
              {/* <h4 style={{ margin: 0 }}>Air Quality</h4> */}
            </div>
            <p style={{ margin: 0, fontSize: 'large' }}>{AQI}<sub style={{ fontSize: "xx-small" }}>AQI-US</sub></p>
          </Item>
        </Grid>
      </Grid>

      <Grid container spacing={1} columns={16} sx={{ marginTop: 1 }}>
        <Grid size={{ xs: 16, sm: 8 }}>
          <Item sx={{ height: { xs: 50, sm: 100 } }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined">rainy</span>
              <h4 style={{ margin: 0 }}>POP</h4>
            </div>
            <p style={{ margin: 0 }}>{hasData ? `${Math.round(result[idx].pop * 100)}%` : "--"}</p>
          </Item>
        </Grid>
        <Grid size={{ xs: 16, sm: 8 }}>
          <Item sx={{ height: { xs: 50, sm: 100 } }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined">Visibility</span>
              <h4 style={{ margin: 0 }}>Visibility</h4>
            </div>
            <p style={{ margin: 0 }}>{hasData ? `${result[idx].visibility / 1000} Km` : "--"}</p>
          </Item>
        </Grid>
      </Grid>

    </Box>
  );
}
