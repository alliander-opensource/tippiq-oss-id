import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

import { PlaceKeyForm } from '../../components';
import { Api } from '../../helpers';
import { configureStore } from '../../store';

const api = new Api();

describe('PlaceKey form component', () => {
  it('should render a placeKey form', () => {
    const store = configureStore({}, browserHistory, false, api);
    const renderer = renderIntoDocument(
      <Provider store={store} key="provider">
        <PlaceKeyForm onSubmit={() => {}} />
      </Provider>
    );

    return expect(renderer).toBeTruthy();
  });
});
