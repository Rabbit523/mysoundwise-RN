import React from 'react'
import styled from 'styled-components'
import {
  HeaderArrowButton,
  PublisherHead,
  Placeholders,
  BottomInput,
  Preloader,
} from '../components'
import ActionSheet from 'react-native-actionsheet'
import {
  CommentContainer as Comment,
  MessageContainer as Message,
  PlayerViewContainer as PlayerView,
  ThemedRefreshControlContainer as RefreshControl,
} from '../containers'
import * as NavigationService from '../NavigationService'
import moment from 'moment'
import { ENTITIES } from '../constants'

const Container = styled.View`
  flex: 1;
`

const FlatList = styled.FlatList``

const HeaderWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
`

const Header = ({ navigation }) => (
  <HeaderWrapper>
    <HeaderArrowButton
      onPress={() =>
        navigation.getParam('key')
          ? NavigationService.navigate(navigation.getParam('key'))
          : NavigationService.goBack()
      }
    />
    <PublisherHead
      avatarSize={28}
      imageUrl={navigation.getParam('publisherImageUrl')}
      title={navigation.getParam('publisherName')}
      date={navigation.getParam('dateCreated')}
    />
  </HeaderWrapper>
)

class MessageDetails extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: <Header navigation={navigation} />,
    headerLeft: null,
  })

  state = {
    addCommentMode: true, // false if editComment
    text: '',
    parentId: null,
    showBottomInput: false,
  }

  _showLikesList = () =>
    this.props.message.likesCount && NavigationService.navigate('MessageLikes')

  _keyExtractor = ({ commentId }) => commentId

  _renderItem = ({ item }) => (
    <Comment
      onPressReply={this._onPressReply(item.commentId)}
      onPressMore={this._onPressMore}
      otherProfileRoute="OtherProfileMessages"
      entityId={this.props.message.messageId}
      entityIdProp="messageId"
      {...item}
    />
  )

  componentDidMount() {
    const {
      requestMessageComments,
      refreshMessageComments,
      comments,
      message: { messageId },
    } = this.props
    if (comments.length) {
      refreshMessageComments(messageId)
    } else {
      requestMessageComments(messageId)
    }
  }

  _handleRefresh = () => {
    const {
      refreshMessageComments,
      message: { messageId },
    } = this.props
    refreshMessageComments(messageId)
  }

  render() {
    const {
      message,
      comments,
      isCommentsFetching,
      isRefreshingComments,
    } = this.props
    const { showBottomInput, text } = this.state
    return (
      <PlayerView>
        <Container>
          <Message
            {...message}
            onLikeTextPress={this._showLikesList}
            onCommentTextPress={this._onPressComment}
          />
          {isCommentsFetching && !comments.length ? (
            <Preloader renderContainer />
          ) : (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={!!isRefreshingComments}
                  onRefresh={this._handleRefresh}
                />
              }
              ListEmptyComponent={
                <Placeholders.CommentsPlaceholder
                  grayText="There are no comments on this message yet"
                  blackText="Be the one that starts the conversation"
                />
              }
              data={comments}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          )}
        </Container>
        {showBottomInput && (
          <BottomInput
            onCancel={this._hideInput}
            onSave={this._onSaveComment}
            visible={showBottomInput}
            text={text}
          />
        )}
        <ActionSheet
          ref={o => (this.actionSheet = o)}
          options={['Cancel', 'Edit Comment', 'Delete']}
          cancelButtonIndex={0}
          onPress={this._onPressActionSheet}
        />
      </PlayerView>
    )
  }

  _hideInput = () => this.setState({ showBottomInput: false })

  _onPressReply = commentId => () =>
    this.setState({ text: '', parentId: commentId, showBottomInput: true })

  _onPressComment = () =>
    this.setState({ text: '', parentId: null, showBottomInput: true })

  _onPressMore = (commentId, text) => () =>
    this.setState({ commentId, text }, this._showActionSheet)

  _onPressEdit = () =>
    this.setState({
      addCommentMode: false,
      showBottomInput: true,
    })

  _deleteComment = () => {
    const {
      uncommentMessage,
      message: { messageId },
    } = this.props
    const { commentId } = this.state
    uncommentMessage({ commentId, entityId: messageId })
  }

  _onSaveComment = text => {
    if (this.state.addCommentMode) {
      this.setState({ showBottomInput: false, text }, this._saveComment)
    } else {
      this.setState({ showBottomInput: false, addCommentMode: true })
      this._editComment(text)
    }
  }

  _saveComment = () => {
    const { text, parentId } = this.state
    if (!text) return
    const {
      commentMessage,
      message: { messageId, soundcastId },
      userId,
    } = this.props
    const timeStamp = moment().unix()
    const commentId = parentId
      ? `${timeStamp}c-${parentId}`
      : `${timeStamp}c-${messageId}`
    const commentBody = {
      content: text,
      commentId,
      timeStamp,
      creatorId: userId,
      messageId,
      likesCount: 0,
      userCreated: true,
      soundcastId,
    }
    if (parentId) {
      commentBody.parentId = parentId
    }
    commentMessage(commentBody)
  }

  _editComment = newText => {
    const { text, commentId } = this.state
    if (!newText || newText === text) return
    const {
      editComment,
      message: { messageId },
    } = this.props
    editComment({
      content: newText,
      commentId,
      entityId: messageId,
      entityType: ENTITIES.MESSAGE,
    })
  }

  _showActionSheet = () => this.actionSheet.show()

  _onPressActionSheet = index => {
    if (index === 1) {
      this._onPressEdit()
    } else if (index === 2) {
      this._deleteComment()
    }
  }
}

export default MessageDetails
