
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AccessibilityInfo, Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View, } from 'react-native';
import PhoneInput from 'react-native-international-phone-number';

// helper to read calling code from different shapes
function getCallingCode(country) {
  if (!country) return undefined;
  const cc = Array.isArray(country?.callingCode) ? country.callingCode[0] : country?.callingCode;
  return (cc != null ? String(cc) : undefined)
      || (country?.dialCode ? String(country.dialCode).replace('+', '') : undefined);
}

export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // === Theme tokens aligned to your UI mocks ===
  const theme = useMemo(
    () => ({
      bg: isDark ? '#0E0E10' : '#FFFFFF',
      text: isDark ? '#F5F5F7' : '#1E1E20',
      subtext: isDark ? '#C9CAD1' : '#666A70',
      inputBg: isDark ? '#1A1B1F' : '#FFFFFF',
      border: isDark ? '#32343C' : '#E5E7EB',
      placeholder: isDark ? '#9EA3AE' : '#A0A4AB',
      error: isDark ? '#FF6B6B' : '#E35151',
      divider: isDark ? '#2A2B31' : '#EAEAF0',
      link: isDark ? '#C4A2FF' : '#7E3BF2',
      btn: isDark ? '#8C62FF' : '#7E3BF2',
      btnPressed: isDark ? '#A78BFA' : '#A75EDA',
    }),
    [isDark]
  );

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid, isSubmitting, touchedFields, isSubmitted },
  } = useForm({
    // ✅ validate on blur (not while typing). After a field is touched once,
    // we re-validate on change so messages clear as they type fixes.
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirm: '' },
  });

  // keep a single source of truth for the selected country (picker)
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const pwd = watch('password');

  // Gate error rendering: only after blur (touched) or after submit.
  // PhoneInput doesn't reliably expose onBlur; use "has value" as interaction proxy.
  const showErr = (name, value) => {
    const touched = !!touchedFields?.[name];
    const submitted = !!isSubmitted;
    if (name === 'phone') return (submitted || (value?.length > 0)) && !!errors?.phone;
    return (touched || submitted) && !!errors?.[name];
  };

  const onInvalid = (errs) => {
    const first = Object.values(errs)[0];
    AccessibilityInfo.announceForAccessibility(first?.message || 'Please fix the highlighted fields.');
  };

  const onSubmit = async (values) => {
    try {
      // Normalize phone to E.164 using the selected country’s calling code
      let phoneE164;
      if (values.phone?.trim()) {
        const raw = values.phone.trim();
        const cc = getCallingCode(selectedCountry);
        const candidate = raw.startsWith('+') ? raw : (cc ? `+${cc}${raw}` : raw);
        const p = parsePhoneNumberFromString(candidate);
        if (!p || !p.isValid()) {
          setError('phone', { type: 'validate', message: 'Enter a valid phone number' });
          AccessibilityInfo.announceForAccessibility('Enter a valid phone number');
          return;
        }
        phoneE164 = p.number;
      }

      // TODO: call your API
      // await api.signUp({ ...values, phone: phoneE164 });

      AccessibilityInfo.announceForAccessibility('Sign up submitted.');
    } catch {
      AccessibilityInfo.announceForAccessibility('Sign up failed. Check your details.');
    }
  };

  // visually enabled; validate when pressed (prevents “disabled” look in mocks)
  const onPressCTA = () => {
    if (isSubmitting) return;
    if (isValid) handleSubmit(onSubmit, onInvalid)();
    else onInvalid(errors);
  };

  const styles = useMemo(() => makeStyles(theme), [theme]);
  const box = (hasError) => ([
    styles.input,
    { backgroundColor: theme.inputBg, borderColor: hasError ? theme.error : theme.border },
  ]);

  const pwdVal = watch('password');
  const confirmVal = watch('confirm');
  const phoneVal = watch('phone');

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.fill}>
        <ScrollView contentContainerStyle={styles.scrollBody} keyboardShouldPersistTaps="handled">

          {/* Logo (transparent wordmark PNG or SVG component) */}
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} accessibilityLabel="App logo" />

          <Text style={[styles.title, { color: theme.text }]}>Sign Up</Text>

          <View style={styles.formWrap}>
            {/* Full Name */}
            <Controller
              control={control}
              name="fullName"
              rules={{ required: 'Full name is required' }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isSubmitting}
                  style={[...box(showErr('fullName', value)), { color: theme.text }]}
                  placeholder="Full Name"
                  placeholderTextColor={theme.placeholder}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                />
              )}
            />
            {showErr('fullName') && (
              <Text style={[styles.errorText, { color: theme.error }]}>{errors.fullName?.message}</Text>
            )}

            {/* Email (error only after blur/submit) */}
            <Controller
              control={control}
              name="email"
              rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isSubmitting}
                  style={[...box(showErr('email', value)), { color: theme.text }]}
                  placeholder="Email"
                  placeholderTextColor={theme.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                />
              )}
            />
            {showErr('email') && (
              <Text style={[styles.errorText, { color: theme.error }]}>{errors.email?.message}</Text>
            )}

            {/* PHONE — ALWAYS use country-code picker (iOS/Android/Web) */}
            <Controller
              control={control}
              name="phone"
              rules={{ required: 'Phone is required' }}
              render={({ field: { value, onChange } }) => (
                <PhoneInput
                  value={value}
                  onChangePhoneNumber={onChange}
                  selectedCountry={selectedCountry || undefined}
                  onChangeSelectedCountry={setSelectedCountry}
                  placeholder="Phone number"
                  phoneInputStyles={{
                    container: [...box(showErr('phone', value))],
                    flagContainer: {
                      borderTopLeftRadius: 14,
                      borderBottomLeftRadius: 14,
                      backgroundColor: 'transparent',
                      paddingLeft: 6,
                    },
                    divider: { opacity: 0.2 },
                    callingCode: { marginRight: 6, color: theme.text, fontSize: 16 },
                    input: {
                      fontSize: 16,
                      color: theme.text,
                      backgroundColor: 'transparent',
                      paddingVertical: 0,
                    },
                  }}
                />
              )}
            />
            {showErr('phone', phoneVal) && (
              <Text style={[styles.errorText, { color: theme.error }]}>{errors.phone?.message}</Text>
            )}

            {/* Password — min length 6; errors only after blur/submit */}
            <View style={[...box(showErr('password', pwdVal)), styles.rowCenter]}>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Provide at least 6 characters' }, // ✅ 6 chars
                }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}            // marks as touched only when leaving the field
                    editable={!isSubmitting}
                    style={[styles.textFlex, { color: theme.text }]}
                    placeholder="Password"
                    placeholderTextColor={theme.placeholder}
                    secureTextEntry={!showPwd}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                    returnKeyType="next"
                  />
                )}
              />
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => setShowPwd((v) => !v)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel={showPwd ? 'Hide password' : 'Show password'}
              >
                <MaterialCommunityIcons
                  name={showPwd ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={showErr('password', pwdVal) ? theme.error : theme.placeholder}
                />
              </TouchableOpacity>
            </View>
            {showErr('password', pwdVal) && (
              <Text style={[styles.errorText, { color: theme.error }]}>{errors.password?.message}</Text>
            )}

            {/* Confirm Password */}
            <View style={[...box(showErr('confirm', confirmVal)), styles.rowCenter]}>
              <Controller
                control={control}
                name="confirm"
                rules={{ validate: (v) => v === pwd || 'Passwords do not match' }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!isSubmitting}
                    style={[styles.textFlex, { color: theme.text }]}
                    placeholder="Confirm Password"
                    placeholderTextColor={theme.placeholder}
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                    returnKeyType="done"
                    onSubmitEditing={() => (isValid ? handleSubmit(onSubmit, onInvalid)() : onInvalid(errors))}
                  />
                )}
              />
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => setShowConfirm((v) => !v)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel={showConfirm ? 'Hide password' : 'Show password'}
              >
                <MaterialCommunityIcons
                  name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={showErr('confirm', confirmVal) ? theme.error : theme.placeholder}
                />
              </TouchableOpacity>
            </View>
            {showErr('confirm', confirmVal) && (
              <Text style={[styles.errorText, { color: theme.error }]}>Passwords do not match</Text>
            )}

            {/* Forgot Password */}
            <View style={styles.forgotRow}>
              <TouchableOpacity accessibilityRole="button">
                <Text style={[styles.forgotText, { color: theme.link }]}>Forgot Password</Text>
              </TouchableOpacity>
            </View>

            {/* CTA */}
            <Pressable
              onPress={onPressCTA}
              android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
              style={({ pressed }) => [
                styles.cta,
                { backgroundColor: pressed ? theme.btnPressed : theme.btn },
                isSubmitting && { opacity: 0.95 },
              ]}
            >
              <Text style={styles.ctaText}>{isSubmitting ? 'Signing up…' : 'Sign up'}</Text>
            </Pressable>

            {/* Divider */}
            <View style={styles.orRow}>
              <View style={[styles.divider, { backgroundColor: theme.divider }]} />
              <Text style={[styles.orText, { color: theme.subtext }]}>Or sign up with</Text>
              <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            </View>

            {/* Socials */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                accessibilityRole="button"
                style={[styles.socialBtn, { backgroundColor: theme.inputBg, borderColor: isDark ? '#5A5D66' : '#D0D2D7' }]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Image source={require('../../assets/images/google_g.png')} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                style={[styles.socialBtn, { backgroundColor: '#000' }]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons name="apple" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Login */}
            <View style={styles.loginCol}>
              <Text style={[styles.haveAccount, { color: theme.subtext }]}>Have an account?</Text>
              <TouchableOpacity accessibilityRole="button">
                <Text style={[styles.loginText, { color: theme.link }]}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    fill: { flex: 1 },
    scrollBody: { flexGrow: 1, justifyContent: 'center', paddingVertical: 24 },

    logo: { width: 96, height: 32, alignSelf: 'center', marginBottom: 12, resizeMode: 'contain' },
    title: { fontSize: 34, lineHeight: 40, fontWeight: '800', textAlign: 'left', marginBottom: 18, alignSelf: 'center' },

    formWrap: {
      alignSelf: 'center',
      width: Platform.OS === 'web' ? '80%' : '100%',
      maxWidth: 560,
      paddingHorizontal: 20,
    },

    input: {
      borderRadius: 14,
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      marginBottom: 12,
    },

    rowCenter: { flexDirection: 'row', alignItems: 'center' },
    textFlex: { flex: 1 },

    errorText: { fontSize: 13, marginTop: -4, marginBottom: 8, marginLeft: 8 },
    helperCol: { gap: 2, marginBottom: 4 },
    helperText: { fontSize: 12, marginLeft: 8 },

    forgotRow: { alignItems: 'flex-end', marginBottom: 10 },
    forgotText: { textDecorationLine: 'underline', fontSize: 12.5 },

    cta: {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      marginTop: 6,
      marginBottom: 18,
    },
    ctaText: { color: '#fff', fontWeight: '700', fontSize: 16.5 },

    orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12, gap: 10 },
    orText: { fontWeight: '600', fontSize: 12.5 },
    divider: { flex: 1, height: 1 },

    socialRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: 6, marginBottom: 20 },
    socialBtn: { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    socialIcon: { width: 22, height: 22, resizeMode: 'contain' },

    loginCol: { alignItems: 'center', marginTop: 4 },
    haveAccount: { fontSize: 12.5, marginBottom: 2, textAlign: 'center' },
    loginText: { fontWeight: '700', textDecorationLine: 'underline', textAlign: 'center', fontSize: 12.5 },
  });
}