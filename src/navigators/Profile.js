import React from 'react'
import { createStackNavigator } from 'react-navigation'
import styled from 'styled-components'
import { CogIcon } from '../assets/icons'
import { HeaderFiller, HeaderArrowButton } from '../components'
import { getHeaderStyle, getHeaderTitleStyle } from '../utils'
import * as NavigationService from '../NavigationService'
import theme from '../theme'
import {
  ProfileContainer,
  EditContainer,
  SettingsContainer,
} from '../containers'

const Touchable = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  padding: 10px;
`

const CogButton = props => (
  <Touchable {...props}>
    <CogIcon />
  </Touchable>
)

const ProfileTab = createStackNavigator(
  {
    Profile: {
      screen: ProfileContainer,
      navigationOptions: {
        headerLeft: <HeaderFiller />,
        headerRight: (
          <CogButton onPress={() => NavigationService.navigate('Settings')} />
        ),
        title: 'Me',
      },
    },
    Edit: {
      screen: EditContainer,
      navigationOptions: {
        headerLeft: (
          <HeaderArrowButton
            showIcon={false}
            onPress={() => NavigationService.goBack()}
          >
            Cancel
          </HeaderArrowButton>
        ),
        title: 'Edit Profile',
      },
    },
    Settings: {
      screen: SettingsContainer,
      navigationOptions: {
        title: 'Settings',
        headerRight: <HeaderFiller />,
        headerLeft: (
          <HeaderArrowButton onPress={() => NavigationService.goBack()} />
        ),
      },
    },
  },
  {
    initialRouteName: 'Profile',
    headerMode: 'screen',
    cardStyle: { backgroundColor: theme.color.mainWhite },
    navigationOptions: {
      headerTitleStyle: getHeaderTitleStyle(),
      headerStyle: getHeaderStyle(),
    },
  },
)

export default ProfileTab
