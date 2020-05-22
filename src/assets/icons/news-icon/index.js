import icon from './News.png'
import activeIcon from './NewsActive.png'
import styled from 'styled-components'

const NewsIcon = styled.Image.attrs({
  source: ({ active }) => (active ? activeIcon : icon),
})``

export default NewsIcon
