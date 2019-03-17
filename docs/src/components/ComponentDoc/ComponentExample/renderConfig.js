import faker from 'faker'
import React from 'react'
import PropTypes from 'prop-types'
import * as SUIR from 'semantic-ui-react'

export const babelConfig = {
  presets: [
    ['stage-1', { decoratorsLegacy: true }],
  ],
}

export const externals = {
  faker,
  lodash: require('lodash'),
  react: React,
  'prop-types': PropTypes,
  'semantic-ui-react': SUIR,
}
