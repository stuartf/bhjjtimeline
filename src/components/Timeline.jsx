import React, {useState} from 'react';
import RITimeline from 'react-image-timeline';
import 'react-image-timeline/dist/timeline.css';
import '../styles/timeline.css';
import PropTypes from 'prop-types';

const customFooter = (props) => <div/>;

const Timeline = (props) => {
  const [reverse, setReverse] = useState(false);

  return <>
    <button type="button" onClick={() => setReverse(!reverse)}>
      Reverse Order
    </button>
    <RITimeline
      events={props.events}
      customComponents={{footer: customFooter}}
      reverseOrder={reverse}
    />
  </>;
};
Timeline.propTypes = {
  events: PropTypes.array,
};

export default Timeline;
