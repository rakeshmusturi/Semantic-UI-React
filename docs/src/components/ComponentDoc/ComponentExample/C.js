import React from 'react'
import SourceRender from 'react-source-render'
import { Grid, Placeholder } from 'semantic-ui-react'

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

export default class C extends React.Component {
  render() {
    const { showCode, sourceCode, renderHtml, visible } = this.props

    return (
      <Grid.Row>
        {visible ? (
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
                  {showCode && (
                    <Grid.Column width={16} style={editorStyle}>
                      <ComponentExampleRenderEditor
                        // githubEditHref={this.getGithubEditHref()}
                        // originalValue={this.getOriginalSourceCode()}
                        value={sourceCode}
                        error={error}
                        onChange={this.handleChangeCode}
                      />
                      <ComponentExampleRenderHtml value={markup} />
                    </Grid.Column>
                  )}
                </React.Fragment>
              )}
            </SourceRender.Consumer>
          </SourceRender>
        ) : (
          <Grid.Column width={16}>
            <Placeholder>
              <Placeholder.Paragraph>
                <Placeholder.Line/>
                <Placeholder.Line/>
                <Placeholder.Line/>
                <Placeholder.Line/>
                <Placeholder.Line/>
              </Placeholder.Paragraph>
              <Placeholder.Paragraph>
                <Placeholder.Line/>
                <Placeholder.Line/>
                <Placeholder.Line/>
              </Placeholder.Paragraph>
            </Placeholder>
          </Grid.Column>
        )}
      </Grid.Row>
    )
  }
}
