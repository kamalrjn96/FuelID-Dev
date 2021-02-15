import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  makeStyles,
  useTheme,
  Grid
} from '@material-ui/core';
import MoneyIcon from '@material-ui/icons/Money';
import CreditCardIcon from '@material-ui/icons/CreditCard';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  gridRoot: {
    flexGrow: '1'
  }
}));

const TrafficByDevice = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: [67, 33],
        backgroundColor: [colors.green[500], colors.orange[600]],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: ['Cash', 'Credit']
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const devices = [
    {
      title: 'Cash',
      value: 67,
      icon: MoneyIcon,
      color: colors.green[500]
    },
    {
      title: 'Credit',
      value: 33,
      icon: CreditCardIcon,
      color: colors.orange[600]
    }
  ];

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Monthly Earning" />
      <CardContent>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <Typography color="textPrimary" variant="body1">
              This Month
            </Typography>
            <Typography color="textPrimary" variant="body1">
              <strong>35,34,242</strong>
            </Typography>
          </Grid>
          <Grid item>
            <Box /* height={300} */ position="relative">
              <Doughnut data={data} options={options} />
            </Box>
            <Box display="flex" justifyContent="center" mt={2}>
              {devices.map(({ color, icon: Icon, title, value }) => (
                <Box key={title} p={1} textAlign="center">
                  <Icon color="action" />
                  <Typography color="textPrimary" variant="body1">
                    {title}
                  </Typography>
                  <Typography style={{ color }} variant="h2">
                    {value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <Box display="flex" ml={2}>
        <Typography color="primary" variant="caption">
          Total value of Earnings for the month of Dec 2020 in Rupees
        </Typography>
      </Box>
    </Card>
  );
};

TrafficByDevice.propTypes = {
  className: PropTypes.string
};

export default TrafficByDevice;
