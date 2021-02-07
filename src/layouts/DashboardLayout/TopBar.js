import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import InputIcon from '@material-ui/icons/Input';
import Logo from 'src/components/Logo';
import UpdateProfileDialog from '../../views/dialog/UpdateProfileDialog';
import UserSettingsDialog from '../../views/dialog/UserSettingsDialog';
import Dialog from '@material-ui/core/Dialog';
import db from '../../firebase';

import { useAuth } from '../../contexts/AuthContext';

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  }
}));

const TopBar = ({ className, onMobileNavOpen, userData, ...rest }) => {
  const classes = useStyles();
  const [notifications] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const { currentUser } = useAuth();

  const handleClickUpdateProfileOpen = () => {
    setOpenUpdate(true);
    console.log(userData);
  };

  const handleClickUpdateSettingsOpen = () => {
    setOpenSettings(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await logout();
      navigate('/login', { replace: true });
    } catch {
      console.log('Failed to log out');
    }
  }

  return (
    <div>
      <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
        <Toolbar>
          <Logo />

          <Box flexGrow={1} />
          {/* <Hidden mdDown> */}
          {userData && userData.isOwner && (
            <IconButton color="inherit">
              <Badge
                badgeContent={notifications.length}
                color="primary"
                variant="dot"
              >
                <SettingsIcon onClick={handleClickUpdateSettingsOpen} />
              </Badge>
            </IconButton>
          )}
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <PersonOutlineIcon onClick={handleClickUpdateProfileOpen} />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <InputIcon onClick={handleSubmit} />
          </IconButton>
          {/* </Hidden> */}
          {/* <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden> */}
        </Toolbar>
      </AppBar>
      <div>
        {openUpdate && (
          <Dialog
            open={openUpdate}
            onClose={handleCloseUpdate}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            maxWidth={'sm'}
          >
            <UpdateProfileDialog
              userData={userData}
              closeOrder={handleCloseUpdate}
            ></UpdateProfileDialog>
          </Dialog>
        )}
      </div>
      <div>
        {openSettings && (
          <Dialog
            open={openSettings}
            onClose={handleCloseSettings}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            maxWidth={'sm'}
          >
            <UserSettingsDialog
              userData={userData}
              price={0}
              closeOrder={handleCloseSettings}
            ></UserSettingsDialog>
          </Dialog>
        )}
      </div>
    </div>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
