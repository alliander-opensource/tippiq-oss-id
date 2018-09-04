import React from 'react';
import renderer from 'react-test-renderer';
import Element from './CookieWall';

test('Renders', () => {
  const component = renderer.create(
    <Element>
      <p>Text<a>Link</a></p>
      <button>Akkoord</button>
    </Element>
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
