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

// Variables and functions needed by both server and client code

// how many items will we show per page
const ITEMS_PER_PAGE = 7;

// query types
const QUERY_NATURAL_LANGUAGE = 0;
const QUERY_DISCO_LANGUAGE = 1;

// the index of the filter item in the aggregation data returned 
// from the discovery query
const ENTITY_DATA_INDEX      = 0;
const CATEGORY_DATA_INDEX    = 1;
const CONCEPT_DATA_INDEX     = 2;
const KEYWORD_DATA_INDEX     = 3;
const ENTITY_TYPE_DATA_INDEX = 4;

// keys/values for menu items
const ENTITY_FILTER      = 'EN';
const CATEGORY_FILTER    = 'CA';
const CONCEPT_FILTER     = 'CO';
const KEYWORD_FILTER     = 'KW';
const ENTITY_TYPE_FILTER = 'ET';

const SENTIMENT_TERM_ITEM = 'All Terms';   // used to indicate no specific item is seleced
const TRENDING_TERM_ITEM = 'Select Term';  // used to indicate no specific item is seleced

// filter types and strings to use
const filterTypes = [
  { key: ENTITY_FILTER,       value: ENTITY_FILTER,      text: 'Entities'},
  { key: CATEGORY_FILTER,     value: CATEGORY_FILTER,    text: 'Categories'},
  { key: CONCEPT_FILTER,      value: CONCEPT_FILTER,     text: 'Concepts'},
  { key: KEYWORD_FILTER,      value: KEYWORD_FILTER,     text: 'Keywords'},
  { key: ENTITY_TYPE_FILTER,  value: ENTITY_TYPE_FILTER, text: 'Entity Types'} ];
  
// sortBy is used as param to Discovery Service
// sortByInt is used to sort internally based on formatted data
const sortKeys = [
  { type: 'HIGHEST', 
    sortBy: '-result_metadata.score', 
    sortByInt: '-score',
    text: 'Highest Score' },
  { type: 'LOWEST', 
    sortBy: 'result_metadata.score', 
    sortByInt: 'score',
    text:  'Lowest Score' },
  { type: 'NEWEST', 
    sortBy: '-date', 
    sortByInt: '-date',
    text: 'Newest First' },
  { type: 'OLDEST', 
    sortBy: 'date', 
    sortByInt: 'date',
    text: 'Oldest First' },
  { type: 'BEST', 
    sortBy: '-enriched_text.sentiment.document.score', 
    sortByInt: '-sentimentScore',
    text: 'Highest Rated' },
  { type: 'WORST', 
    sortBy: 'enriched_text.sentiment.document.score', 
    sortByInt: 'sentimentScore',
    text: 'Lowest Rated' }
];

// sort types and strings to use for drop-down
const sortTypes = [];
sortKeys.forEach(function(item) {
  sortTypes.push({key: item.type, value: item.sortBy, text: item.text});
});  

/**
 * objectWithoutProperties - clear out unneeded properties from object.
 * object: object to scan
 * properties: items in object to remove
 */
const objectWithoutProperties = (object, properties) => {
  'use strict';

  var obj = {};
  var keys = Object.keys(object);
  keys.forEach(key => {
    if (properties.indexOf(key) < 0) {
      // keep this since it is not found in list of unneeded properties
      obj[key] = object[key];
    }
  });

  return obj;
};
  
/**
 * parseData - convert raw search results into collection of matching results.
 */
const parseData = data => ({
  rawResponse: Object.assign({}, data),
  // sentiment: data.aggregations[0].results.reduce((accumulator, result) =>
  //   Object.assign(accumulator, { [result.key]: result.matching_results }), {}),
  results: data.result.results
});


function formatData(rawData, passages) {
  let formattedData = {};
  let newResults = [];
  let data = rawData.rawResponse.result;

  for (let index=0; index<data.results.length; index++) {
    // only keep the data we show in the UI.
    let dataItem = data.results[index];
    console.log('dataItem: ' + JSON.stringify(dataItem, null, 2));
    let offset = 0;

    if ('text' in dataItem.highlight) {
      dataItem.highlight.text.forEach(function(element) {
        let highlights = new Array();
        highlights = defineHighLights(element);
        offset += 1;

        let newResult = {
          id: dataItem.id + offset.toString(),
          // title: '<a href="https://ibm.ent.box.com/s/x1jevh2i1dsb4bs104353nneybrl514k/file/658558108778">dataItem.extracted_metadata.filename</a>',
          // text: dataItem.text,
          text: element,
          filename: dataItem.extracted_metadata.filename,
          highlight: {
            showHighlight: true,
            textIndexes: highlights
          }
        };

        defineHighLights(dataItem.highlight.text, dataItem.text, newResult, 'text');
        console.log('newResult: ' + JSON.stringify(newResult, 2, null));
        newResults.push(newResult);
      });
    }
  }

  formattedData.results = newResults;
  // console.log('Formatting Data: size = ' + newResults.length);
  return formattedData;
}
  
function defineHighLights(text) {
  let indexes = [];
  let done = false;
  let startIdx = 0;

  console.log('text.length: ' + text.length);
  while (!done) {
    startIdx = text.indexOf('<em>', startIdx);
    if (startIdx >= 0 && startIdx <= text.length) {
      startIdx +=  '<em>'.length;
      let endIdx = text.indexOf('</em>', startIdx);
      indexes.push({
        startIdx: startIdx,
        endIdx: endIdx
      });
      startIdx = endIdx + '<em>'.length;
    } else {
      done = true;
    }
  }
  return indexes;
}

/**
 * getArrayIndex - determine where to add the new index pair into the index array.
 * Index pairs must be in numeric order, from low to high.
 */
function getArrayIndex(indexArray, startIdx) {
  // add in correct order, and no duplicates
  var insertIdx = 0;
  for (var i=0; i<indexArray.length; i++) {
    if (startIdx == indexArray[i].startIdx) {
      // found duplicate
      return - 1;
    } else if (startIdx < indexArray[i].startIdx) {
      // found our index
      return i;
    }
    // insert at end
    insertIdx = insertIdx + 1;
  }
  return insertIdx;
}

module.exports = {
  objectWithoutProperties,
  parseData,
  formatData,
  ITEMS_PER_PAGE,
  QUERY_NATURAL_LANGUAGE,
  QUERY_DISCO_LANGUAGE,
  ENTITY_DATA_INDEX,
  CATEGORY_DATA_INDEX,
  CONCEPT_DATA_INDEX,
  KEYWORD_DATA_INDEX,
  ENTITY_TYPE_DATA_INDEX,
  ENTITY_FILTER,
  CATEGORY_FILTER,
  CONCEPT_FILTER,
  KEYWORD_FILTER,
  ENTITY_TYPE_FILTER,
  SENTIMENT_TERM_ITEM,
  TRENDING_TERM_ITEM,
  sortKeys,
  filterTypes,
  sortTypes
};
