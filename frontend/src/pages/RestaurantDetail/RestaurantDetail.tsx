import React, { useEffect, useState } from "react";
import { useTheme } from "react-jss";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { useQuery } from "@apollo/client";

import { AppTheme } from "../../common/theming/theming.types";
import HeroImage from "../../components/HeroImage";
import MapView from "../../components/MapView";
import {
  NibbleCollectionAvailable,
  NibbleCollectionReserved
} from "../../components/NibbleCollection";
import SectionHeader from "../../components/SectionHeader";
import {
  NibbleReservedInfoFragment,
  RestaurantInfoQuery,
  RestaurantInfoQueryVariables,
  UserInfoQuery,
  UserInfoQueryVariables
} from "../../graphql/generated/types";
import { RESTAURANT_INFO, USER_INFO } from "../../graphql/queries";
import { MessageType, showMessage } from "../../redux/actions";
import { useStyles } from "./RestaurantDetail.style";

const RestaurantDetail = () => {
  const classes = useStyles();
  let { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const appTheme = useTheme() as AppTheme;

  const { loading, error, data } = useQuery<
    RestaurantInfoQuery,
    RestaurantInfoQueryVariables
  >(RESTAURANT_INFO, {
    variables: { restaurantId: id },
  });
  const { data: userData } = useQuery<UserInfoQuery, UserInfoQueryVariables>(USER_INFO);
  const [userReservedNibbles, setUserReservedNibbles] = useState<
    NibbleReservedInfoFragment[]
  >([]);
  const [noneReserved, setNoneReserved] = useState(false);

  // redirect on error
  useEffect(() => {
    if (error) {
      console.log(`Error getting restaurant info: ${error.message}.`);
      history.push("/");
      dispatch(
        showMessage(
          `Error getting restaurant info: ${error.message}.`,
          MessageType.Error
        )
      );
    }
  }, [error, dispatch, history]);

  // filter which of nibbles are reserved by user
  useEffect(() => {
    if (userData) {
      // recheck if user has reserved any
      setNoneReserved(
        !userData.userInfo.nibblesReserved.some((nibble) => nibble.restaurant.id === id)
      );
      if (noneReserved) {
        return;
      } else if (userReservedNibbles.length === 0) {
        // user has reserved some, but we haven't set state yet
        setUserReservedNibbles(
          userData.userInfo.nibblesReserved.filter(
            (nibble) => nibble.restaurant.id === id
          )
        );
      }
    }
  }, [userReservedNibbles, noneReserved, userData, id]);

  return (
    <div className={classes.mainContent}>
      {loading || error ? (
        <HeroImage loading />
      ) : (
        data && (
          <div>
            <HeroImage location={data.restaurantInfo.heroUrl} />
            <div className={classes.fixedContainer}>
              <div className={classes.detailsContainer}>
                <h1 className={classes.name}>{data.restaurantInfo.name}</h1>
                <div className={classes.addressContainer}>
                  <div className={classes.address}>
                    <h3>{data.restaurantInfo.address.streetAddress}</h3>
                    <h3>{`${data.restaurantInfo.address.locality}, ${data.restaurantInfo.address.administrativeArea} ${data.restaurantInfo.address.postalCode}`}</h3>
                  </div>
                  <a
                    className={classes.navigate}
                    href={`https://www.google.com/maps/dir/?api=1&destination=${data.restaurantInfo.address.location.latitude},${data.restaurantInfo.address.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className={"material-icons-outlined"}>navigation</i>
                    <p>Navigate</p>
                  </a>
                </div>
                <p className={classes.description}>{data.restaurantInfo.description}</p>
              </div>
            </div>
            {userReservedNibbles.length > 0 && (
              <div className={classes.nibbleCollection}>
                <SectionHeader name={"Reserved Nibbles"} color={appTheme.color.blue} />
                <NibbleCollectionReserved nibbles={userReservedNibbles} />
              </div>
            )}
            {data.restaurantInfo.nibblesAvailable.length > 0 && (
              <div className={classes.nibbleCollection}>
                <SectionHeader
                  name={"Available Nibbles"}
                  color={appTheme.color.green}
                />
                <NibbleCollectionAvailable
                  nibbles={data.restaurantInfo.nibblesAvailable.map(
                    ({ restaurant, ...rest }) => ({
                      restaurant: { distance: undefined, ...restaurant },
                      ...rest,
                    })
                  )}
                />
              </div>
            )}
            <MapView pins={[data.restaurantInfo]} height={"40vh"} />
            {data.restaurantInfo.disclaimer && (
              <div className={classes.fixedContainer}>
                <p className={classes.disclaimer}>{data.restaurantInfo.disclaimer}</p>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default RestaurantDetail;
