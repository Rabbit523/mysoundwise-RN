
echo
echo "Build release apk...."
echo "== update version in android/app/build.gradle file"
echo "== make sure the file '~/.gradle/gradle.properties' is correct"
echo "== make sure the file 'app/soundwise-release-key.keystore' is exist"
echo

./gradlew assembleRelease

