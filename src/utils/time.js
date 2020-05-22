import R from 'ramda'
import moment from 'moment'

export const formatSeconds = seconds => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
}

export const formatDateForMonth = date => {
  const momentDate = R.is(Number, date) ? moment.unix(date) : moment(date)
  return moment().diff(momentDate, 'days') < 30
    ? momentDate.fromNow()
    : momentDate.format('MMM D [at] h:mm a')
}
