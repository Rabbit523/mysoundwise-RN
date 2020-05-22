import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native'
import { Preloader } from '../../components'
import EpisodeElement from './EpisodeElement'
import ActionSheet from 'react-native-actionsheet'
import RNBackgroundDownloader from 'react-native-background-downloader'
import { DOCUMENT_DIR } from '../../constants'

class EpisodesList extends React.PureComponent {
  tasks = {}
  state = {
    downloadStates: {}
  }

  async componentDidMount() {
    console.log('EpisodesList componentDidMount')
    // Re-Attaching to background downloads
    let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads()
    for (let i = 0; i < lostTasks.length; i += 1) {
      let task = lostTasks[i]
      console.log('Re-Attaching to background downloads: episodeId=', task.id)
      this._downloadEpisode(task.id, null, task)
    }
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
    } = this.props
    const { downloadStates } = this.state
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
        downloadState={downloadStates[item.episodeId]}
        downloadEpisode={this._downloadEpisode}
        downloadCancel={this._downloadCancel}
      />
    )
  }

  static propTypes = {
    episodes: PropTypes.arrayOf(PropTypes.object),
    isFetching: PropTypes.bool,
  }

  _keyExtractor = ({ episodeId }) => episodeId

  _onPressActionSheet = index =>
    index === 1 && this.props.removeEpisode(this.selectedEpisodeId)

  _onPressRemoveEpisode = episodeId => {
    this.selectedEpisodeId = episodeId
    this.actionSheet.show()
  }

  //
  // downloading
  //
  _downloadUpdate = (episodeId, progress) => {
    const downloadStates = Object.assign({}, this.state.downloadStates)
    downloadStates[episodeId] = progress
    this.setState({ downloadStates })
  }
  _downloadCancel = (episodeId) => {
    if (this.tasks[episodeId]) {
      this.tasks[episodeId].stop()
      delete this.tasks[episodeId]
    }
    const downloadStates = Object.assign({}, this.state.downloadStates)
    if (downloadStates[episodeId] !== undefined) {
      delete downloadStates[episodeId]
      this.setState({ downloadStates })
    }
  }

  _downloadEpisode = (episodeId, url = null, task = null) => {
    const { episodeLoaded } = this.props
    const destination = `${DOCUMENT_DIR + episodeId}.${url.split('.').pop()}`

    if (task !== null) {
      this.tasks[episodeId] = task
    } else {
      this.tasks[episodeId] = RNBackgroundDownloader.download({
        id: episodeId,
        url,
        destination,
      }).begin(expectedBytes => {
        this._downloadUpdate(episodeId, 0)
        console.log(`${episodeId}: Going to download ${expectedBytes} bytes!`)
      })
    }

    this.tasks[episodeId]
      .progress(progress => {
        console.log(`${episodeId}: Downloaded: ${progress * 100}%`)
        this._downloadUpdate(episodeId, progress)
      })
      .done(() => {
        console.log(`${episodeId}: Download is done!`)
        episodeLoaded({ [episodeId]: destination })
        this._downloadCancel(episodeId)
      })
      .error(error => {
        console.warn(`${episodeId} Download canceled due to error: `, error)
        this._downloadCancel(episodeId)
      })
    this.tasks[episodeId].resume()
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
