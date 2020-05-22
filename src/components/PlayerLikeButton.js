import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { LikeIcon } from '../assets/icons'
import theme from '../theme'

const Touchable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})``

const HeartTouch = Touchable.extend`
  margin-right: 5px;
  margin-top: 7px;
`

class PlayerLikeButton extends React.Component {
  static propTypes = {
    episodeId: PropTypes.string.isRequired,
  }

  render() {
    const { userLiked } = this.props
    return (
      <HeartTouch onPress={this._toggleLike}>
        <LikeIcon
          width={19}
          height={18}
          strokeWidth={3}
          strokeColor={userLiked ? theme.color.mainOrange : 'black'}
          fillColor={userLiked ? theme.color.mainOrange : 'transparent'}
        />
      </HeartTouch>
    )
  }

  _toggleLike = () => {
    const {
      userLiked,
      episodeId,
      likeEpisode,
      unlikeEpisode,
      selectedSoundcast,
    } = this.props
    if (userLiked) {
      unlikeEpisode(episodeId)
    } else {
      likeEpisode({
        episodeId,
        soundcastId: selectedSoundcast,
      })
    }
  }
}
export default PlayerLikeButton
