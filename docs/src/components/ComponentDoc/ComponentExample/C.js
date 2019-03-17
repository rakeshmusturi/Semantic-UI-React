import React from 'react'
import SourceRender from 'react-source-render'
import { Grid, Placeholder } from 'semantic-ui-react'
import VisibilitySensor from 'react-visibility-sensor'

import { resolver } from './ComponentExampleRenderSource'
import { babelConfig } from './renderConfig'
import ComponentExampleRenderEditor from './ComponentExampleRenderEditor'
import ComponentExampleRenderHtml from './ComponentExampleRenderHtml'

const renderedExampleStyle = {
  padding: '2rem',
}

const editorStyle = {
  padding: 0,
}

const ExamplePlaceholder = React.memo(() => (
  <Placeholder>
    <Placeholder.Paragraph>
      <Placeholder.Line />
      <Placeholder.Line />
      <Placeholder.Line />
      <Placeholder.Line />
      <Placeholder.Line />
    </Placeholder.Paragraph>
    <Placeholder.Paragraph>
      <Placeholder.Line />
      <Placeholder.Line />
      <Placeholder.Line />
    </Placeholder.Paragraph>
  </Placeholder>
))

export default class C extends React.Component {
  state = {}

  static getDerivedStateFromProps(props, state) {
    return {
      wasEverVisible: state.wasEverVisible ? true : state.visible,
    }
  }

  handleVisibilityChange = (visible) => {
    if (this.props.title) this.props.onVisibilityChange(this.props.examplePath, visible)
    this.setState({ visible })
  }

  render() {
    const { showCode, sourceCode, showHTML, renderHtml } = this.props
    // const handleOnScreen = React.useCallback(() => {
    //   setOpen(true)
    // }, [])

    return (
      <VisibilitySensor delayedCall onChange={this.handleVisibilityChange} partialVisibility>
        <div className='row'>
          {this.state.wasEverVisible ? (
            <SourceRender
              babelConfig={babelConfig}
              renderHtml={renderHtml}
              resolver={resolver}
              source={sourceCode}
            >
              <SourceRender.Consumer>
                {({ element, error, markup }) => (
                  <React.Fragment>
                    <Grid.Column
                      width={16}
                      // className={`rendered-example ${this.getKebabExamplePath()}`}
                      style={renderedExampleStyle}
                    >
                      {element}
                    </Grid.Column>
                    {(showCode || showHTML) && (
                      <Grid.Column width={16} style={editorStyle}>
                        {showCode && (
                          <ComponentExampleRenderEditor
                            // githubEditHref={this.getGithubEditHref()}
                            // originalValue={this.getOriginalSourceCode()}
                            value={sourceCode}
                            error={error}
                            onChange={this.handleChangeCode}
                          />
                        )}
                        {showHTML && <ComponentExampleRenderHtml value={markup} />}
                      </Grid.Column>
                    )}
                  </React.Fragment>
                )}
              </SourceRender.Consumer>
            </SourceRender>
          ) : (
            <Grid.Column width={16}>
              <ExamplePlaceholder />
            </Grid.Column>
          )}
        </div>
      </VisibilitySensor>
    )
  }
}
