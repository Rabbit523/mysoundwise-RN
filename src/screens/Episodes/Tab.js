import { AllScreen, OnDeviceScreen } from './TabScreens'
import { createTabNavigator, TabBarTop } from 'react-navigation'
import theme from '../../theme'

const Tab = createTabNavigator(
  {
    All: {
      screen: AllScreen,
    },
    OnDevise: {
      screen: OnDeviceScreen,
      navigationOptions: {
        title: 'On Device',
      },
    },
  },
  {
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    tabBarOptions: {
      upperCaseLabel: false,
      indicatorStyle: {
        backgroundColor: theme.color.mainOrange,
        height: 3,
        bottom: -2,
      },
      labelStyle: {
        color: theme.color.fontGrey,
        fontSize: theme.size.xxm,
        margin: 0,
      },
      style: {
        backgroundColor: theme.color.mainWhite,
        height: 40,
        padding: 0,
        borderBottomColor: theme.color.border,
        borderBottomWidth: 1,
      },
    },
    lazy: false,
    animationEnabled: true,
    swipeEnabled: true,
  },
)

export default Tab
