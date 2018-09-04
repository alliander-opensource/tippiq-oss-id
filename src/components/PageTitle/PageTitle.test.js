import React from 'react';
import renderer from 'react-test-renderer';
import Element from './PageTitle';

test('with plain text title', () => {
  const component = renderer.create(
    <Element>Title</Element>
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});

test('with nested elements in title', () => {
  const component = renderer.create(
    <Element>Title <span>with</span> nesting</Element>
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});

test('with id', () => {
  const component = renderer.create(
    <Element id="test-id">Title</Element>
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});

test('with null id', () => {
  const component = renderer.create(
    <Element id={null}>Title</Element>
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
