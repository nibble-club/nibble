import React, { useEffect, useRef, useState } from "react";
import { Background, Parallax } from "react-parallax";

import S3Image from "../S3Image";
import { useStyles } from "./HeroImage.style";
import { HeroImageProps } from "./HeroImage.types";

export const PARALLAX_STRENGTH = 300;
const ASPECT_RATIO = 1.5;

const HeroImage = (props: HeroImageProps) => {
  // assumes 3:2 aspect ratio for root image (should be enforced on upload)
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const heightRef = useRef<HTMLDivElement | null>(null);

  const resizeHandler = () => {
    if (heightRef.current) {
      setHeight(heightRef.current.clientHeight);
      setWidth(heightRef.current.clientWidth);
    }
  };

  useEffect(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [heightRef]);

  // calculate necessary height; assumes 3:2 aspect ratio for underlying image
  const origImageHeight = height + PARALLAX_STRENGTH;
  let imageHeight = origImageHeight;
  if (imageHeight * ASPECT_RATIO < width) {
    imageHeight = width / ASPECT_RATIO;
  }

  const classes = useStyles({
    imageHeight,
    imageMargin: (origImageHeight - imageHeight) / 2,
  });

  return (
    <div ref={heightRef} className={classes.container}>
      <Parallax strength={PARALLAX_STRENGTH}>
        <div className={classes.hero} />
        <Background>
          <S3Image location={props.location} alt={"Hero"} className={classes.image} />
        </Background>
      </Parallax>
    </div>
  );
};

export default HeroImage;
