import React, {useEffect, useState} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import Timeline from 'react-image-timeline';
import {PieChart} from 'react-minimal-pie-chart';
import util from '../util';
import 'react-image-timeline/dist/timeline.css';
import '../styles/index.css';

/**
 * @return {Component}
 */
export default function Home() {
  const customFooter = (props) => <div/>;

  const data = useStaticQuery(graphql`
    query promotions {
      allBhjjJson {
        edges {
          node {
            photo
            promotions {
              name
              rank
            }
            date
          }
        }
      }
    }
  `).allBhjjJson.edges.map((node) => (
    {
      ...node.node,
      date: new Date(node.node.date),
      title: util.formatText(node.node.promotions),
      imageUrl: `https://dqybmc742m3hf.cloudfront.net/${node.node.photo}`,
    }
  ));

  const [events, setEvents] = useState(data);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    filter === '' ? setEvents(data) :
      setEvents(data.filter((datum) =>
        datum.promotions
            .map((promo) => promo.name)
            .join(' ')
            .toLowerCase()
            .includes(filter.toLowerCase()),
      ));
  }, [filter]);

  return <>
    <div className='header'>
      <span>
        <label htmlFor="search">Search:</label>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          id="search"
          name="search"
          size="10"
        />
      </span>
      <span id='beltCount'>
        <PieChart
          data={util.countBelts(data)}
          label={({dataEntry}) => dataEntry.value > 5 ? dataEntry.value: null}
          labelStyle={{fontFamily: 'Open Sans, sans-serif', fontSize: '10px'}}
          paddingAngle={2}
          labelPosition={75}
          lineWidth={50}
        />
      </span>
    </div>
    {events.length > 0 ?
    <Timeline
      events={events}
      customComponents={{footer: customFooter}}
    /> :
    <p>No matching events!</p>}
  </>;
}
