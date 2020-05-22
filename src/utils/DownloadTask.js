import { DOCUMENT_DIR } from '../constants'
import RNBackgroundDownloader from 'react-native-background-downloader'

const bgTasks = {}

export const bgDownloadCancel = (episodeId, removeDownloadTask) => {
  if (bgTasks[episodeId]) {
    bgTasks[episodeId].stop()
    delete bgTasks[episodeId]
  }
  removeDownloadTask({ episodeId })
}

export const bgDownloadEpisode = (
  episodeId,
  updateDownloadTask,
  removeDownloadTask,
  episodeLoaded,
  url = null,
  task = null,
) => {
  let destination
  if (task !== null) {
    console.log(`ext is ${url}`)
    destination = `${DOCUMENT_DIR + episodeId}.${url}`
    bgTasks[episodeId] = task
  } else if (bgTasks[episodeId] === undefined) {
    console.log(`episode: ${episodeId}, url is ${url}`)
    const ext = url.split('.').pop()
    destination = `${DOCUMENT_DIR + episodeId}.${ext}`
    bgTasks[episodeId] = RNBackgroundDownloader.download({
      id: `${episodeId}.${ext}`,
      url,
      destination,
    }).begin(expectedBytes => {
      console.log(`${episodeId}: Going to download ${expectedBytes} bytes!`)
      updateDownloadTask({ episodeId, progress: 0 })
    })
  }
  bgTasks[episodeId]
    .progress(progress => {
      console.log(`${episodeId}: Downloaded: ${progress * 100}%`)
      if (progress <= 0.9) {
        updateDownloadTask({ episodeId, progress })
      }
    })
    .done(() => {
      console.log(`${episodeId}: Download is done!`)
      episodeLoaded({ [episodeId]: destination })
      bgDownloadCancel(episodeId, removeDownloadTask)
    })
    .error(error => {
      console.log(`${episodeId} Download canceled due to error: `, error)
      bgDownloadCancel(episodeId, removeDownloadTask)
    })
  bgTasks[episodeId].resume()
}

// Re-Attaching to background downloads
export const reattachingDownloads = async (
  updateDownloadTask,
  removeDownloadTask,
  episodeLoaded,
) => {
  let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads()
  for (let i = 0; i < lostTasks.length; i += 1) {
    let task = lostTasks[i]
    console.log('Re-Attaching to background downloads: task.id = ', task.id)
    const episodeId_ext = task.id.split('.', 2)
    bgDownloadEpisode(
      episodeId_ext[0],
      updateDownloadTask,
      removeDownloadTask,
      episodeLoaded,
      episodeId_ext[1],
      task,
    )
  }
}
