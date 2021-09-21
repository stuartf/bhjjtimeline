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

const countBelts = (data) => Object.entries(data
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
    .sort((a, b) => getRankOrder(a.title) - getRankOrder(b.title));

export default {
  getColor,
  getRankOrder,
  formatText,
  countBelts,
};
