import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

import { AutoRegisterPrefilled } from '../../components';
import { Api } from '../../helpers';
import { configureStore } from '../../store';

const api = new Api();

describe('Autoregister prefilled form component', () => {
  it('should render an autoregister prefilled form', () => {
    const store = configureStore({}, browserHistory, false, api);
    const renderer = renderIntoDocument(
      <Provider store={store} key="provider">
        <AutoRegisterPrefilled
          onSubmit={() => {}}
          initialValues={{}}
          email="x@x.com"
          loginUrl="/"
          registerUrl="/"
        />
      </Provider>
    );

    return expect(renderer).toBeTruthy();
  });
});
