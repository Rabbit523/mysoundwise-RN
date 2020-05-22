import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native'
import { Preloader } from '../../components'
import EpisodeElement from './EpisodeElement'
import ActionSheet from 'react-native-actionsheet'
import { reattachingDownloads } from '../../utils/DownloadTask'

class EpisodesList extends React.PureComponent {
  componentDidMount() {
    console.log('EpisodesList componentDidMount')
    const { episodeLoaded, updateDownloadTask, removeDownloadTask } = this.props
    reattachingDownloads(updateDownloadTask, removeDownloadTask, episodeLoaded)
  }

  _renderItem = ({ item }) => {
    const {
      episodeLoaded,
      soundcastImageUrl,
      selectEpisode,
      likeEpisode,
      unlikeEpisode,
      userId,
      soundcastId,
      startPositions,
      openEpisodeChannel,
      closeEpisodeChannel,
      downloadTasks,
      updateDownloadTask,
      removeDownloadTask,
    } = this.props
    return (
      <EpisodeElement
        {...item}
        userId={userId}
        soundcastId={soundcastId}
        episodeLoaded={episodeLoaded}
        onRemoveEpisode={this._onPressRemoveEpisode}
        soundcastImageUrl={soundcastImageUrl}
        selectEpisode={selectEpisode}
        likeEpisode={likeEpisode}
        unlikeEpisode={unlikeEpisode}
        defaultPosition={startPositions[item.episodeId]}
        openEpisodeChannel={openEpisodeChannel}
        closeEpisodeChannel={closeEpisodeChannel}
        downloadState={downloadTasks[item.episodeId]}
        updateDownloadTask={updateDownloadTask}
        removeDownloadTask={removeDownloadTask}
      />
    )
  }

  static propTypes = {
    episodes: PropTypes.arrayOf(PropTypes.object),
    isFetching: PropTypes.bool,
    downloadTasks: PropTypes.object,
    updateDownloadTask: PropTypes.func,
    removeDownloadTask: PropTypes.func,
  }

  _keyExtractor = ({ episodeId }) => episodeId

  _onPressActionSheet = index =>
    index === 1 && this.props.removeEpisode(this.selectedEpisodeId)

  _onPressRemoveEpisode = episodeId => {
    this.selectedEpisodeId = episodeId
    this.actionSheet.show()
  }

  render() {
    const { episodes, isFetching } = this.props
    return isFetching && R.isEmpty(episodes) ? (
      <Preloader renderContainer />
    ) : (
      !R.isEmpty(episodes) && (
        <React.Fragment>
          <FlatList
            data={episodes}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
          />
          <ActionSheet
            ref={o => (this.actionSheet = o)}
            options={['Cancel', 'Remove from Device']}
            cancelButtonIndex={0}
            onPress={this._onPressActionSheet}
          />
        </React.Fragment>
      )
    )
  }
}

export default EpisodesList
