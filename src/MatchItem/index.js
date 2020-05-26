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
import { List } from 'semantic-ui-react';

/**
 * This object renders  a single review, with accompanying rating, 
 * score, date, etc.
 */
const MatchItem = props => (
  <List.Item>
    <List.Content>
      <List.Header>
        <List.Description>
          <span dangerouslySetInnerHTML={{__html: props.title}}></span>
        </List.Description>
      </List.Header>
    </List.Content>
    <List.Content>
      <List.Description>
        <span dangerouslySetInnerHTML={{__html: props.text}}></span>
      </List.Description>
    </List.Content>
    <List.Content>
      Filename: <span dangerouslySetInnerHTML={{__html: props.filename}}></span>
    </List.Content>
  </List.Item>
);

// type check to ensure we are called correctly
MatchItem.propTypes = {
  text: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired
};

// export so we are visible to parent
module.exports = MatchItem;
