import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'

import ComponentControlsCopyLink from './ComponentControlsCopyLink'
import ComponentControlsCodeSandbox from './ComponentControlsCodeSandbox'

const ComponentControls = (props) => {
  const {
    anchorName,
    disableHtml,
    exampleCode,
    examplePath,
    showHTML,
    showCode,
    onCopyLink,
    onShowHTML,
    onShowCode,
  } = props
  const externalHref = `/maximize/${_.kebabCase(examplePath.split('/').slice(-1))}`

  return (
    <Menu color='green' compact icon='labeled' size='tiny' text>
      <Menu.Item active={showCode} onClick={onShowCode}>
        <Icon color={showCode ? 'green' : 'grey'} fitted name='code' size='large' />
        Try it
      </Menu.Item>
      <Menu.Item
        active={showHTML}
        disabled={disableHtml}
        onClick={onShowHTML}
        title={disableHtml ? 'HTML preview is disabled for this example' : ''}
      >
        <Icon color={showHTML ? 'green' : 'grey'} size='large' name='html5' fitted />
        Show HTML
      </Menu.Item>
      <ComponentControlsCodeSandbox exampleCode={exampleCode} />
      <Menu.Item href={externalHref} target='_blank'>
        <Icon color='grey' fitted name='window maximize' size='large' />
        Maximize
      </Menu.Item>
      <ComponentControlsCopyLink anchorName={anchorName} onClick={onCopyLink} />
    </Menu>
  )
}

ComponentControls.propTypes = {
  anchorName: PropTypes.string,
  disableHtml: PropTypes.bool,
  exampleCode: PropTypes.string,
  examplePath: PropTypes.string,
  onCopyLink: PropTypes.func,
  onShowCode: PropTypes.func,
  onShowHTML: PropTypes.func,
  showCode: PropTypes.bool,
  showHTML: PropTypes.bool,
}

export default React.memo(ComponentControls)
