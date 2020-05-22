import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Linking } from 'react-native'
import { CommentButton, PublisherHead } from '../components'
import { LikeButtonContainer as LikeButton } from '../containers'
import HTML from 'react-native-render-html'
import theme from '../theme'

const Container = styled.View`
  padding: 12px 12px 12px 19px;
  border-bottom-color: ${({ theme }) => theme.color.border};
  border-bottom-width: 1px;
`

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 24px;
`

const MessageText = styled(HTML).attrs({
  containerStyle: { marginVertical: 12 },
  baseFontStyle: ({ theme }) => ({
    fontSize: theme.size.s,
    color: theme.color.mainBlack,
  }),
})``

class Message extends React.PureComponent {
  static propTypes = {
    showPublisher: PropTypes.bool,
    publisherImageUrl: PropTypes.string,
    publisherLastName: PropTypes.string,
    publisherFirstName: PropTypes.string,
    content: PropTypes.string.isRequired,
    onLikeTextPress: PropTypes.func.isRequired,
    onCommentTextPress: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onLikeTextPress: () => {},
    onCommentTextPress: () => {},
  }

  _handleLinkPress = (_, href) =>
    Linking.canOpenURL(href).then(
      canOpen =>
        canOpen
          ? Linking.openURL(href)
          : Linking.canOpenURL(`http://${href}`).then(
              canOpen =>
                canOpen
                  ? Linking.openURL(`http://${href}`)
                  : Linking.openURL(`https://${href}`),
            ),
    )

  render() {
    const {
      publisherImageUrl,
      publisherFirstName,
      publisherLastName,
      createdAt,
      content,
      showPublisher,
      lastLiked,
      likesCount,
      isLikeFetching,
      userLiked,
      commentsCount,
      onLikeTextPress,
      onCommentTextPress,
      ...rest
    } = this.props

    return (
      <Container {...rest}>
        {showPublisher && (
          <PublisherHead
            avatarSize={35}
            title={[publisherFirstName, publisherLastName].join(' ')}
            date={createdAt}
            imageUrl={publisherImageUrl}
          />
        )}
        <MessageText onLinkPress={this._handleLinkPress} html={content} />
        <Row>
          <LikeButton
            lastLiked={lastLiked}
            likesCount={likesCount}
            isFetching={isLikeFetching}
            onLike={this._onLike}
            onPressText={onLikeTextPress}
            placeholder="Like"
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
          />
          <CommentButton
            commentsCount={commentsCount}
            placeholder="Comment"
            onPress={onCommentTextPress}
          />
        </Row>
      </Container>
    )
  }

  _onLike = () => {
    const {
      likeMessage,
      unlikeMessage,
      soundcastId,
      userLiked,
      messageId,
    } = this.props
    if (userLiked) {
      unlikeMessage(messageId)
    } else {
      likeMessage({
        messageId,
        soundcastId,
      })
    }
  }
}

export default Message
