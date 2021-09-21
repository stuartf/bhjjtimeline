import React from 'react';
import RITimeline from 'react-image-timeline';
import 'react-image-timeline/dist/timeline.css';
import '../styles/timeline.css';
import PropTypes from 'prop-types';

const customFooter = (props) => <div/>;

const Timeline = (props) => (
  <RITimeline
    events={props.events}
    customComponents={{footer: customFooter}}
  />
);
Timeline.propTypes = {
  events: PropTypes.object,
};

export default Timeline;
