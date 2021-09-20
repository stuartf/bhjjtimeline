import React, {useEffect, useState} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import Timeline from 'react-image-timeline';
require('react-image-timeline/dist/timeline.css');

/**
 * @return {Component}
 */
export default function Home() {
  const formatText = (entries) =>
    Object.entries(
        entries.reduce((acc, cur) => {
          acc[cur.rank] = acc[cur.rank] ?
          acc[cur.rank].concat(cur.name) :
          acc[cur.rank] = [cur.name];
          return acc;
        }, {}))
        .map(([rank, names]) => {
          return names.join(' and ') + (rank === 'Join' ?
            ` Join${names.length > 1 ? '' : 's'}` :
            ` Promoted to ${rank}`);
        }).join('; ');

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
      title: formatText(node.node.promotions),
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
    <label htmlFor="search">Search:</label>
    <input
      type="text"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      id="search"
      name="search"
      size="10"
    />
    {events.length > 0 ?
    <Timeline
      events={events}
      customComponents={{footer: customFooter}}
    /> :
    <p>No matching events!</p>}
  </>;
}
