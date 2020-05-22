import icon from './Message.png'
import activeIcon from './MessageActive.png'
import styled from 'styled-components'

const MessageIcon = styled.Image.attrs({
  source: ({ active }) => (active ? activeIcon : icon),
})``

export default MessageIcon
