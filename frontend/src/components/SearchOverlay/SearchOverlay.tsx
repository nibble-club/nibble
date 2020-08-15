import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ContentLoader from "react-content-loader";
import { useTheme } from "react-jss";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { useLazyQuery } from "@apollo/client";
import MomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { AppTheme } from "../../common/theming/theming.types";
import {
  RecentSearchesQuery,
  RecentSearchesQueryVariables,
  SearchParameters
} from "../../graphql/generated/types";
import { RECENT_SEARCHES } from "../../graphql/queries";
import { hideSearch } from "../../redux/actions";
import { RootState } from "../../redux/reducers";
import DistanceSelector from "../DistanceSelector";
import WithOverlay from "../WithOverlay";
import { useBoxStyles, useStyles } from "./SearchOverlay.style";
import { SearchOverlayProps, SelectorBoxProps } from "./SearchOverlay.types";

const MAX_SEARCH_DISTANCE = 10; // miles

/**
 * Hook that hides search on clicks outside of the passed ref; credit to
 * https://stackoverflow.com/a/42234988/4932372
 */
const useOutsideClickAlerter = (
  refs: React.MutableRefObject<HTMLDivElement | null>[],
  callback: () => void
) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        refs.every((ref) => ref.current && !ref.current.contains(event.target as Node))
      ) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
};

const SelectorBox = (props: SelectorBoxProps) => {
  const [show, setShow] = useState(false);
  const classes = useBoxStyles();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const onOutsideClickHandler = useCallback(() => {
    setShow(false);
  }, []);
  useOutsideClickAlerter([modalRef], onOutsideClickHandler);

  return (
    <div>
      <WithOverlay show={show}>
        <div className={classes.selectorContent} ref={modalRef}>
          {props.children}
          <button
            onClick={() => {
              setShow(false);
            }}
            className={classes.okButton}
          >
            {props.value === "any" ? "Cancel" : "OK"}
          </button>
        </div>
      </WithOverlay>

      <div
        className={classes.box}
        onClick={() => {
          setShow(true);
        }}
      >
        <span className={classes.label}>{props.label}</span>
        <span className={classes.value}>{props.value} </span>
      </div>
    </div>
  );
};

export const SearchOverlayWithoutConnect = (props: SearchOverlayProps) => {
  const classes = useStyles(props);
  const appTheme = useTheme() as AppTheme;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const onOutsideClickCallback = useCallback(() => {
    if (props.show) {
      dispatch(hideSearch());
    }
  }, [dispatch, props.show]);
  useOutsideClickAlerter([containerRef, props.headerRef], onOutsideClickCallback);
  const [fetchRecentSearches, { data: recentSearches, refetch, called }] = useLazyQuery<
    RecentSearchesQuery,
    RecentSearchesQueryVariables
  >(RECENT_SEARCHES);
  const [reducedRecentSearches, setReducedRecentSearches] = useState<
    SearchParameters[]
  >([]);

  // refetch recents on search open
  useEffect(() => {
    if (props.show && called && refetch) {
      refetch();
    } else if (props.show) {
      fetchRecentSearches();
    }
  }, [props.show, called, fetchRecentSearches, refetch]);

  // reduce recents to remove repeats
  useEffect(() => {
    if (recentSearches) {
      setReducedRecentSearches(
        recentSearches.recentSearches.reduce((acc: SearchParameters[], cur) => {
          if (acc.length === 0 || acc[acc.length - 1].text !== cur.text) {
            acc.push(cur);
          }
          return acc;
        }, [])
      );
    }
  }, [recentSearches]);

  return (
    <div className={classes.container} ref={containerRef}>
      <div className={classes.selectors}>
        <SelectorBox
          label={"Max distance:"}
          value={props.maxDistance ? `${props.maxDistance.toFixed(1)} miles` : "any"}
        >
          <DistanceSelector
            max={MAX_SEARCH_DISTANCE}
            onDistanceChange={(distance) => props.setMaxDistance(distance)}
          />
        </SelectorBox>
        <SelectorBox
          label={"Pickup after:"}
          value={
            props.pickupAfter
              ? props.pickupAfter.calendar({ sameDay: "h:mm a" })
              : "any"
          }
        >
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DateTimePicker
              value={props.pickupAfter}
              initialFocusedDate={moment().startOf("hour").add(5, "hours")}
              onChange={(time) => props.setPickupAfter(time)}
              variant="static"
              openTo="hours"
              minutesStep={15}
              autoOk
              disablePast
            />
          </MuiPickersUtilsProvider>
        </SelectorBox>
      </div>
      <div className={classes.history}>
        {recentSearches ? (
          reducedRecentSearches.length > 0 && (
            <div>
              <h3 className={classes.header}>Recent searches</h3>
              {reducedRecentSearches.map((search, index) => (
                <Link
                  to={{
                    pathname: `/search`,
                    search:
                      `query=${search.text}` +
                      (search.maxDistance ? `&maxDistance=${search.maxDistance}` : ""),
                  }}
                  key={index}
                >
                  <div className={classes.historyItem}>
                    <p>{search.text}</p>
                    {search.maxDistance && (
                      <span>{`(${search.maxDistance} miles)`}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          <div>
            <h3 className={classes.header}>Recent searches</h3>
            {Array.from({ length: 5 }).map((_, index) => (
              <ContentLoader
                key={index}
                animate={true}
                backgroundColor={appTheme.color.card[0]}
                foregroundColor={appTheme.color.card[1]}
                speed={2}
                className={classes.loading}
              >
                <rect
                  x={0}
                  y={0}
                  width={200}
                  height={20}
                  rx={appTheme.rounding.hard}
                  ry={appTheme.rounding.hard}
                />
              </ContentLoader>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({ ...state.search });

export default connect(mapStateToProps)(SearchOverlayWithoutConnect);
