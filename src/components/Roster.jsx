import React from 'react';
import PropTypes from 'prop-types';
import util from '../util';
import * as rosterStyles from '../styles/roster.module.css';

const Roster = ({data, rank, setImgPicked}) => (
  data[rank] ? (
    <ul
      className={rosterStyles.container}
      style={{
        backgroundColor: `${util.getColor(rank)}cc`,
      }}
    >
      {data[rank].map(({name, imageUrl}) => <li key={name}>
        <a
          href="#0"
          onClick={() => setImgPicked(imageUrl)}
          style={{
            textDecoration: 'none',
            color: rank === 'Black' ? '#FFF': '#000',
          }}
        >
          {name}
        </a>
      </li>)}
    </ul>
  ) : (<ul></ul>)
);
Roster.displayName = 'Roster';
Roster.propTypes = {
  rank: PropTypes.string,
  data: PropTypes.object,
  setImgPicked: PropTypes.func,
};

export default Roster;
