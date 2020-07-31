import React from "react";
import { connect, useDispatch } from "react-redux";

import Fade from "@material-ui/core/Fade";
import Snackbar from "@material-ui/core/Snackbar";

import { hideMessage, MessageType } from "../../redux/actions";
import { RootState } from "../../redux/reducers";
import { useStyles } from "./NotificationBar.style";
import { NotificationBarProps } from "./NotificationBar.types";

export const NotificationBarWithoutConnect = (props: NotificationBarProps) => {
  const dispatch = useDispatch();
  const classes = useStyles(props.messageType);
  return (
    <Snackbar
      open={props.messageType !== MessageType.None}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={6000}
      onClose={() => dispatch(hideMessage())}
      message={props.message}
      classes={{ root: classes.bar }}
      TransitionComponent={Fade}
    />
  );
};

const mapStateToProps = (state: RootState) => ({ ...state.message });

export default connect(mapStateToProps)(NotificationBarWithoutConnect);
