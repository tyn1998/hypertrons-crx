import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const COLORS = {
  FG_COLOR: '#c9d1d9',
  BG_COLOR: '#0d1118',
  SPLIT_LINE: 'grey',
  PALLET: ['green', '#f78166'],
};

interface IssueChartProps {
  width: number;
  height: number;
  data: any;
}

const IssueChart: React.FC<IssueChartProps> = (props) => {
  const { width, height, data } = props;

  const divEL = useRef(null);

  const option: echarts.EChartsOption = {
    color: COLORS.PALLET,
    title: {
      text: 'Open Issue Event & Issue Comment Event',
      textStyle: {
        fontSize: 14,
        color: COLORS.FG_COLOR,
      },
    },
    legend: {
      show: true,
      top: '10%',
      textStyle: {
        color: COLORS.FG_COLOR,
      },
    },
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: COLORS.FG_COLOR,
      },
      backgroundColor: COLORS.BG_COLOR,
    },
    grid: {
      top: '25%',
      left: '12%',
      width: '85%',
      height: '60%',
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: COLORS.FG_COLOR,
      },
    },
    yAxis: [
      {
        type: 'value',
        position: 'left',
        axisLabel: {
          color: COLORS.FG_COLOR,
          formatter: formatNum,
        },
        splitLine: {
          lineStyle: {
            color: COLORS.SPLIT_LINE,
          },
        },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        minValueSpan: 3600 * 24 * 1000 * 180,
      },
    ],
    series: [
      {
        name: 'oi',
        type: 'line',
        symbol: 'none',
        data: data.oi,
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 0,
      },
      {
        name: 'ic',
        type: 'line',
        symbol: 'none',
        data: data.ic,
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 0,
      },
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx: any) {
      return idx * 5;
    },
  };

  useEffect(() => {
    let chartDOM = divEL.current;
    const instance = echarts.init(chartDOM as any);

    return () => {
      instance.dispose();
    };
  }, []);

  useEffect(() => {
    let chartDOM = divEL.current;
    const instance = echarts.getInstanceByDom(chartDOM as any);
    if (instance) {
      instance.setOption(option);
    }
  }, []);

  return <div ref={divEL} style={{ width, height }}></div>;
};

const formatNum = (num: number, index: number) => {
  let si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
  ];
  let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(2).replace(rx, '$1') + si[i].symbol;
};

export default IssueChart;
