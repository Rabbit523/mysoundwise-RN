import icon from './Explore.png'
import activeIcon from './ExploreActive.png'
import styled from 'styled-components'

const ExploreIcon = styled.Image.attrs({
  source: ({ active }) => (active ? activeIcon : icon),
})``

export default ExploreIcon
