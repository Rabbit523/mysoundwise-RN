import icon from './Contacts.png'
import activeIcon from './ContactsActive.png'
import styled from 'styled-components'

const ProfileIcon = styled.Image.attrs({
  source: ({ active }) => (active ? activeIcon : icon),
})``

export default ProfileIcon
