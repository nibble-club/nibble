import { createUseStyles } from "react-jss";

import { AppTheme } from "../../common/theming.types";
import { MessageType } from "../../redux/actions";

const getColorForMessageType = (messageType: MessageType, appTheme: AppTheme) => {
  switch (messageType) {
    case MessageType.Error:
      return appTheme.color.text.alert;
    case MessageType.Warning:
      return appTheme.color.text.warn;
    case MessageType.Success:
      return appTheme.color.green;
    case MessageType.Information:
      return appTheme.color.blue;
    default:
      return appTheme.color.background;
  }
};

export const useStyles = createUseStyles((theme: AppTheme) => ({
  bar: {
    "& .MuiPaper-root": {
      fontFamily: '"Baloo 2"',
      fontSize: theme.fontSizes.medium,
      backgroundColor: messageType => getColorForMessageType(messageType, theme),
      textShadow: theme.shadow[0],
    },
  },
}));
