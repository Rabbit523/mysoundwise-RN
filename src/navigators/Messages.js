import React from 'react'
import { createStackNavigator } from 'react-navigation'
import {
  MessageLikesListContainer,
  MessageDetailsContainer,
  OtherProfileContainer,
  MessagesContainer,
} from '../containers'
import { HeaderArrowButton } from '../components'
import * as NavigationService from '../NavigationService'
import { getHeaderStyle, getHeaderTitleStyle } from '../utils'
import theme from '../theme'

const MessagesTab = createStackNavigator(
  {
    Messages: {
      screen: MessagesContainer,
    },
    MessageDetails: {
      screen: MessageDetailsContainer,
    },
    MessageLikes: {
      screen: MessageLikesListContainer,
    },
    OtherProfileMessages: {
      screen: OtherProfileContainer,
      navigationOptions: {
        headerLeft: <HeaderArrowButton onPress={NavigationService.goBack} />,
      },
    },
  },
  {
    cardStyle: { backgroundColor: theme.color.mainWhite },
    headerMode: 'screen',
    navigationOptions: {
      headerTitleStyle: getHeaderTitleStyle(),
      headerStyle: getHeaderStyle(),
    },
  },
)

export default MessagesTab
