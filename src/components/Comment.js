import React from 'react'
import R from 'ramda'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  StyledText,
  TEXT_WEIGHT,
  TEXT_SIZE,
  TEXT_COLOR,
  Avatar,
} from '../components'
import { LikeIcon, MoreIcon } from '../assets/icons'
import theme from '../theme'
import moment from 'moment'
import { isExists, formatDateForMonth } from '../utils'
import { HITSLOP_10 } from '../constants'
import * as NavigationService from '../NavigationService'

const Container = styled.View`
  background-color: ${({ theme }) => theme.color.mainWhite};
  padding: 8.7px 17.2px 17px
    ${({ addLeftPadding }) => (addLeftPadding ? 35 : 12)}px;
`

const Row = styled.View`
  flex-direction: row;
`

const FooterRow = styled.View`
  flex-direction: row;
  margin-top: 5.1px;
`

const Touchable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
  hitSlop: HITSLOP_10,
})``

const LikeButton = ({ likeIconProps, ...rest }) => (
  <Touchable {...rest}>
    <LikeIcon {...likeIconProps} />
  </Touchable>
)

const MoreButton = props => (
  <Touchable {...props}>
    <MoreIcon />
  </Touchable>
)

const Text = StyledText.extend.attrs({
  size: TEXT_SIZE.XS,
})``

const BoldText = Text.extend.attrs({
  weight: TEXT_WEIGHT.BOLD,
})``

const CenterBlock = styled.View`
  flex: 1;
  padding-horizontal: 11px;
`

const GrayText = Text.extend.attrs({
  color: TEXT_COLOR.FONT_GREY,
})`
  margin-right: 12px;
`

const OrangeText = Text.extend.attrs({
  color: TEXT_COLOR.MAIN_ORANGE,
})``

const ReplyButton = props => (
  <Touchable {...props}>
    <OrangeText>Reply</OrangeText>
  </Touchable>
)

class Comment extends React.PureComponent {
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    otherProfileRoute: PropTypes.string.isRequired,
    picUrl: PropTypes.string,
    parentId: PropTypes.string,
    content: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    creatorId: PropTypes.string.isRequired,
    commentId: PropTypes.string.isRequired,
    entityId: PropTypes.string.isRequired,
    entityIdProp: PropTypes.string.isRequired,
    userCreated: PropTypes.bool.isRequired,
    userLiked: PropTypes.bool.isRequired,
    likesCount: PropTypes.number.isRequired,
    onPressReply: PropTypes.func.isRequired,
    onPressMore: PropTypes.func.isRequired,
  }

  _handlePressAvatar = () => {
    const { creatorId, selectUser, otherProfileRoute } = this.props
    selectUser(creatorId)
    if (otherProfileRoute) {
      NavigationService.navigate(otherProfileRoute)
    }
  }

  render() {
    const {
      picUrl,
      content,
      lastName,
      parentId,
      firstName,
      userLiked,
      createdAt,
      commentId,
      likesCount,
      userCreated,
      onPressMore,
      onPressReply,
    } = this.props

    return (
      <Container addLeftPadding={isExists(parentId)}>
        <Row>
          <Touchable onPress={this._handlePressAvatar}>
            <Avatar
              firstName={firstName}
              lastName={lastName}
              imageUrl={picUrl}
              size={isExists(parentId) ? 24.7 : 27}
            />
          </Touchable>
          <CenterBlock>
            <Text>
              <BoldText>{`${firstName} ${lastName} `}</BoldText>
              {content}
            </Text>
            <FooterRow>
              <GrayText>{formatDateForMonth(createdAt)}</GrayText>
              <GrayText>
                {R.gt(likesCount, 0) &&
                  `${likesCount} Like${likesCount === 1 ? '' : 's'}`}
              </GrayText>
              {!isExists(parentId) && <ReplyButton onPress={onPressReply} />}
            </FooterRow>
          </CenterBlock>
          {userCreated ? (
            <MoreButton onPress={onPressMore(commentId, content)} />
          ) : (
            <LikeButton
              likeIconProps={{
                width: 18,
                height: 17,
                strokeWidth: 1.5,
                fillColor: userLiked
                  ? theme.color.mainOrange
                  : theme.color.episodeListLike,
                strokeColor: userLiked
                  ? theme.color.mainOrange
                  : theme.color.episodeListLike,
              }}
              onPress={this._onLike}
            />
          )}
        </Row>
      </Container>
    )
  }

  _onLike = () => {
    const {
      userId,
      entityId,
      userLiked,
      commentId,
      soundcastId,
      likeComment,
      entityIdProp,
      unlikeComment,
    } = this.props
    const likeId = `${userId}-${commentId}`
    if (userLiked) {
      unlikeComment({
        likeId,
        commentId,
      })
    } else {
      likeComment({
        likeId,
        commentId,
        userId,
        [entityIdProp]: entityId,
        timeStamp: moment().unix(),
        soundcastId,
      })
    }
  }
}

export default Comment
