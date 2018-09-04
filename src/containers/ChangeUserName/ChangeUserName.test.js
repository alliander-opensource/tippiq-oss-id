import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { ChangeUserName } from './ChangeUserName';

test('Basic render snapshot test', () => {
  const component = shallow(<ChangeUserName
    getUserDisplayName={() => {}}
    getUserAttributes={() => {}}
    getUserAttribute={() => {}}
    createUserAttribute={() => {}}
    saveUserAttribute={() => {}}
    userAttributes={{}}
    userNameAttribute={{}}
  />);

  const tree = shallowToJson(component);
  expect(tree).toMatchSnapshot();
});

