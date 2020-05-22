import React from 'react'
import R from 'ramda'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Linking, FlatList } from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import {
  Preloader,
  StyledText,
  TEXT_SIZE,
  TEXT_COLOR,
  TEXT_WEIGHT,
} from '../components'
import { MinusIcon, ArrowRightIcon } from '../assets/icons'
import {
  LogoutContainer as Logout,
  PlayerViewContainer as PlayerView,
} from '../containers'
import { URLS } from '../constants'

const Touchable = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })``

const Scroll = styled.ScrollView.attrs({
  contentContainerStyle: { paddingVertical: 34 },
})`
  flex: 1;
`

const BlockWrapper = styled.View`
  margin-bottom: 40px;
`

const HeaderText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXXM,
  color: TEXT_COLOR.FONT_GREY,
  weight: TEXT_WEIGHT.BOLD,
})``

const HeaderWrapper = styled.View`
  padding: 0px 19px 3px 19px;
  border-bottom-width: 1.5px;
  border-color: ${({ theme }) => theme.color.divider};
`

const BlockHeader = ({ children }) => (
  <HeaderWrapper>
    <HeaderText>{children}</HeaderText>
  </HeaderWrapper>
)

const Block = ({ children, title }) => (
  <BlockWrapper>
    <BlockHeader>{title}</BlockHeader>
    {children}
  </BlockWrapper>
)

const Text = StyledText.extend.attrs({
  size: TEXT_SIZE.XXXM,
})`
  flex-shrink: 1;
`

const BoldText = Text.extend.attrs({
  weight: TEXT_WEIGHT.BOLD,
})``

const MinusButton = Touchable.extend`
  padding: 5px;
  margin-left: 5px;
`

const SubscribtionItemWrapper = styled.View`
  margin-top: 11px;
  margin-left: 19px;
  padding-bottom: 10px;
  border-bottom-width: 1.5px;
  border-color: ${({ theme }) => theme.color.divider};
  flex-direction: row;
  justify-content: space-between;
  padding-right: 25px;
  align-items: center;
`

class SubscribtionItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onDeleteSubscription: PropTypes.func.isRequired,
  }

  render() {
    const {
      item: { title },
    } = this.props

    return (
      <SubscribtionItemWrapper>
        <Text>{title}</Text>
        <MinusButton onPress={this._handlePress}>
          <MinusIcon />
        </MinusButton>
      </SubscribtionItemWrapper>
    )
  }

  _handlePress = () => this.props.onDeleteSubscription(this.props.item)
}

const InformationItemWrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  margin-top: 11px;
  margin-left: 19px;
  padding-bottom: 10px;
  border-bottom-width: 1.5px;
  border-color: ${({ theme }) => theme.color.divider};
  flex-direction: row;
  justify-content: space-between;
  padding-right: 35px;
  align-items: center;
`

class InformationItem extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }

  render() {
    return (
      <InformationItemWrapper onPress={this._handlePress}>
        <BoldText>{this.props.title}</BoldText>
        <ArrowRightIcon />
      </InformationItemWrapper>
    )
  }

  _handlePress = () => Linking.openURL(this.props.url)
}

class Settings extends React.Component {
  state = {
    selectedSoundcast: {},
  }

  _logout = () => this.props.logout()

  _showActionSheet = () => this.ActionSheet.show()

  _keyExtractor = soundcast => soundcast.soundcastId

  _renderItem = ({ item }) => (
    <SubscribtionItem
      item={item}
      onDeleteSubscription={this._onDeleteSubsctiption}
    />
  )

  _onDeleteSubsctiption = selectedSoundcast =>
    this.setState({ selectedSoundcast }, this._showActionSheet)

  render() {
    const {
      userSoundcasts,
      isFetchingSoundcasts,
      requestUnsubscribe,
      isFetchingUnsubscribe,
    } = this.props
    const { selectedSoundcast } = this.state
    return (
      <PlayerView>
        <Scroll>
          {(isFetchingUnsubscribe || isFetchingSoundcasts) &&
          R.isEmpty(userSoundcasts) ? (
            <Preloader />
          ) : (
            !R.isEmpty(userSoundcasts) && (
              <Block title="Subscription Setting">
                <FlatList
                  data={userSoundcasts}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderItem}
                />
              </Block>
            )
          )}
          <Block title="Information">
            <InformationItem title="Privacy Policy" url={URLS.POLICY} />
            <InformationItem title="Terms of Use" url={URLS.TERMS_OF_USE} />
          </Block>
          <Logout />
        </Scroll>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={`Are you sure that you want to remove ${
            selectedSoundcast.title
          }?`}
          options={['Cancel', 'Unsubscribe']}
          cancelButtonIndex={0}
          styles={{
            titleText: { textAlign: 'center', paddingHorizontal: 10 },
          }}
          onPress={i => {
            i === 1 && requestUnsubscribe(selectedSoundcast)
          }}
        />
      </PlayerView>
    )
  }
}

export default Settings
