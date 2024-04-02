import features from '../../../../feature-manager';
import waitFor from '../../../../helpers/wait-for';

import React from 'react';
import { render } from 'react-dom';
import { ColorPicker } from 'antd';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';

import './index.scss';

const featureId = features.getFeatureID(import.meta.url);

const CALENDAR_LEVEL_COLORS = [
  '#ebedf0',
  '#ffedf9',
  '#ffc3eb',
  '#ff3ebf',
  '#c70085',
];

const changeLevelColor = (level: number, color: string) => {
  const root = document.documentElement;
  root.style.setProperty(`--color-calendar-graph-day-L${level}-bg`, color);
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
  for (let i = 0; i < CALENDAR_LEVEL_COLORS.length; i++) {
    changeLevelColor(i, CALENDAR_LEVEL_COLORS[i]);
    await replaceLegendToColorPicker(i, CALENDAR_LEVEL_COLORS[i]);
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
