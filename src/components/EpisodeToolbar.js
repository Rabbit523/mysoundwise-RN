import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StyledText, TEXT_COLOR, TEXT_SIZE } from '../components'
import {
  LikeIcon,
  CommentAltIcon,
  NotesIcon,
  ShareIcon,
  ActionIcon,
  DescriptionIcon,
} from '../assets/icons'
import theme from '../theme'

const Container = styled.View`
  background-color: ${({ theme }) => theme.color.mainWhite};
  flex-direction: row;
  padding: 14.7px 14px 16.5px;
  justify-content: space-around;
`

const Touchable = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  align-items: center;
  padding-horizontal: 9.25px;
`

const GrayText = StyledText.extend.attrs({
  color: TEXT_COLOR.FONT_BLACK,
  size: TEXT_SIZE.XS,
})`
  margin-top: 6px;
`

const EpisodeToolbar = ({
  showShare = true,
  showDescription = true,
  showNotes = true,
  showAction = true,
  userLiked = false,
  onDescriptionPress,
  onActionPress,
  onNotesPress,
  onCommentPress,
  onLikePress,
  onSharePress,
}) => (
  <Container>
    {showDescription && (
      <Touchable onPress={onDescriptionPress}>
        <DescriptionIcon />
        <GrayText>Description</GrayText>
      </Touchable>
    )}
    {showNotes && (
      <Touchable onPress={onNotesPress}>
        <NotesIcon />
        <GrayText>Notes</GrayText>
      </Touchable>
    )}
    {showAction && (
      <Touchable onPress={onActionPress}>
        <ActionIcon />
        <GrayText>Action</GrayText>
      </Touchable>
    )}

    <Touchable onPress={onLikePress}>
      <LikeIcon
        width={22.56}
        height={19}
        strokeColor={
          userLiked ? theme.color.mainOrange : theme.color.episodeToolbarIcon
        }
        fillColor={userLiked && theme.color.mainOrange}
      />
      <GrayText>Like</GrayText>
    </Touchable>
    <Touchable onPress={onCommentPress}>
      <CommentAltIcon />
      <GrayText>Comment</GrayText>
    </Touchable>
    {showShare && (
      <Touchable onPress={onSharePress}>
        <ShareIcon />
        <GrayText>Share</GrayText>
      </Touchable>
    )}
  </Container>
)

EpisodeToolbar.propTypes = {
  showShare: PropTypes.bool,
  showDescription: PropTypes.bool,
  showNotes: PropTypes.bool,
  showAction: PropTypes.bool,
  userLiked: PropTypes.bool,
  onDescriptionPress: PropTypes.func,
  onNotesPress: PropTypes.func,
  onActionPress: PropTypes.func,
  onCommentPress: PropTypes.func,
  onLikePress: PropTypes.func,
  onSharePress: PropTypes.func,
}

export default EpisodeToolbar
