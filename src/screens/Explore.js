import React from 'react'
import R from 'ramda'
import {
  SearchSoundcast,
  ExploreList,
  SearchBar,
  Preloader,
} from '../components'
import {
  PlayerViewContainer as PlayerView,
  ThemedRefreshControlContainer as RefreshControl,
} from '../containers'
import * as NavigationService from '../NavigationService'
import styled from 'styled-components'

const Container = styled.View`
  flex: 1;
`

const FlatList = styled.FlatList.attrs({
  contentContainerStyle: { paddingVertical: 7 },
})``

const SearchList = styled.FlatList.attrs({
  initialNumToRender: 7,
  onEndReachedThreshold: 0.1,
})``

const FooterLoaderWrapper = styled.View`
  height: 107px;
`

const FooterLoader = ({ isFetching }) =>
  isFetching && (
    <FooterLoaderWrapper>
      <Preloader renderContainer />
    </FooterLoaderWrapper>
  )

const RENDER_MODES = {
  SEARCH: 'SEARCH',
  CATEGORY: 'CATEGORY',
}

class Explore extends React.PureComponent {
  _renderItem = ({ item: { soundcasts, title, categoryId } }) => (
    <ExploreList
      onPressMore={this._handlePressMore}
      onPressSoundcast={this._handlePressSoundcast}
      title={title}
      categoryId={categoryId}
      soundcasts={soundcasts}
    />
  )

  _handlePressMore = ({ title, categoryId }) => {
    this.props.selectCategory(categoryId)
    NavigationService.navigate('ExploreDetails', { title })
  }

  _getSearchItemLayout = (_, index) => ({
    length: SearchSoundcast.ITEM_HEIGHT,
    offset: SearchSoundcast.ITEM_HEIGHT * index,
    index,
  })

  _handlePressSoundcast = soundcastId => {
    this.props.selectExploreSoundcast(soundcastId)
    NavigationService.navigate('SoundcastDetails')
  }

  _renderSearchItem = ({
    item: { title, publisherName, imageUrl, soundcastId },
  }) => {
    const subtitle =
      publisherName !== undefined &&
      publisherName !== null &&
      publisherName.toLowerCase() !== 'online imported podcast'
        ? publisherName
        : ''
    return (
      <SearchSoundcast
        title={title}
        imageUrl={imageUrl}
        subtitle={subtitle}
        soundcastId={soundcastId}
        onPress={this._handlePressSoundcast}
      />
    )
  }

  _categoryKeyExtractor = ({ categoryId }) => categoryId

  _soundcastKeyExtractor = ({ soundcastId }) => soundcastId

  componentDidMount() {
    this._loadData()
  }

  _loadData = () => {
    const {
      isFetchingUserSoundcasts,
      requestSuggestions,
      // requestCategories,
    } = this.props

    if (!isFetchingUserSoundcasts) {
      this.setState({ dataLoaded: true })
      requestSuggestions()
      // requestCategories()
    }
  }

  componentDidUpdate() {
    if (!this.state.dataLoaded && !this.props.isFetchingUserSoundcasts) {
      this._loadData()
    }
  }

  state = {
    mode: RENDER_MODES.CATEGORY,
    searchWord: '',
    dataLoaded: false,
  }

  _handleRefreshCategories = () => this.props.refreshCategories()

  _renderCategoriesContent = () => {
    const {
      isFetchingUserSoundcasts,
      isFetchingSuggestions,
      // isFetchingCategories,
      isRefreshing,
      categories,
    } = this.props

    return R.isEmpty(categories) &&
      (isFetchingUserSoundcasts ||
        /* isFetchingCategories &&  */ isFetchingSuggestions) ? (
      <Preloader renderContainer />
    ) : (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={this._handleRefreshCategories}
          />
        }
        keyExtractor={this._categoryKeyExtractor}
        renderItem={this._renderItem}
        data={categories}
      />
    )
  }

  _renderSearchContent = () => {
    const { isSearching, searchSoundcasts } = this.props
    return isSearching && R.isEmpty(searchSoundcasts) ? (
      <Preloader renderContainer />
    ) : (
      !R.isEmpty(searchSoundcasts) && (
        <SearchList
          renderItem={this._renderSearchItem}
          keyExtractor={this._soundcastKeyExtractor}
          getItemLayout={this._getSearchItemLayout}
          data={searchSoundcasts}
          onEndReached={this._handleEndReached}
          ListFooterComponent={<FooterLoader isFetching={isSearching} />}
        />
      )
    )
  }

  _handleSearch = text => {
    let mode
    if (text.length === 0) mode = RENDER_MODES.CATEGORY
    else mode = RENDER_MODES.SEARCH
    this.setState({ mode, searchWord: text })
    this.props.requestSearchSoundcasts(text)
  }

  _handleCancelSearch = () => this._handleSearch('')

  _handleEndReached = () => {
    const { requestSearchSoundcasts, isPagesEnded } = this.props
    if (!isPagesEnded) {
      requestSearchSoundcasts(this.state.searchWord)
    }
  }

  render() {
    return (
      <PlayerView>
        <Container>
          <SearchBar
            search={this._handleSearch}
            placeholderText="Search Soundwise"
            showCancelButton={!!this.state.searchWord}
            onCancel={this._handleCancelSearch}
          />
          {this.state.mode === RENDER_MODES.CATEGORY
            ? this._renderCategoriesContent()
            : this._renderSearchContent()}
        </Container>
      </PlayerView>
    )
  }
}

export default Explore
