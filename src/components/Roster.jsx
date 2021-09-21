import React from 'react';
import PropTypes from 'prop-types';
import util from '../util';
import * as rosterStyles from '../styles/roster.module.css';

const Roster = ({data, rank}) => (
  data[rank] ? (
    <ul
      className={rosterStyles.container}
      style={{
        backgroundColor: `${util.getColor(rank)}cc`,
        color: rank === 'Black' ? '#FFF': '#000',
      }}
    >
      {data[rank].map((name) => <li key={name}>{name}</li>)}
    </ul>
  ) : (<ul></ul>)
);
Roster.displayName = 'Roster';
Roster.propTypes = {
  rank: PropTypes.string,
  data: PropTypes.object,
};

export default Roster;
