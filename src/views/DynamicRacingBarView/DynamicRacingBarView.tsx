import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { utils } from 'github-url-detection';
import {
  Stack,
  Dropdown,
  IDropdownStyles,
  IDropdownOption,
  Spinner,
} from '@fluentui/react';
import { isPerceptor, runsWhen } from '../../utils/utils';
import { getGithubTheme, getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import ErrorPage from '../../components/ExceptionPage/ErrorPage';
import DynamicRacingBar from '../../components/DynamicRacingBar/DynamicRacingBar';

interface ContributorsActivityEvolutionProps {
  currentRepo: string;
  graphType: GraphType;
}

const DynamicRacingBarView: React.FC<ContributorsActivityEvolutionProps> = ({
  currentRepo,
}) => {
  const [repoPeriod, setRepoPeriod] = useState<string | number | undefined>(
    180
  );
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [statusCode, setStatusCode] = useState<number>(200);

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setInited(true);
    };
    if (!inited) {
      initSettings();
    }
  }, [inited, settings]);

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 120 },
  };

  const periodOptions: IDropdownOption[] = [
    {
      key: 180,
      text: `180 ${getMessageByLocale('global_day', settings.locale)}`,
    },
  ];

  const onRenderPeriodDropdownTitle = (
    options: IDropdownOption[] | undefined
  ): JSX.Element => {
    const option = options![0];
    return (
      <div>
        <span>{getMessageByLocale('global_period', settings.locale)}: </span>
        <span>{option!.text}</span>
      </div>
    );
  };

  const onRepoPeriodChange = (
    e: any,
    option: IDropdownOption | undefined
  ): void => {
    setRepoPeriod(option!.key);
  };

  if (statusCode !== 200) {
    return <ErrorPage errorCode={statusCode} />;
  }

  return (
    <div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <Stack className="hypertrons-crx-title">
          <span>
            {getMessageByLocale(
              'component_contributorsActivityEvolution_title',
              settings.locale
            )}
          </span>
          <div className="hypertrons-crx-title-extra">
            <Dropdown
              defaultSelectedKey={repoPeriod}
              options={periodOptions}
              styles={dropdownStyles}
              onRenderTitle={onRenderPeriodDropdownTitle}
              onChange={onRepoPeriodChange}
            />
          </div>
        </Stack>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <Stack className="hypertrons-crx-border">
                <Stack.Item align="center">
                  {/* <DynamicRacingBar theme={getGithubTheme} width={700} height={600} barNumber={20} digitNumber={2} duration={20} dateLabelSize={30} dataUrl={`${API_TARGET}/dynamicbar_activities_v2/latest/${currentRepo}.csv`}/> */}
                  <DynamicRacingBar
                    height={0}
                    legend1={''}
                    legend2={''}
                    yName1={''}
                    yName2={''}
                    data1={[]}
                    data2={[]}
                  />
                </Stack.Item>
              </Stack>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div
              className="color-text-secondary"
              style={{ marginLeft: '55px' }}
            >
              <ul style={{ margin: '0px 0 10px 15px' }}>
                <li>
                  {getMessageByLocale(
                    'component_contributorsActivityEvolution_description_1',
                    settings.locale
                  )}
                </li>
                <br />
                <li>
                  {getMessageByLocale(
                    'component_contributorsActivityEvolution_description_2',
                    settings.locale
                  )}
                </li>
                <br />
                <li>
                  {getMessageByLocale(
                    'component_contributorsActivityEvolution_description_3',
                    settings.locale
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicRacingBarView;
