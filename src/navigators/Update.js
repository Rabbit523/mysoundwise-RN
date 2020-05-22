import { createStackNavigator } from 'react-navigation'
import { UpdateContainer } from '../containers'
import { getHeaderTitleStyle, getHeaderStyle } from '../utils'
import theme from '../theme'

const Update = createStackNavigator(
  {
    Updates: {
      screen: UpdateContainer,
      navigationOptions: {
        title: 'Update',
      },
    },
  },
  {
    initialRouteName: 'Updates',
    headerMode: 'screen',
    cardStyle: { backgroundColor: theme.color.mainWhite },
    navigationOptions: {
      headerTitleStyle: getHeaderTitleStyle(),
      headerStyle: getHeaderStyle(),
    },
  },
)

export default Update
