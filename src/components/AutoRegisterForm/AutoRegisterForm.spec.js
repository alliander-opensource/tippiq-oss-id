import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

import { AutoRegisterForm } from '../../components';
import { Api } from '../../helpers';
import { configureStore } from '../../store';

const api = new Api();

describe('Autoregister form component', () => {
  it('should render an autoregister form', () => {
    const store = configureStore({}, browserHistory, false, api);
    const renderer = renderIntoDocument(
      <Provider store={store} key="provider">
        <AutoRegisterForm onSubmit={() => {}} initialValues={{}} loginUrl="/" />
      </Provider>
    );

    return expect(renderer).toBeTruthy();
  });
});
