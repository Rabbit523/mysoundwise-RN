import React from 'react'
import R from 'ramda'
import PropTypes from 'prop-types'
import { Share, Linking } from 'react-native'
import styled from 'styled-components'
import { Header } from 'react-navigation'
import ActionSheet from 'react-native-actionsheet'
import PDF from 'react-native-pdf'
import {
  TEXT_SIZE,
  TEXT_COLOR,
  TEXT_WEIGHT,
  Modal,
  Preloader,
  StyledText,
  EpisodeHead,
  BottomInput,
  Placeholders,
  BlurBackground,
  EpisodeToolbar,
} from '../components'
import { HeadphonesIcon } from '../assets/icons'
import moment from 'moment'
import {
  LikeButtonContainer as LikeButton,
  PlayerViewContainer as PlayerView,
  CommentContainer as Comment,
} from '../containers'
import { CachedImage } from 'react-native-cached-image'
import { URLS, ENTITIES } from '../constants'
import { isExists, numberFormatter } from '../utils'
import theme from '../theme'
import HTML from 'react-native-render-html'
import * as NavigationService from '../NavigationService'

const Container = styled.View`
  flex: 1;
  padding-top: ${Header.HEIGHT};
`

const FlatList = styled.FlatList``

const ListensRow = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: flex-end;
`

const SubheaderRow = styled.View`
  flex-direction: row;
  margin-top: 12px;
  justify-content: space-between;
`

const PaddingWrapper = styled.View`
  padding: 14px 17px 14px;
`

const GrayText = StyledText.extend.attrs({
  color: TEXT_COLOR.FONT_BLACK,
  size: TEXT_SIZE.XS,
})``

const Listens = ({ listensCount = 0, isFetching }) => (
  <ListensRow>
    <HeadphonesIcon marginRight={6.6} />
    {isFetching ? (
      <Preloader />
    ) : (
      <GrayText>{numberFormatter(listensCount)} listens</GrayText>
    )}
  </ListensRow>
)

Listens.propTypes = {
  listensCount: PropTypes.number,
  isFetching: PropTypes.bool,
}

const ModalInner = styled.View`
  background-color: ${({ theme }) => theme.color.mainWhite};
  flex: 1;
  padding-horizontal: ${({ addPadding }) => (addPadding ? 40 : 0)}px;
  padding-vertical: 20px;
`

const ModalHeaderText = StyledText.extend.attrs({
  size: TEXT_SIZE.L,
})`
  text-align: center;
  margin: 14px 40px;
`

const ContentContainer = styled.ScrollView`
  flex: 1;
`

const ContentHeaderText = StyledText.extend.attrs({
  size: TEXT_SIZE.L,
  weight: TEXT_WEIGHT.BOLD,
})`
  margin-bottom: 26px;
  text-align: center;
`

const CommentsContainer = styled.View`
  background-color: ${({ theme }) => theme.color.mainWhite};
  flex: 1;
`

const CommentsHeaderWrapper = styled.View`
  padding: 9px 17px;
  border-color: ${({ theme }) => theme.color.borderAlt};
  border-bottom-width: 1px;
  background-color: ${({ theme }) => theme.color.commentsCounter};
`

const CommentsHeaderText = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
  color: TEXT_COLOR.FONT_BLACK,
})``

class CommentsHeader extends React.PureComponent {
  render = () => (
    <CommentsHeaderWrapper>
      <CommentsHeaderText>{`${this.props.commentsCount} COMMENT${
        this.props.commentsCount !== 1 ? 'S' : ''
      }`}</CommentsHeaderText>
    </CommentsHeaderWrapper>
  )
}

const ContentText = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
})`
  margin-bottom: 10px;
`

const MODAL_CONTENT_TYPE = {
  DESCRIPTION: 'DESCRIPTION',
  NOTES: 'NOTES',
  ACTION: 'ACTION',
}

const Image = styled(CachedImage)`
  width: 100%;
  height: 100%;
  flex: 1;
  margin-bottom: 10px;
