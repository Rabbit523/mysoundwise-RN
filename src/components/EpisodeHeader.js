import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'
import { StyledText, TEXT_COLOR, TEXT_WEIGHT, TEXT_SIZE } from './typography'

const EpisodeHeaderText = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
  weight: TEXT_WEIGHT.BOLD,
  numberOfLines: 2,
})``

const EpisodeDate = StyledText.extend.attrs({
  size: TEXT_SIZE.XS,
  color: TEXT_COLOR.EPISODE_DATE,
})`
  margin-top: 6px;
`

const EpisodeHeaderWrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  flex-shrink: 1;
  margin-left: 16px;
`

class EpisodeHeader extends React.PureComponent {
  render() {
    const { title, date, duration = 0, onPress } = this.props

    const durationInMin = Math.round(duration / 60)

    return (
      <EpisodeHeaderWrapper disable={!!onPress} onPress={onPress}>
        <EpisodeHeaderText>{title}</EpisodeHeaderText>
        <EpisodeDate>{`${moment
          .unix(date)
          .format('ddd MMM DD')} | ${durationInMin} ${
          durationInMin === 1 ? 'Min' : 'Mins'
        }`}</EpisodeDate>
      </EpisodeHeaderWrapper>
    )
  }
}

EpisodeHeader.propTypes = {
  title: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  duration: PropTypes.number,
  onPress: PropTypes.func,
}

export default EpisodeHeader
