import React from 'react'
import styled from 'styled-components'
import R from 'ramda'
import { CachedImage } from 'react-native-cached-image'
import { Linking, Dimensions } from 'react-native'
import { StyledText, TEXT_COLOR, TEXT_SIZE } from '../../components'
import PDF from 'react-native-pdf'
import HTML from 'react-native-render-html'
import { isExists } from '../../utils'

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = Dimensions.get('window')

const USED_SPACE = 300

// 15 - horizontal padding from screen borders
const PLAYER_IMAGE_DIMENTION =
  DEVICE_WIDTH < DEVICE_HEIGHT - USED_SPACE
    ? DEVICE_WIDTH - 15
    : DEVICE_HEIGHT - USED_SPACE

const Container = styled.View`
  flex: 1;
  align-self: center;
  width: ${DEVICE_WIDTH}px;
`

const Tab = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-width: ${({ active, theme }) => (active ? 1 : 0)};
  border-bottom-width: 0px;
  border-color: ${({ active, theme }) =>
    active ? theme.color.border : 'transparent'};
  background-color: ${({ active, theme }) =>
    active ? theme.color.mainWhite : theme.color.mainOrange};
  width: ${DEVICE_WIDTH / 3 - 10 - 10}px;
  padding: 9px 5px 12px;
`

const TabText = StyledText.extend.attrs({
  color: TEXT_COLOR.FONT_BLACK,
  size: TEXT_SIZE.XS,
})`
  text-align: center;
`

const ActionText = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
})`
  margin: 10px;
`

const TrackImage = styled(CachedImage).attrs({
  imageStyle: ({ theme }) => ({
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowColor: theme.color.border,
    resizeMode: 'contain',
  }),
})`
  align-self: center;
  width: ${PLAYER_IMAGE_DIMENTION}px;
  height: ${PLAYER_IMAGE_DIMENTION}px;
`

const Image = styled(CachedImage)`
  align-self: center;
  width: ${PLAYER_IMAGE_DIMENTION}px;
  height: ${PLAYER_IMAGE_DIMENTION}px;
`

const StyledPDF = styled(PDF)`
  width: ${PLAYER_IMAGE_DIMENTION}px;
  height: ${PLAYER_IMAGE_DIMENTION}px;
`

const TabRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
`

const TabContentWrapper = styled.ScrollView`
  width: 100%;
  background-color: ${({ theme }) => theme.color.mainWhite};
  flex: 1;
  border-color: ${({ theme }) => theme.color.borderAlt};
  border-top-width: 1px;
`

const TABS = {
  NOTES: 0,
  ACTION: 1,
  DESCRIPTION: 2,
}

class PlayerTab extends React.PureComponent {
  state = {
    activeTab: this.props.notes
      ? TABS.NOTES
      : this.props.actionstep
        ? TABS.ACTION
        : TABS.DESCRIPTION,
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
    const { notes, description, actionstep, imageUrl } = this.props
    const { activeTab } = this.state
    return (
      <Container>
        {isExists(description) || isExists(notes) || isExists(actionstep) ? (
          <React.Fragment>
            <TabRow>
              {isExists(actionstep) && (
                <Tab
                  onPress={() => this.setState({ activeTab: TABS.ACTION })}
                  active={activeTab === TABS.ACTION}
                >
                  <TabText>Action</TabText>
                </Tab>
              )}
              {isExists(description) && (
                <Tab
                  onPress={() => this.setState({ activeTab: TABS.DESCRIPTION })}
                  active={activeTab === TABS.DESCRIPTION}
                >
                  <TabText>Description</TabText>
                </Tab>
              )}
              {isExists(notes) && (
                <Tab
                  onPress={() => this.setState({ activeTab: TABS.NOTES })}
                  active={activeTab === TABS.NOTES}
                >
                  <TabText>Notes</TabText>
                </Tab>
              )}
            </TabRow>
            <TabContentWrapper>
              {activeTab === TABS.DESCRIPTION ? (
                <HTML
                  onLinkPress={this._handleLinkPress}
                  containerStyle={{
                    margin: 10,
                  }}
                  html={description}
                />
              ) : activeTab === TABS.NOTES ? (
                R.endsWith('.pdf', notes) ? (
                  <StyledPDF
                    fitWidth
                    source={{
                      uri: notes,
                    }}
                  />
                ) : (
                  <Image
                    source={{
                      uri: notes,
                    }}
                  />
                )
              ) : (
                <ActionText>{actionstep}</ActionText>
              )}
            </TabContentWrapper>
          </React.Fragment>
        ) : (
          <TrackImage source={{ uri: imageUrl }} />
        )}
      </Container>
    )
  }
}

export default PlayerTab
