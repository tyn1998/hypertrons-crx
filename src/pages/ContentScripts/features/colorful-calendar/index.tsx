import features from '../../../../feature-manager';
import waitFor from '../../../../helpers/wait-for';

import React from 'react';
import { render } from 'react-dom';
import { ColorPicker } from 'antd';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';

import './index.scss';

const featureId = features.getFeatureID(import.meta.url);

let colors = ['#ebedf0', '#ffedf9', '#ffc3eb', '#ff3ebf', '#c70085'];

const changeLevelColor = async (level: number, color: string) => {
  const root = document.documentElement;
  if (level === 0) {
    root.style.setProperty(`--color-calendar-graph-day-bg`, color);
  } else {
    root.style.setProperty(`--color-calendar-graph-day-L${level}-bg`, color);
  }
  // Save to storage
  const newColors = [...colors];
  newColors[level] = color;
  await chrome.storage.local.set({
    calendar_level_colors: newColors,
  });
};

const replaceLegendToColorPicker = async (
  level: number,
  defaultColor: string
) => {
  const legendSelector = `#contribution-graph-legend-level-${level}`;
  await waitFor(() => $(legendSelector).length > 0);
  const $legend = $(legendSelector);
  const container = $('<div></div>');
  render(
    <ColorPicker
      defaultValue={defaultColor}
      size="small"
      onChange={(color, hex) => changeLevelColor(level, hex)}
    />,
    container[0]
  );
  $legend.replaceWith(container);
};

const init = async (): Promise<void> => {
  // Load colors from storage
  colors =
    (await chrome.storage.local.get('calendar_level_colors'))[
      'calendar_level_colors'
    ] || colors;

  for (let i = 0; i < colors.length; i++) {
    changeLevelColor(i, colors[i]);
    replaceLegendToColorPicker(i, colors[i]);
  }
};

const restore = async () => {
  console.log('restore colorful-calendar');
};

features.add(featureId, {
  asLongAs: [pageDetect.isUserProfile],
  awaitDomReady: false,
  init,
  restore,
});
