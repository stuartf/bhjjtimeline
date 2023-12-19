import React, {useEffect, useState} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import {PieChart} from 'react-minimal-pie-chart';
import {Popover} from 'react-tiny-popover';
import util from '../util';
import Roster from '../components/Roster';
import Timeline from '../components/Timeline';
import {SEO} from '../components/seo';
import '../styles/index.css';

// The lineage component doesn't work with ssr
const Lineage = React.lazy(() => import('../components/Lineage'));

/**
 * @return {Component}
 */
export default function Home() {
  const isSSR = typeof window === 'undefined';

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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [rosterPicked, setRosterPicked] = useState(null);
  const [isImgOpen, setIsImgOpen] = useState(false);
  const [imgPicked, setImgPicked] = useState(null);

  // Update the entries in the timeline to match the search when it changes
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

  useEffect(() => {
    setRosterPicked(null);
  }, [isImgOpen]);

  useEffect(() => {
    setIsImgOpen(imgPicked !== null);
  }, [imgPicked]);

  // Open the popover whenever the user changes the roster they're looking at
  useEffect(() => {
    setIsPopoverOpen(rosterPicked !== null);
  }, [rosterPicked]);

  const roster = util.getNamesByRank(data);

  const handlePie = (e, segmentIndex) => {
    const picked = beltCount[segmentIndex].title;
    isPopoverOpen && rosterPicked === picked?
      setRosterPicked(null):
      setRosterPicked(picked);
  };

  const beltCount = util.countBelts(data);

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
      <div id='beltCount'>
        <PieChart
          data={beltCount}
          label={({dataEntry}) => dataEntry.value > 5 ? dataEntry.value: null}
          labelStyle={{fontFamily: 'Open Sans, sans-serif', fontSize: '10px'}}
          paddingAngle={2}
          labelPosition={75}
          lineWidth={50}
          onClick={handlePie}
        />
        <Popover
          isOpen={isPopoverOpen}
          positions={['bottom', 'left']}
          content={<Roster
            data={roster}
            rank={rosterPicked}
            setImgPicked={setImgPicked}
          />}
          onClickOutside={() => setIsPopoverOpen(false)}
        >
          <div>
            The numbers above represent the total number of belts awarded at
            each rank. Click a section to see everyone currently at that rank.
          </div>
        </Popover>
        {!isSSR && (
          <React.Suspense fallback={<span />}>
            <Popover
              isOpen={isImgOpen}
              positions={['top', 'left']}
              content={<Lineage path={imgPicked} />}
              onClickOutside={() => setIsImgOpen(false)}
              contentLocation={() => ({
                top: window.innerHeight/2 - 480 + window.scrollY,
                left: window.innerWidth/2 - 480,
              })}
            >
              <span />
            </Popover>
          </React.Suspense>
        )}
      </div>
    </div>
    {events.length > 0 ?
    <Timeline events={events} /> :
    <p>No matching events!</p>}
  </>;
}

export const Head = () => <SEO />;
