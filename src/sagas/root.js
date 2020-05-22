import { all, call } from 'redux-saga/effects'
import { default as auth } from './auth'
import { default as user } from './user'
import { default as like } from './like'
import { default as update } from './update'
import { default as episode } from './episode'
import { default as comment } from './comment'
import { default as message } from './message'
import { default as category } from './category'
import { default as soundcast } from './soundcast'

export default function*() {
  yield all([
    call(auth),
    call(user),
    call(like),
    call(update),
    call(episode),
    call(message),
    call(comment),
    call(category),
    call(soundcast),
  ])
}
