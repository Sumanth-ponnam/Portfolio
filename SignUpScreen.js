import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PhoneInput from 'react-native-international-phone-number';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

// Polyfill must be run early before any code that uses Symbol or iterators
if (Platform.OS === 'android' && typeof Symbol === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  global.Symbol = require('es6-symbol/implement');

  if (Array.prototype[Symbol.iterator] === undefined) {
    // eslint-disable-next-line no-extend-native
    Array.prototype[Symbol.iterator] = function () {
      let i = 0;
      return {
        next: () => ({ done: i >= this.length, value: this[i++] }),
      };
    };
  }
}

export default function SignUpScreen() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({
    password: false,
    confirm: false,
  });

  const validate = () => {
    setError({
      password: password.length < 6,
      confirm: password !== confirmPassword,
    });
  };

  const handleSelectedCountry = (country) => {
    setSelectedCountry(country);
  };

  const onGooglePress = () => {
    // TODO: hook up Google auth (expo-auth-session or native module)
  };

  const onApplePress = () => {
    // TODO: hook up Apple auth (expo-apple-authentication or native module)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
      />

      {/* Phone input */}
      <PhoneInput
        value={phoneNumber}
        onChangePhoneNumber={setPhoneNumber}
        selectedCountry={selectedCountry}
        onChangeSelectedCountry={handleSelectedCountry}
        placeholder="Phone number"
        phoneInputStyles={{
          container: styles.input, // outer pill
          flagContainer: {
            borderTopLeftRadius: 26,
            borderBottomLeftRadius: 26,
            backgroundColor: 'transparent',
            paddingLeft: 2,
          },
          divider: { opacity: 0.2 },
          callingCode: { marginRight: 6, color: '#222' },
          input: {
            ...styles.phoneInputText,
            borderTopRightRadius: 26,
            borderBottomRightRadius: 26,
            backgroundColor: 'transparent',
          },
        }}
      />

      {/* Password */}
      <View style={[styles.input, error.password && styles.errorInput]}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          textContentType="newPassword"
          onChangeText={setPassword}
          onBlur={validate}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
        >
          <MaterialCommunityIcons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      {error.password && (
        <Text style={styles.errorText}>Password must be at least 6 characters</Text>
      )}

      {/* Confirm Password */}
      <View style={[styles.input, error.confirm && styles.errorInput]}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          secureTextEntry={!showPassword}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          textContentType="password"
          onChangeText={setConfirmPassword}
          onBlur={validate}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
        >
          <MaterialCommunityIcons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      {error.confirm && (
        <Text style={styles.errorText}>Passwords don’t match</Text>
      )}

      <View style={styles.forgotRow}>
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <View style={styles.orRow}>
        <View style={styles.divider} />
        <Text style={styles.orText}>Or sign up with</Text>
        <View style={styles.divider} />
      </View>

      {/* Logo-only social buttons (side by side, centered) */}
      <View style={styles.socialRowInline}>
        <TouchableOpacity
          style={[styles.socialIconBtn, styles.googleCircle]}
          onPress={onGooglePress}
          accessibilityLabel="Sign in with Google"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image
            source={require('../../assets/images/google_g.png')}
            style={styles.socialIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialIconBtn, styles.appleCircle]}
          onPress={onApplePress}
          accessibilityLabel="Sign in with Apple"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons name="apple" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Centered "Have an account? / Log in" */}
      <View style={styles.loginCol}>
        <Text style={styles.haveAccount}>Have an account?</Text>
        <TouchableOpacity>
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 28,
    justifyContent: 'center',
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 38,
    color: '#222',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    paddingHorizontal: 18,
    paddingVertical: 13,
    fontSize: 17,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    color: '#000',
  },
  phoneInputText: {
    fontSize: 17,
    color: '#000',
    paddingVertical: 0,
  },
  errorInput: {
    borderColor: '#db3d3d',
  },
  errorText: {
    color: '#db3d3d',
    marginTop: 4,
    marginBottom: 10,
    marginLeft: 8,
    fontSize: 14,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  forgotText: {
    color: '#a75eda',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#a75eda',
    borderRadius: 50,
    alignItems: 'center',
    paddingVertical: 17,
    marginTop: 8,
    marginBottom: 18,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  orText: {
    color: '#7e3bf2',
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ececec',
  },

  /* --- logo-only socials in a row --- */
  socialRowInline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  socialIconBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleCircle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#747775',
    marginRight: 12, // space between Google & Apple
  },
  appleCircle: {
    backgroundColor: '#000',
  },
  socialIcon: { width: 22, height: 22, resizeMode: 'contain' },

  /* --- centered login --- */
  loginCol: {
    alignItems: 'center',
    marginTop: 8,
  },
  haveAccount: {
    color: '#222',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  loginText: {
    color: '#a75eda',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
