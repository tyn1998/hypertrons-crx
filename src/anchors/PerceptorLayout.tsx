import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { isPerceptor, runsWhen } from '../utils/utils';
import PerceptorBase from './PerceptorBase';
import PerceptorLayoutView from '../views/PerceptorLayout';

@runsWhen([isPerceptor])
class PerceptorLayout extends PerceptorBase {
  public async run(): Promise<void> {
    // remove the original container
    const parentContainer = $('#repo-content-pjax-container').children(
      'div.clearfix.container-xl'
    );
    parentContainer.children('div.Layout').remove();

    // create the new one : percepter container
    const percepterContainer = document.createElement('div');
    percepterContainer.setAttribute('id', 'perceptor-layout');

    render(<PerceptorLayoutView />, percepterContainer);
    parentContainer.append(percepterContainer);
  }
}

export default PerceptorLayout;
