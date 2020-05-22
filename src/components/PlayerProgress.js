import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Bar } from 'react-native-progress'

const Progress = styled(Bar).attrs({
  borderWidth: 0,
  color: ({ theme }) => theme.color.mainOrange,
  unfilledColor: ({ theme }) => theme.color.border,
  borderRadius: 0,
  height: 2,
  width: null,
})`
  flex: 1;
  margin-top: 13px;
  margin-bottom: 13px;
`

class PlayerProgress extends React.PureComponent {
  static propTypes = {
    progress: PropTypes.number.isRequired,
  }

  render() {
    return <Progress progress={this.props.progress || 0.0001} />
  }
}

export default PlayerProgress