`

const StyledPDF = Image.withComponent(PDF)

class EpisodeDetails extends React.Component {
  state = {
    modalVisible: false,
    addCommentMode: true, // false if editComment
    modalContentType: '',
    text: '',
    parentId: null,
    showBottomInput: false,
  }

  _showModal = () => this.setState({ modalVisible: true })

  _hideModal = () => this.setState({ modalVisible: false })

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

  _renderDescriptionContent = () => (
    <ModalInner addPadding>
      <ContentHeaderText>Description</ContentHeaderText>
      {isExists(this.props.selectedEpisode.description) && (
        <ContentContainer>
          <HTML
            onLinkPress={this._handleLinkPress}
            html={this.props.selectedEpisode.description}
          />
        </ContentContainer>
      )}
    </ModalInner>
  )

  _renderActionContent = () => (
    <ModalInner addPadding>
      <ContentHeaderText>Action</ContentHeaderText>
      {isExists(this.props.selectedEpisode.actionstep) && (
        <ContentContainer>
          <ContentText>{this.props.selectedEpisode.actionstep}</ContentText>
        </ContentContainer>
      )}
    </ModalInner>
  )

  _renderNotesContent = () => {
    const { notes } = this.props.selectedEpisode
    return (
      <ModalInner>
        <ContentHeaderText>Notes</ContentHeaderText>
        {isExists(notes) && R.endsWith('.pdf', notes) ? (
          <StyledPDF source={{ uri: notes }} />
        ) : (
          <Image source={{ uri: notes }} />
        )}
      </ModalInner>
    )
  }

  _showDescriptionModal = () =>
    this.setState(
      { modalContentType: MODAL_CONTENT_TYPE.DESCRIPTION },
      this._showModal,
    )

  _showNotesModal = () =>
    this.setState(
      { modalContentType: MODAL_CONTENT_TYPE.NOTES },
      this._showModal,
    )

  _showActionModal = () =>
    this.setState(
      { modalContentType: MODAL_CONTENT_TYPE.ACTION },
      this._showModal,
    )

  componentDidMount() {
    const {
      openEpisodeCommentsChannel,
      openEpisodeChannel,
      selectedEpisode: { episodeId },
      navigation,
    } = this.props
    openEpisodeCommentsChannel()
    if (navigation.getParam('openEpisodeChannel')) openEpisodeChannel(episodeId)
  }

  componentWillUnmount() {
    const {
      closeEpisodeCommentsChannel,
      closeEpisodeChannel,
      selectedEpisode: { episodeId },
      navigation,
    } = this.props
    closeEpisodeCommentsChannel()
    if (navigation.getParam('openEpisodeChannel'))
      closeEpisodeChannel(episodeId)
  }

  _keyExtractor = ({ commentId }) => commentId

  _renderItem = ({ item }) => (
    <Comment
      onPressReply={this._onPressReply(item.commentId)}
      onPressMore={this._onPressMore}
      otherProfileRoute="OtherProfileSoundcasts"
      entityId={this.props.selectedEpisode.episodeId}
      entityIdProp="episodeId"
      {...item}
    />
  )

  render() {
    const {
      selectedEpisode: {
        title,
        date_created,
        lastLiked,
        userLiked,
        likesCount,
        publicEpisode,
        description,
        actionstep,
        notes,
        isLikeFetching,
        totalListens,
        commentsCount,
      },
      isCommentsFetching,
      comments,
      selectedSoundcast: { imageUrl, blurredImageUrl },
      isFetchingListensCount,
      episodeLoaded,
      updateDownloadTask,
      removeDownloadTask,
    } = this.props
    // console.log('commentsCount = ', commentsCount)
    // console.log('comments = ', comments)
    // console.log('lastLiked = ', lastLiked, ', userLiked = ', userLiked, ', likesCount = ', likesCount, ', isLikeFetching = ', isLikeFetching)
    const { modalContentType, modalVisible, showBottomInput, text } = this.state
    const subtitle = moment.unix(date_created).format('ddd MMM DD')
    return (
      <PlayerView>
        <Container>
          <BlurBackground imageUrl={blurredImageUrl} />
          <PaddingWrapper>
            <EpisodeHead
              episode={this.props.selectedEpisode}
              imageUrl={imageUrl}
              title={title}
              subtitle={subtitle}
              episodeLoaded={episodeLoaded}
              updateDownloadTask={updateDownloadTask}
              removeDownloadTask={removeDownloadTask}
            />
            <SubheaderRow>
              <LikeButton
                lastLiked={lastLiked}
                likeIconProps={{
                  width: 19.4,
                  height: 17,
                  strokeWidth: 1.5,
                  fillColor: userLiked
                    ? theme.color.mainOrange
                    : theme.color.episodeListLike,
                  strokeColor: userLiked
                    ? theme.color.mainOrange
                    : theme.color.episodeListLike,
                }}
                likesCount={likesCount}
                onLike={this._onLike}
                onPressText={this._onLikeTextPress}
                isFetching={isLikeFetching}
              />
              <Listens
                isFetching={isFetchingListensCount}
                listensCount={totalListens}
              />
            </SubheaderRow>
          </PaddingWrapper>
          <EpisodeToolbar
            userLiked={userLiked}
            onSharePress={this._onShare}
            showShare={publicEpisode}
            onDescriptionPress={this._showDescriptionModal}
            showDescription={isExists(description)}
            onNotesPress={this._showNotesModal}
            showNotes={isExists(notes)}
            onActionPress={this._showActionModal}
            showAction={isExists(actionstep)}
            onLikePress={this._onLike}
            onCommentPress={this._onPressComment}
          />
          <CommentsContainer>
            {isCommentsFetching ? (
              <Preloader renderContainer />
            ) : comments.length ? (
              <React.Fragment>
                <CommentsHeader commentsCount={commentsCount} />
                <FlatList
                  data={comments}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderItem}
                />
              </React.Fragment>
            ) : (
              <Placeholders.CommentsPlaceholder
                grayText="There are no comments on this episode yet"
                blackText="Be the one that starts the conversation"
              />
            )}
          </CommentsContainer>
        </Container>
        {showBottomInput && (
          <BottomInput
            onCancel={this._hideInput}
            onSave={this._onSaveComment}
            visible={showBottomInput}
            text={text}
          />
        )}
        <Modal visible={modalVisible} onCloseModal={this._hideModal}>
          <BlurBackground imageUrl={blurredImageUrl} />
          <ModalHeaderText>{title}</ModalHeaderText>
          {modalContentType === MODAL_CONTENT_TYPE.DESCRIPTION
            ? this._renderDescriptionContent()
            : modalContentType === MODAL_CONTENT_TYPE.NOTES
              ? this._renderNotesContent()
              : this._renderActionContent()}
        </Modal>
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
      uncommentEpisode,
      selectedEpisode: { episodeId },
    } = this.props
    const { commentId } = this.state
    uncommentEpisode({ commentId, entityId: episodeId })
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
      commentEpisode,
      selectedEpisode: { episodeId, soundcastId },
      userId,
    } = this.props
    const timeStamp = moment().unix()
    const commentId = parentId
      ? `${timeStamp}c-${parentId}`
      : `${timeStamp}c-${episodeId}`
    const commentBody = {
      content: text,
      commentId,
      timeStamp,
      creatorId: userId,
      episodeId,
      userLiked: false,
      likesCount: 0,
      userCreated: true,
      soundcastId,
    }
    if (parentId) commentBody.parentId = parentId
    commentEpisode({
      [commentId]: commentBody,
    })
  }

  _editComment = newText => {
    const { text, commentId } = this.state
    if (!newText || newText === text) return
    const {
      editComment,
      selectedEpisode: { episodeId },
    } = this.props
    editComment({
      content: newText,
      commentId,
      entityId: episodeId,
      entityType: ENTITIES.EPISODE,
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

  _onLike = () => {
    const {
      likeEpisode,
      unlikeEpisode,
      selectedSoundcast: { soundcastId },
      selectedEpisode: { userLiked, episodeId },
    } = this.props
    if (userLiked) {
      unlikeEpisode(episodeId)
    } else {
      likeEpisode({
        episodeId,
        soundcastId: soundcastId,
      })
    }
  }

  _onLikeTextPress = () => NavigationService.navigate('LikesList')

  _onShare = () => {
    const {
      selectedEpisode: { title, episodeId },
    } = this.props
    const url = URLS.SHARE_EPISODE + episodeId
    Share.share(
      {
        message: url,
        title,
        url,
      },
      { dialogTitle: 'Share this episode', subject: 'Share this episode' },
    )
  }
}

export default EpisodeDetails
