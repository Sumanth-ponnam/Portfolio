WUD Front-End (React Native + Expo)

Mobile-first Sign Up flow built with React Native and Expo.
Includes a country-code phone picker with E.164 normalization, blur-first form validation that shows errors only after blur or submit, automatic Light and Dark theming via useColorScheme, and an accessible, keyboard-safe layout.

Features

Runs on iOS, Android, and Web with Expo

Country picker phone field using react-native-international-phone-number

E.164 phone validation and formatting using libphonenumber-js

Errors only after blur or submit using react-hook-form

Dark and Light theme that follows the device setting

Announces the first error on submit via AccessibilityInfo

Keyboard-safe layout with ScrollView and KeyboardAvoidingView

CTA shows a pressed state while being tapped

Tech

React Native with Expo

react-hook-form

react-native-international-phone-number

libphonenumber-js

JavaScript or TypeScript compatible

Project Structure

app/
  screens/
    SignUpScreen.js
assets/
  images/
    logo.png
    google_g.png
docs/
  screenshot-light.png
  screenshot-dark.png
README.md


Provide high dpi logo variants logo@2x.png and logo@3x.png beside logo.png. React Native will pick the correct scale automatically and the on-screen size stays fixed.

Validation and UX Logic

useForm with mode set to onBlur and reValidateMode set to onChange
No errors while typing. Errors appear after a field is blurred or on submit.

Rules

Full Name required

Email required with pattern ^\S+@\S+.\S+$

Phone required and normalized to E.164 in onSubmit

Password required with minimum length 6

Confirm must match Password

The phone picker may not emit onBlur consistently across platforms, so its error appears after submit or once the user has typed something.

Theming
Theme tokens are computed from useColorScheme and applied inline
bg, text, subtext, inputBg, border, placeholder, error, divider, link, btn, btnPressed

Test Dark and Light

iOS Simulator use Command Shift A or menu Features then Toggle Appearance

Android Emulator use Quick Settings then Dark theme

Web use Chrome DevTools Rendering then Emulate prefers color scheme

Setup

Prerequisites

Node 20 LTS on macOS with Homebrew

brew install node@20
brew link --overwrite --force node@20
echo 'export PATH="/usr/local/opt/node@20/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
node -v


Optional on macOS install watchman

brew install watchman


Install and Run

npm install
npm i -D @expo/ngrok@^4.1.0
npx expo start --tunnel -c


In the Dev Tools page set Connection to Tunnel, open Expo Go on your phone, clear cache in Profile, and scan the QR.
On iOS enable Local Network for Expo Go in Settings.
Disable VPN or Private DNS while testing.

Alternatives

npx expo start --lan -c
npx expo start --web


Where to Wire Your API
Inside SignUpScreen.js in onSubmit

// await api.signUp({ ...values, phone: phoneE164 });


Phone Number Handling in E.164

import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';

const p = parsePhoneNumberFromString(candidate);
if (!p || !p.isValid()) {
  // show error
}
const phoneE164 = p.number; // for example +15551234567


Optional Scripts
Add to package.json

{
  "scripts": {
    "start:tunnel": "expo start --tunnel -c",
    "web": "expo start --web"
  }
}


Troubleshooting

Expo could not connect or request timed out on device

Use a Tunnel

npm i -D @expo/ngrok@^4.1.0
npx expo start --tunnel -c


In Expo Go clear cache or reinstall

On iOS enable Local Network for Expo Go and disable VPN or Private DNS

Try a personal hotspot if office Wi-Fi blocks tunnels

Reset watchers on macOS

watchman watch-del-all 2>/dev/null || true
watchman shutdown-server 2>/dev/null || true


TypeScript prompt appears
If you are not using TypeScript remove ts and tsx files.
To enable TypeScript

npx expo install typescript @types/react


Logo looks blurry
Export at the actual display size and provide 2x and 3x PNGs with no extra transparent padding.

Roadmap and Nice to Haves

Password strength meter

Terms and Privacy consent links

Internationalization for labels and errors

Haptics on success and error with Expo Haptics

Tests with Detox for end to end and unit validation

License
This project is unlicensed for now. Update the LICENSE file to match your company policy.
