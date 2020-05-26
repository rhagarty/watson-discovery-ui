/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import MatchItem from '../MatchItem';
import { Container, List, Label, Modal, Button } from 'semantic-ui-react';

/**
 * This object renders the results of the search query on the web page. 
 * Each result item, or 'match', will display a title, description, and
 * sentiment value.
 */
export default class Matches extends React.Component {
  constructor(...props) {
    super(...props);

    this.state = {
      matches: this.props.matches || null
    };
  }

  /**
   * getText - format text, setting backgroud color for all
   * highlighted words.
   */
  getText(item, text) {
    if (item.highlight.showHighlight && item.highlight.textIndexes.length > 0) {
      var str = '<style>hilite {background:#ffffb3;}</style>';
      var currIdx = 0;

      item.highlight.textIndexes.forEach(function(element) {
        str = str + text.substring(currIdx, element.startIdx) +
          '<hilite>' +
          text.substring(element.startIdx, element.endIdx) +
          '</hilite>';
        currIdx = element.endIdx;
      });
      str = str + text.substring(currIdx);
      return str;
    } else {
      return text ? text : 'No Description';
    }
  }

  getFile(item) {
    //console.log('FILE = ' + '<a href="' + item.date + '"</a>');
    // return '<a href="https://ibm.ent.box.com/s/x1jevh2i1dsb4bs104353nneybrl514k/file/658558108778" target="_blank">' + item.date + '</a>';
    return '<a href="file:///Users/rhagarty/Downloads/US43941918.pdf" target="_blank">' + item.filename + '</a>';
  }

  /**
   * getMoreButton - the button user clicks to see full review, and
   * the contents of the modal dialog.
   */
  getMoreButton(item) {
    return <Modal
      trigger={ <Button className="review-button" onClick={this.buttonClicked.bind(this, item)}>more...</Button> } 
      closeIcon
      dimmer='blurring'
    >
      <Modal.Content>
        <div className="review-modal">
          <List.Item>
            <List.Content>
              <List.Header>
                <List.Description>
                  <h1>
                    <span dangerouslySetInnerHTML={{__html: this.getTitle(item)}}></span>
                  </h1>
                </List.Description>
              </List.Header>
            </List.Content>
            <List.Content>
              <List.Description>
                <h3>
                  <br/>
                  <span dangerouslySetInnerHTML={{__html: this.getText(item, item.textFull)}}></span>
                  <br/>
                </h3>
              </List.Description>
            </List.Content>
          </List.Item>
        </div>
      </Modal.Content>
    </Modal>;
  }

  // Important - this is needed to ensure changes to main properties
  // are propagated down to our component. In this case, some other
  // search or filter event has occured which has changed the list of
  // items we are graphing, OR the graph data has arrived.
  static getDerivedStateFromProps(props, state) {
    if (props.matches !== state.matches) {
      return {
        matches: props.matches
      };
    }
    // no change in state
    return null;
  }

  /**
   * render - return a page full of reviews.
   */
  render() {
    const { matches } = this.state;

    return (
      <div>
        <Container textAlign='left'>
          <div className="matches--list">
            <List divided verticalAlign='middle'>
              {matches.map(item =>
                <MatchItem
                  key={ item.id }
                  text={ this.getText(item, item.text) }
                  highlightText={ item.highlightText }
                  filename={ this.getFile(item) }
                />)
              }
            </List>
          </div>
        </Container>
      </div>
    );
  }
}

// type check to ensure we are called correctly
Matches.propTypes = {
  matches: PropTypes.arrayOf(PropTypes.object).isRequired,
  onGetFullReviewRequest: PropTypes.func.isRequired
};
