import cx from 'classnames'
import copyToClipboard from 'copy-to-clipboard'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { withRouteData, withRouter } from 'react-static'
import VisibilitySensor from 'react-visibility-sensor'
import { Grid, Placeholder, Visibility } from 'semantic-ui-react'

import { examplePathToHash, getFormattedHash, repoURL, scrollToAnchor } from 'docs/src/utils'
import CarbonAdNative from 'docs/src/components/CarbonAd/CarbonAdNative'

import SourceRender from 'react-source-render'
import ComponentControls from '../ComponentControls'
import ComponentDocContext from '../ComponentDocContext'
import ComponentExampleRenderEditor from './ComponentExampleRenderEditor'
import ComponentExampleRenderHtml from './ComponentExampleRenderHtml'
import ComponentExampleRenderSource, { resolver } from './ComponentExampleRenderSource'
import ComponentExampleTitle from './ComponentExampleTitle'
import { babelConfig } from './renderConfig'
import C from './C'
import NoSsr from '../../NoSSR'

class DelayRender extends React.Component {
  constructor() {
    super()
    this.state = { ready: true }
  }

  componentWillMount() {
    const { delay, onRender } = this.props
    const d = parseInt(delay, 10)
    if (d && d > 0) {
      this.setState({ ready: false })
      this.timeout = setTimeout(() => {
        this.setState({ ready: true })
      }, delay)
    } else {
      this.setState({ ready: true })
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  render() {
    if (this.state.ready) {
      return this.props.children
    }
    return null
  }
}

const childrenStyle = {
  paddingBottom: 0,
  paddingTop: 0,
  maxWidth: '50rem',
}

const renderedExampleStyle = {
  padding: '2rem',
}

const editorStyle = {
  padding: 0,
}

const componentControlsStyle = {
  flex: '0 0 auto',
  width: 'auto',
}

/**
 * Renders a `component` and the raw `code` that produced it.
 * Allows toggling the the raw `code` code block.
 */
class ComponentExample extends PureComponent {
  state = {}

  static propTypes = {
    children: PropTypes.node,
    description: PropTypes.node,
    displayName: PropTypes.string.isRequired,
    exampleKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
    exampleSources: PropTypes.objectOf(PropTypes.string).isRequired,
    examplePath: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    onVisibilityChange: PropTypes.func.isRequired,
    renderHtml: PropTypes.bool,
    suiVersion: PropTypes.string,
    title: PropTypes.node,
  }

  static defaultProps = {
    renderHtml: true,
  }

  constructor(props) {
    super(props)

    this.anchorName = examplePathToHash(props.examplePath)
    this.state = {
      showCode: this.isActiveHash(),
      sourceCode: this.getOriginalSourceCode(),
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { examplePath, exampleSources } = props
    const nextSourceCode = exampleSources[examplePath]

    // for local environment
    if (process.env.NODE_ENV !== 'production' && state.sourceCode !== nextSourceCode) {
      return { sourceCode: nextSourceCode }
    }

    return {
      wasEverVisible: state.wasEverVisible ? true : state.visible,
    }
  }

  componentDidUpdate(prevProps) {
    // deactivate examples when switching from one to the next
    if (this.isActiveHash() && this.state.showCode && this.props.location.hash !== prevProps.location.hash) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ showCode: false })
    }
  }

  isActiveHash = () => {
    const { exampleKeys, location } = this.props
    return this.anchorName === getFormattedHash(exampleKeys, location.hash)
  }

  updateHash = () => {
    if (this.state.showCode) this.setHashAndScroll()
  }

  setHashAndScroll = () => {
    const { history, location } = this.props

    history.replace(`${location.pathname}#${this.anchorName}`)
    scrollToAnchor()
  }

  handleDirectLinkClick = () => {
    this.setHashAndScroll()
    copyToClipboard(window && window.location.href)
  }

  handleShowCodeClick = (e) => {
    e.preventDefault()
    this.setState(prevState => ({ showCode: !prevState.showCode }), this.updateHash)
  }

  handlePass = () => {
    if (this.props.title) this.props.onPassed(this.props.examplePath)
  }

  getGithubEditHref = () => {
    const { examplePath } = this.props

    // get component name from file path:
    // elements/Button/Types/ButtonButtonExample
    const pathParts = examplePath.split(__PATH_SEP__)
    const filename = pathParts[pathParts.length - 1]

    return [
      `${repoURL}/edit/master/docs/src/examples/${examplePath}.js`,
      `?message=docs(${filename}): your description`,
    ].join('')
  }

  getKebabExamplePath = () => {
    if (!this.kebabExamplePath) {
      this.kebabExamplePath = _.kebabCase(this.props.examplePath)
    }

    return this.kebabExamplePath
  }

  getOriginalSourceCode = () => {
    const { examplePath, exampleSources } = this.props
    return exampleSources[examplePath]
  }

  handleChangeCode = _.debounce((sourceCode) => {
    this.setState({ sourceCode })
  }, 30)

  handleVisibility = (visible) => this.setState({ visible })

  handleRenderError = (error) => this.setState({ error: error.toString() })

  handleRenderSuccess = (error, { markup }) => this.setState({ error, htmlMarkup: markup })

  render() {
    const {
      children,
      description,
      displayName,
      examplePath,
      renderHtml,
      suiVersion,
      title,
    } = this.props
    const { error, htmlMarkup, showCode, sourceCode, visible, wasEverVisible } = this.state

    const isActive = this.isActiveHash() || this.state.showCode

    //     <Visibility
    //   once={false}
    //   onTopPassed={this.handlePass}
    //   onTopPassedReverse={this.handlePass}
    //   style={{ margin: '2rem 0' }}
    // >
    //   Ensure anchor links don't occlude card shadow effect
    return (
      <VisibilitySensor
        delayedCall
        partialVisibility
        onChange={this.handleVisibility}
      >
        <div id={this.anchorName} style={{ paddingTop: '1rem' }}>
          <Grid className={cx('docs-example', { active: isActive })} padded='vertically'>
            <Grid.Row columns='equal'>
              <Grid.Column>
                <ComponentExampleTitle
                  description={description}
                  title={title}
                  suiVersion={suiVersion}
                />
              </Grid.Column>
              <Grid.Column textAlign='right' style={componentControlsStyle}>
                <ComponentControls
                  anchorName={this.anchorName}
                  disableHtml={!renderHtml}
                  exampleCode={sourceCode}
                  examplePath={examplePath}
                  onCopyLink={this.handleDirectLinkClick}
                  onShowCode={this.handleShowCodeClick}
                  showCode={showCode}
                  visible={wasEverVisible}
                />
              </Grid.Column>
            </Grid.Row>

            {children && (
              <Grid.Row columns={1} style={childrenStyle}>
                <Grid.Column>{children}</Grid.Column>
              </Grid.Row>
            )}

            <NoSsr>
              <C
                examplePath={this.props.examplePath}
                showCode={showCode}
                onVisibilityChange={this.props.onVisibilityChange}
                sourceCode={sourceCode}
                renderHtml={renderHtml}
                title={this.props.title}
                visible={wasEverVisible}
              />
            </NoSsr>
            {isActive && !error && <CarbonAdNative inverted={this.state.showCode} />}
          </Grid>
        </div>
      </VisibilitySensor>
    )
  }
}

const Wrapper = (props) => (
  <ComponentDocContext.Consumer>
    {(contextProps) => {
      return <ComponentExample {...props} {...contextProps} />
    }}
  </ComponentDocContext.Consumer>
)

export default Wrapper
