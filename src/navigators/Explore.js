import React from 'react'
import { createStackNavigator } from 'react-navigation'
import {
  ExploreContainer,
  ExploreDetailsContainer,
  SoundcastDetailsContainer,
  BundleSoundcastDetailsContainer,
} from '../containers'
import { HeaderArrowButton, AbsoluteHeader } from '../components'
import * as NavigationService from '../NavigationService'
import { getHeaderTitleStyle, getHeaderStyle } from '../utils'
import theme from '../theme'

const ExploreTab = createStackNavigator(
  {
    Explore: {
      screen: ExploreContainer,
      navigationOptions: {
        title: 'Explore',
      },
    },
    ExploreDetails: {
      screen: ExploreDetailsContainer,
    },
    SoundcastDetails: {
      screen: SoundcastDetailsContainer,
      navigationOptions: {
        header: (
          <AbsoluteHeader backgroundColor="transparent">
            <HeaderArrowButton onPress={NavigationService.goBack}>
              Back
            </HeaderArrowButton>
          </AbsoluteHeader>
        ),
      },
    },
    SoundcastBundleDetails: {
      screen: BundleSoundcastDetailsContainer,
      navigationOptions: {
        header: (
          <AbsoluteHeader backgroundColor="transparent">
            <HeaderArrowButton onPress={NavigationService.goBack}>
              Back
            </HeaderArrowButton>
          </AbsoluteHeader>
        ),
      },
    },
  },
  {
    initialRouteName: 'Explore',
    headerMode: 'screen',
    cardStyle: { backgroundColor: theme.color.mainWhite },
    navigationOptions: {
      headerTitleStyle: getHeaderTitleStyle(),
      headerStyle: getHeaderStyle(),
    },
  },
)

export default ExploreTab
