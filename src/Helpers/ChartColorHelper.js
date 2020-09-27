import colors from "../Constants/ChartColors";
import _  from 'lodash';

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

export const getChartColors = (pointsData, managers) => {
    let backgroundColors = {};
    let colorCopy = [...colors];

    for(let i = 0; i < managers.length; i++) {
        if(!backgroundColors[managers[i]]) {
          let indexToRemove = getRandomInt(colorCopy.length - 1);
          let color = colorCopy[indexToRemove];
          colorCopy = _.remove(colorCopy, function (x, y) {
            return y !== indexToRemove;
          });
          backgroundColors[managers[i]] = color;
        }
    }
    
    return backgroundColors;
  }