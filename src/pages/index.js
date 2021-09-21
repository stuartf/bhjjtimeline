import React, {useEffect, useState} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import Timeline from 'react-image-timeline';
import {PieChart} from 'react-minimal-pie-chart';
import 'react-image-timeline/dist/timeline.css';
import '../styles/index.css';

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

  const getColor = (color) => {
    switch (color) {
      case 'Blue':
        return '#87CEFA';
      case 'Purple':
        return '#663399';
      case 'Brown':
        return '#A0522D';
      case 'Black':
        return '#000000';
      case 'Degree':
        return '#8B0000';
      case 'Grey':
        return '#808080';
      case 'Yellow':
        return '#FFD700';
      case 'Orange':
        return '#FFA500';
      case 'Green':
        return '#228B22';
    }
  };

  const [events, setEvents] = useState(data);
  const [filter, setFilter] = useState('');
  const beltCount = Object.entries(data
      .map((datum) => datum.promotions
          .reduce((acc, {rank}) => {
            if (rank === 'Join') {
              return acc;
            }
            if (rank !== 'Black' && rank.slice(0, 5) === 'Black') {
              acc.Degree ? acc.Degree += 1: acc.Degree = 1;
              return acc;
            }
            acc[rank] ? acc[rank] += 1: acc[rank] = 1;
            return acc;
          }, {},
          ),
      )
      .reduce((acc, cur) => {
        Object.entries(cur)
            .forEach(([rank, count]) => {
            acc[rank] ?
              acc[rank] += count :
              acc[rank] = count;
            });
        return acc;
      }, {}))
      .map(([title, value]) => ({
        title,
        value,
        color: getColor(title),
      }))
      .sort((a, b) => a.value - b.value);

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
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'Open Sans, sans-serif',
    }}>
      <span style={{padding: '1em'}}>
        <label htmlFor="search" style={{paddingRight: '.5em'}}>Search:</label>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          id="search"
          name="search"
          size="10"
        />
      </span>
      <span style={{padding: '1em', maxWidth: '15%'}}>
        <PieChart
          data={beltCount}
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
