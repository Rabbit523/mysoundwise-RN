import React from 'react'
import R from 'ramda'
import { findNodeHandle, Platform } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import ActionSheet from 'react-native-actionsheet'
import styled from 'styled-components'
import {
  StyledText,
  TEXT_COLOR,
  TEXT_SIZE,
  Avatar,
  HeaderArrowButton,
  TEXT_WEIGHT,
} from '../components'

import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { PlayerViewContainer as PlayerView } from '../containers'
import * as NavigationService from '../NavigationService'

const Scroll = styled(KeyboardAwareScrollView).attrs({
  contentContainerStyle: {
    paddingVertical: 25,
    paddingHorizontal: 22,
  },
})`
  flex: 1;
`

const ChangeProfileButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  margin-top: 11px;
`

const AvatarContainer = styled.View`
  align-items: center;
  margin-bottom: 33px;
`

const BoldText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXXM,
  weight: TEXT_WEIGHT.BOLD,
})``

const Label = BoldText.extend`
  flex: 3;
`

const OrangeText = BoldText.extend.attrs({
  color: TEXT_COLOR.MAIN_ORANGE,
})``

const Input = styled.TextInput.attrs({ underlineColorAndroid: 'transparent' })`
  font-size: ${({ theme }) => theme.size.xxxm}px;
  color: ${({ theme, linkColor }) =>
    linkColor ? theme.color.linkBlue : theme.color.mainBlack};
  border-bottom-width: 1px;
  flex: 7;
  padding-bottom: 5px;
  border-color: ${({ theme }) => theme.color.border};
`

const Row = styled.View`
  flex-direction: row;
  margin-bottom: 27px;
`

const Form = ({ rows }) => (
  <React.Fragment>
    {rows.map(({ title, ...rest }, key) => (
      <Row key={key}>
        <Label>{title}</Label>
        <Input {...rest} />
      </Row>
    ))}
  </React.Fragment>
)

class Edit extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <HeaderArrowButton
        left={false}
        showIcon={false}
        bold
        onPress={() => {
          navigation.state.params.handleSave()
          NavigationService.goBack()
        }}
      >
        Save
      </HeaderArrowButton>
    ),
  })

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this._saveUser })
  }

  constructor(props) {
    super(props)
    const {
      userInfo: { firstName, lastName, picUrl, link = '', bio = '' },
    } = this.props
    this.state = {
      picUrl,
      bio,
      link,
      name: [firstName, lastName].join(' '),
      imageSource: null,
    }
    this.pickerOptions = {
      quality: 1.0,
      maxWidth: 200,
      maxHeight: 200,
      storageOptions: {
        skipBackup: true,
      },
    }
  }

  _launchCamera = () =>
    ImagePicker.launchCamera(this.pickerOptions, response => {
      !response.didCancel &&
        this.setState({ picUrl: response.uri, imageSource: response })
    })

  _openLibrary = () =>
    ImagePicker.launchImageLibrary(this.pickerOptions, response => {
      !response.didCancel &&
        this.setState({ picUrl: response.uri, imageSource: response })
    })

  _saveUser = async () => {
    const { requestUpdateUserInfo } = this.props
    const { imageSource, name } = this.state
    let updatedUser = R.pick(['bio', 'link'], this.state)
    const [firstName = '', lastName = ''] = name.split(' ')
    updatedUser = {
      ...updatedUser,
      firstName,
      lastName,
    }
    let file
    if (imageSource !== null) {
      file = R.pick(['type', 'uri'], imageSource)
      file.name =
        encodeURIComponent(`${firstName}-${lastName}`) +
        `-${moment().format('X')}.${imageSource.uri.split('.').pop()}`
    }
    requestUpdateUserInfo({
      updatedUser,
      userPictureFile: file,
    })
  }

  _showActionSheet = () => this.ActionSheet.show()

  render() {
    const { name, link, bio, picUrl } = this.state
    const {
      userInfo: { firstName, lastName },
    } = this.props
    return (
      <PlayerView>
        <Scroll innerRef={ref => (this.scroll = ref)} keyboardOpeningTime={0}>
          <AvatarContainer>
            <Avatar
              firstName={firstName}
              lastName={lastName}
              imageUrl={picUrl}
              size={122}
            />
            <ChangeProfileButton onPress={this._showActionSheet}>
              <OrangeText>Change profile picture</OrangeText>
            </ChangeProfileButton>
          </AvatarContainer>
          <Form
            rows={[
              {
                title: 'Name',
                value: name,
                onChangeText: text => this.setState({ name: text }),
              },
              {
                title: 'Website',
                value: link,
                selectTextOnFocus: true,
                linkColor: true,
                autoCorrect: false,
                onChangeText: text => this.setState({ link: text }),
              },
              {
                title: 'Bio',
                value: bio,
                maxLength: 150,
                multiline: true,
                onContentSizeChange:
                  Platform.OS === 'ios' ? this._scrollIfNeeded : undefined,
                onChangeText: text => this.setState({ bio: text }),
              },
            ]}
          />
        </Scroll>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          options={['Cancel', 'Choose from library', 'Open camera']}
          cancelButtonIndex={0}
          onPress={i =>
            i === 1 ? this._openLibrary() : i === 2 && this._launchCamera()
          }
        />
      </PlayerView>
    )
  }

  _scrollIfNeeded = ({
    nativeEvent: {
      contentSize: { height },
    },
    target,
  }) => {
    if (!this[target]) {
      this[target] = height
      return
    } else {
      if (this[target] !== height) {
        this[target] = height
        this._scrollToInput(target)
      }
    }
  }

  _scrollToInput = target =>
    this.scroll.scrollToFocusedInput(findNodeHandle(target))
}

export default Edit
