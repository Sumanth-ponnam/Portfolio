# Front-End

Signup UI (React Native + Expo)
---
Mobile-first Sign Up screen built with React Native (Expo).
Includes a country-code phone picker with E.164 normalization, react-hook-form validation that shows errors only after blur/submit, and automatic Light/Dark theming via useColorScheme().
Features


- 📱 iOS / Android / Web via Expo
- 🌐 Country picker phone input (react-native-international-phone-number)
- ✅ E.164 phone normalization (libphonenumber-js)
- 🧭 Blur-only validation UX (react-hook-form)
- 🌓 Dark/Light theme (auto, from system)
- ♿ Accessibility: announces first error on submit
- ⌨️ Keyboard-safe layout (ScrollView + KeyboardAvoidingView)
- ✨ Pressed state for CTA (subtle color change)

---

Tech

- React Native (Expo)
- react-hook-form
- react-native-international-phone-number
- libphonenumber-js

---

Prerequisites

- Node 20 LTS
  Homebrew:
  brew install node@20
  brew link --overwrite --force node@20
  echo 'export PATH="/usr/local/opt/node@20/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
  node -v
  Expect v20.x

  Optional on macOS
  brew install watchman

---

Getting Started

npm install
npm i -D @expo/ngrok@^4.1.0
npx expo start --tunnel -c

In the Dev Tools page, set Connection → Tunnel, then open Expo Go and scan the QR.
iOS: Settings → Expo Go → enable Local Network.
Disable VPN or Private DNS while testing.

Alternatives
npx expo start --lan -c
npx expo start --web

---

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

Place high-dpi logo variants next to logo.png as logo@2x.png and logo@3x.png.
React Native will pick the correct scale automatically; visual size stays the same.

---

How It Works

- Validation timing
  useForm with mode set to onBlur and reValidateMode set to onChange
  No errors while typing; errors appear after blur or submit.
  The phone field uses value presence as interaction because the picker may not emit onBlur.

- Rules
  Full Name: required
  Email: required with a basic email pattern
  Phone: required and normalized to E.164 on submit
  Password: required with minimum length 6
  Confirm: must match Password

- Theming
  useColorScheme toggles between token sets for dark and light.

- Submit
  Phone is normalized using the chosen country calling code with libphonenumber-js.

---

Scripts (optional)

start with tunnel
expo start --tunnel -c

start on web
expo start --web

Add these as npm scripts in package.json if you want shortcuts.

---

Sharing with Teammates

- Expo Go
  Run with tunnel and share the QR from Dev Tools.

- No app installs
  Run on web and share the local URL, or deploy the web build to a static host.

---

Troubleshooting

Red screen or request timed out or could not connect to development server
1. Use a tunnel
   npm i -D @expo/ngrok@^4.1.0
   npx expo start --tunnel -c
2. In Expo Go, clear cache or reinstall
3. iOS: enable Local Network for Expo Go and disable VPN or Private DNS
4. Try a personal hotspot if office Wi-Fi blocks dev traffic
5. Reset watchers if needed
   watchman watch-del-all
   watchman shutdown-server

Wrong Node version
Use Node 20 LTS. If node -v is not v20.x, fix PATH or use nvm.

---

Roadmap

- Password strength meter
- Terms and Privacy consent links
- i18n for labels and errors
- Haptics on success and error
- Tests with Detox and unit validation

---

License

Proprietary or internal. Update as needed.
