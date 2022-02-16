import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {main} from 'magica';
import {SpinnerDiamond} from 'spinners-react';

const getLineageImg = async (path) => {
  const elements = path.split('/');
  const file = elements[elements.length - 1];
  const result = await main({
    debug: true,
    command:
    'convert lineage-template.jpg ' +
    `\\( ${file} -gravity north -crop 640:578 -scale 640x578 \\) `+
    '-gravity northwest -composite out.jpg',
    inputFiles: [
      'https://dqybmc742m3hf.cloudfront.net/lineage-template.jpg',
      path,
    ],
  });
  console.log(result);
  return `data:image/png;base64,${btoa(
      String.fromCharCode(...result.outputFiles[0].content),
  )}`;
};

const Lineage = ({path}) => {
  const [image, setImage] = useState(null);
  useEffect(() => getLineageImg(path).then(setImage), []);
  return image ?
    <img src={image} style={{zIndex: 99}} /> :
    <SpinnerDiamond color='#ff101555' secondaryColor='#00000055' size='960' />;
};
Lineage.displayName = 'Lineage';
Lineage.propTypes = {
  path: PropTypes.string,
};

export default Lineage;
