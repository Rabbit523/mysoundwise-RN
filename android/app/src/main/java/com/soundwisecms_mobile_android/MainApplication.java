package com.soundwisecms_mobile_android;

import android.app.Application;

import com.crashlytics.android.Crashlytics;
import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.tanguyantoine.react.MusicControl;
import com.microsoft.codepush.react.CodePush;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.eko.RNBackgroundDownloaderPackage;
import com.horcrux.svg.SvgPackage;
import io.fabric.sdk.android.Fabric;
import org.wonday.pdf.RCTPdfView;
import com.brentvatne.react.ReactVideoPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.smixx.fabric.FabricPackage;
import com.imagepicker.ImagePickerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(new MainReactPackage(), new MusicControl(),
          new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG), new FabricPackage(),
          new SvgPackage(), new RCTPdfView(), new ReactVideoPackage(), new RNFetchBlobPackage(), new RNBackgroundDownloaderPackage(),
          new ImagePickerPackage(), new FBSDKPackage(mCallbackManager), new RNFirebasePackage(),
          new RNFirebaseAuthPackage(), new SplashScreenReactPackage(), new RNFirebaseDatabasePackage(),
          new RNFirebaseMessagingPackage(), new RNFirebaseNotificationsPackage());
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
