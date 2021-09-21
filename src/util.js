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

const getRankOrder = (color) => {
  switch (color) {
    case 'Grey':
      return 0;
    case 'Yellow':
      return 1;
    case 'Orange':
      return 2;
    case 'Green':
      return 3;
    case 'Blue':
      return 4;
    case 'Purple':
      return 5;
    case 'Brown':
      return 6;
    case 'Black':
      return 7;
    case 'Degree':
      return 8;
  }
};

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

const normalizeRank = (rank) => {
  if (rank.slice(0, 5) === 'Black') {
    return 'Black';
  }
  return rank;
};

const countBelts = (data) => Object.entries(data
    .map((datum) => datum.promotions
        .reduce((acc, {rank}) => {
          rank = normalizeRank(rank);
          if (rank !== 'Join') {
            acc[rank] ? acc[rank] += 1: acc[rank] = 1;
          }
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
    .sort((a, b) => getRankOrder(a.title) - getRankOrder(b.title));

const getNamesByRank = (data) =>
  Object.entries(data
      // Get an array of all promotions ignoring dates
      .map((datum) => datum.promotions)
      .flat()
      // Transform it to an Object with names as keys and
      // Array of ranks achieved as values
      .reduce((acc, cur) => {
        const rank = normalizeRank(cur.rank);
        if (rank !== 'Join') {
          acc[cur.name] ? acc[cur.name].push(rank): acc[cur.name] = [rank];
        }
        return acc;
      }, {}))
      // Reduce the ranks achieved to just the highest value
      .map(([name, ranks]) => [
        name,
        ranks.reduce((acc, rank) =>
          getRankOrder(acc) > getRankOrder(rank) ? acc: rank),
      ])
      // Transform to an Object where key is highest rank achieved
      // and value is Array of names
      .reduce((acc, [name, rank]) => {
        acc[rank] ? acc[rank].push(name): acc[rank] = [name];
        return acc;
      }, {});

export default {
  getColor,
  getRankOrder,
  formatText,
  countBelts,
  getNamesByRank,
};
