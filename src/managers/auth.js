import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk'
import firebase from 'react-native-firebase'
import { renameKeys } from '../utils'
import { TEST_BASE_URL } from '../api'

// TODO: wait for accepting permissions on FB
export const showFacebookModal = () =>
  LoginManager.logInWithReadPermissions([
    'public_profile',
    'email',
    // 'user_age_range',
    // 'user_gender',
    // 'user_link',
  ]).then(
    result =>
      result.isCancelled ? false : AccessToken.getCurrentAccessToken(),
  )
// TODO: wait for accepting permissions on FB
export const getUserInfoFromFacebook = token => {
  const profileRequestParams = {
    fields: {
      // string: 'id,first_name,last_name,email,age_range,link,gender,locale',
      string: 'id,first_name,last_name,email,locale',
    },
  }
  const profileRequestConfig = {
    httpMethod: 'GET',
    version: 'v3.0',
    parameters: profileRequestParams,
    accessToken: token.accessToken.toString(),
  }
  return new Promise((resolve, reject) => {
    const request = new GraphRequest(
      '/me',
      profileRequestConfig,
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          const userInfo = renameKeys(
            { first_name: 'firstName', last_name: 'lastName' },
            result,
          )
          userInfo.pic_url = `https://graph.facebook.com/v3.0/${
            userInfo.id
          }/picture?type=normal`
          resolve(userInfo)
        }
      },
    )
    new GraphRequestManager().addRequest(request).start()
  })
}

export const findUserByEmail = email =>
  firebase
    .auth()
    .signInWithEmailAndPassword(
      email.trim().toLowerCase(),
      'e73df5b16b34c7160e0f6c33a082f559',
    ) // md5 of package.json
    .catch(err => err)

export const signInWithCredential = credential =>
  firebase.auth().signInWithCredential(credential)

export const signInWithEmailAndPassword = (email, password) =>
  firebase
    .auth()
    .signInWithEmailAndPassword(email.trim().toLowerCase(), password.trim())

export const signUpWithEmailAndPassword = (email, password) =>
  firebase
    .auth()
    .createUserWithEmailAndPassword(email.trim().toLowerCase(), password.trim())

export const firebaseSignOut = () => firebase.auth().signOut()

export const facebookSignOut = () => LoginManager.logOut()

export const checkIfUserExists = () =>
  firebase
    .database(TEST_BASE_URL)
    .ref(`users/${firebase.auth().currentUser.uid}`)
    .once('value')
    .then(snapshot => snapshot.exists())
