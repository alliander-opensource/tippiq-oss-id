/**
 * Styleguide container.
 * @module components/Styleguide
 */
import React from 'react';
import Helmet from 'react-helmet';
import { Panel, Button, Grid, Row, Col } from 'react-bootstrap';
import {
  Field,
  Spinner,
  AccountMenu,
  PlaceKeyForm,
  ChangeUserNameForm,
  ChangeEmailForm,
  ChangePasswordForm,
  SetupPasswordAndNameForm,
  PageTitle,
  CookieWall,
} from '../../components';

/**
 * Styleguide component.
 * @function Styleguide
 * @returns {string} Markup of the styleguide page.
 */

const placeKeys = [
  { id: 1, label: 'sleutel 1', data: { type: 'place_key', placeId: '1111-etc' } },
  { id: 2, label: 'sleutel 2', data: { type: 'place_key', placeId: '2222-etc' } },
];

const Styleguide = () =>
  <div id="page-styleguide">
    <Helmet title="Styleguide" />
    <Grid>
      <Row>
        <Col xs={12}>
          <CookieWall action={() => {}} privacyUrl="bla" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <PageTitle><span id="page-title">Page title</span></PageTitle>
        </Col>
      </Row>
      <Row>
        <Col xs={3}><AccountMenu /></Col>
        <Col xs={9}>
          <ChangeUserNameForm onSubmit={() => {}} />
          <ChangeEmailForm onSubmit={() => {}} />
          <ChangePasswordForm onSubmit={() => {}} />
        </Col>
      </Row>
      <Row>
        <Col xs={3}><PageTitle>Places</PageTitle></Col>
        <Col xs={9}>
          <PlaceKeyForm onSubmit={() => {}} placeKeys={placeKeys} />
        </Col>
      </Row>
      <Row>
        <Col xs={6}><PageTitle>Setup password and name</PageTitle></Col>
        <Col xs={6}>
          <SetupPasswordAndNameForm />
        </Col>
      </Row>
    </Grid>

    <br />

    <div className="container">
      <h1>Heading
        <mark>1</mark>
      </h1>
      <p>This is a paragraph with a <a href="/">link</a>.</p>
      <Panel header="Panel heading">
        <div className="alert alert-danger">Global error message</div>
        <Field field={{ name: 'field1' }} type="text" placeholder="Text field" />
        <Field field={{ name: 'field2' }} type="password" placeholder="Password field" />
        <Field
          field={{ name: 'field3', touched: true, error: 'Some error' }}
          type="text"
          placeholder="Field with error"
        />
        <div className="form-group">
          <Button bsStyle="primary" block>Button</Button>
        </div>
        <ul className="list-links">
          <li><a href="/">Link 1</a></li>
          <li><a href="/">Link 2</a></li>
        </ul>
        <p className="text-center"><a href="/">Centered link</a></p>
      </Panel>

      <div className="panel panel-default">
        <ul className="list-group">
          <li className="list-group-item checked">
            Ik geef toestemming dat 3P mijn huisregels mag uitlezen
          </li>
        </ul>
      </div>

      <div className="panel panel-default">
        <ul className="list-group">
          <li className="list-group-item">
            <div className="checkbox">
              <label htmlFor="first">
                <input type="checkbox" />
                3P mag mijn slimme meter uitlezen zolang ik klant ben, zodat zij
                energielevering kunnen garanderen en mij kunnen helpen met energiebesparing.
                <mark>*</mark>
              </label>
            </div>
          </li>
          <li className="list-group-item collapse-header">
            Meer over deze regel
          </li>
          <li className="list-group-item">
            <div className="checkbox">
              <label htmlFor="second">
                <input type="checkbox" checked="checked" />
                3P mag mijn slimme meter uitlezen zolang ik klant ben, zodat zij
                energielevering kunnen garanderen en mij kunnen helpen met energiebesparing.
                <mark>*</mark>
              </label>
            </div>
          </li>
          <li className="list-group-item collapse-header in">
            <i className="fa fa-times" aria-hidden="true" /> Minder weergeven
          </li>
          <li className="list-group-item collapse-body">
            De community bestaat uit klanten van 3P bij jou in de buurt. Zij wonen vaak in
            een vergelijkbaar huis. Hierdoor zijn zij een goed ijkpunt om jouw energieverbruik mee
            te vergelijken. Individueel energyverbruik is nooit zichtbaar voor de community. Dit
            is altijd een gemiddeld verbruik van meerdere leden.
          </li>
          <li className="list-group-item has-error">
            <div className="form-group">
              <div className="checkbox">
                <label htmlFor="third">
                  <input type="checkbox" />
                  3P mag mijn slimme meter uitlezen zolang ik klant ben, zodat zij
                  energielevering kunnen garanderen en mij kunnen helpen met energiebesparing.
                  <mark>*</mark>
                </label>
              </div>
              <div className="text-danger">
                Deze huisregel is verplicht
              </div>
            </div>
          </li>
        </ul>
      </div>

      <p className="discreet">
        Velden met een
        <mark>*</mark>
        moeten worden aangevinkt om gebruik te kunnen maken van
        3P
      </p>

      <Button>Default button</Button>

      <p>Spinner: <Spinner /></p>
    </div>
  </div>;

export default Styleguide;
