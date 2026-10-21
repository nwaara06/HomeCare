<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <div class="login-page">

        <!-- Background Decoration -->
        <div class="circle circle-one"></div>
        <div class="circle circle-two"></div>

        <!-- Login Container -->
        <div class="login-container">

          <!-- Logo -->
          <div class="logo-section">
            <div class="logo">
              🏠
            </div>

            <h1>HomeCare</h1>

            <p>
              Kelola rumah dengan lebih mudah
            </p>
          </div>

          <!-- Login Card -->
          <div class="login-card">

            <div class="welcome-section">
              <h2>Selamat Datang 👋</h2>

              <p>
                Silakan masuk untuk melanjutkan
              </p>
            </div>

            <!-- Username -->
            <div class="input-group">

              <label>Username</label>

              <div class="input-wrapper">

                <ion-icon
                  :icon="personOutline"
                  class="input-icon"
                />

                <ion-input
                  v-model="username"
                  type="text"
                  placeholder="Masukkan username"
                  fill="outline"
                />

              </div>

            </div>

            <!-- Password -->
            <div class="input-group">

              <label>Password</label>

              <div class="input-wrapper">

                <ion-icon
                  :icon="lockClosedOutline"
                  class="input-icon"
                />

                <ion-input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Masukkan password"
                  fill="outline"
                />

                <ion-button
                  fill="outline"
                  class="password-button"
                  @click="showPassword = !showPassword"
                >
                  <ion-icon
                    :icon="
                      showPassword
                        ? eyeOffOutline
                        : eyeOutline
                    "
                  />
                </ion-button>

              </div>

            </div>

            <!-- Error -->
            <div
              v-if="errorMessage"
              class="error-message"
            >
              <ion-icon :icon="alertCircleOutline" />

              <span>
                {{ errorMessage }}
              </span>
            </div>

            <!-- Login Button -->
            <ion-button
              expand="block"
              class="login-button"
              @click="login"
            >

              <span>Masuk</span>

              <ion-icon
                :icon="arrowForwardOutline"
                slot="end"
              />

            </ion-button>

            <!-- Demo Account -->
            <div class="demo-account">

              <p>Demo Account</p>

              <div class="demo-info">
                <span>Username: admin</span>
                <span>Password: admin123</span>
              </div>

            </div>

          </div>

          <!-- Footer -->
          <div class="footer">
            <p>
              © 2026 HomeCare
            </p>

            <span>
              Smart Home Management
            </span>
          </div>

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import { ref } from 'vue'

import { useRouter } from 'vue-router'

import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/vue'

import {
  personOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  arrowForwardOutline,
  alertCircleOutline
} from 'ionicons/icons'


// Router
const router = useRouter()


// Form
const username = ref('')

const password = ref('')

const errorMessage = ref('')

const showPassword = ref(false)


// Login
const login = () => {

  errorMessage.value = ''

  if (!username.value || !password.value) {

    errorMessage.value =
      'Username dan password wajib diisi.'

    return
  }


  if (
    username.value === 'admin' &&
    password.value === 'admin123'
  ) {

    router.push('/dashboard')

  } else {

    errorMessage.value =
      'Username atau password salah.'

  }

}

</script>


<style scoped>

/* ========================================
   GLOBAL
======================================== */

ion-content {
  --background: transparent;
}


/* ========================================
   LOGIN PAGE
======================================== */

.login-page {

  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  position: relative;

  overflow: hidden;

  padding: 30px 20px;

  background:
    linear-gradient(
      135deg,
      #071a2b 0%,
      #0b3047 45%,
      #0e7490 100%
    );

}


/* ========================================
   DECORATION CIRCLE
======================================== */

.circle {

  position: absolute;

  border-radius: 50%;

  opacity: 0.15;

  pointer-events: none;

}


.circle-one {

  width: 350px;

  height: 350px;

  background: #67e8f9;

  top: -150px;

  right: -100px;

}


.circle-two {

  width: 300px;

  height: 300px;

  background: #ffffff;

  bottom: -160px;

  left: -120px;

}


/* ========================================
   CONTAINER
======================================== */

.login-container {

  width: 100%;

  max-width: 440px;

  position: relative;

  z-index: 2;

}


/* ========================================
   LOGO
======================================== */

.logo-section {

  text-align: center;

  color: white;

  margin-bottom: 25px;

}


.logo {

  width: 76px;

  height: 76px;

  margin: 0 auto 12px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 42px;

  border-radius: 22px;

  background: rgba(255,255,255,0.15);

  border: 1px solid rgba(255,255,255,0.25);

  box-shadow:
    0 10px 30px rgba(0,0,0,0.2);

  backdrop-filter: blur(10px);

}


.logo-section h1 {

  margin: 0;

  font-size: 32px;

  font-weight: 700;

  letter-spacing: -0.5px;

}


.logo-section p {

  margin: 7px 0 0;

  color: rgba(255,255,255,0.75);

  font-size: 14px;

}


/* ========================================
   LOGIN CARD
======================================== */

.login-card {

  background: rgba(255,255,255,0.97);

  border-radius: 28px;

  padding: 30px;

  box-shadow:
    0 25px 60px rgba(0,0,0,0.25);

}


/* ========================================
   WELCOME
======================================== */

.welcome-section {

  margin-bottom: 25px;

}


.welcome-section h2 {

  margin: 0;

  font-size: 23px;

  color: #102a43;

  font-weight: 700;

}


.welcome-section p {

  margin: 7px 0 0;

  color: #718096;

  font-size: 14px;

}


/* ========================================
   INPUT
======================================== */

.input-group {

  margin-bottom: 18px;

}


.input-group label {

  display: block;

  margin-bottom: 8px;

  color: #334e68;

  font-size: 14px;

  font-weight: 600;

}


.input-wrapper {

  display: flex;

  align-items: center;

  height: 54px;

  border: 1px solid #d9e2ec;

  border-radius: 14px;

  background: #f8fafc;

  transition: all 0.2s ease;

}


.input-wrapper:focus-within {

  border-color: #0e7490;

  background: white;

  box-shadow:
    0 0 0 3px rgba(14,116,144,0.1);

}


.input-icon {

  font-size: 20px;

  margin-left: 15px;

  color: #64748b;

}


.input-wrapper ion-input {

  --padding-start: 10px;

  --padding-end: 10px;

  color: #1e293b;

}


/* ========================================
   PASSWORD BUTTON
======================================== */

.password-button {

  --color: #64748b;

  margin-right: 3px;

}


/* ========================================
   ERROR
======================================== */

.error-message {

  display: flex;

  align-items: center;

  gap: 8px;

  padding: 11px 13px;

  margin-bottom: 16px;

  border-radius: 10px;

  background: #fef2f2;

  color: #dc2626;

  font-size: 13px;

}


.error-message ion-icon {

  font-size: 18px;

}


/* ========================================
   LOGIN BUTTON
======================================== */

.login-button {

  --background: linear-gradient(
    135deg,
    #0e7490,
    #0891b2
  );

  --background-hover: #0e7490;

  --border-radius: 14px;

  height: 54px;

  margin: 5px 0 0;

  font-size: 16px;

  font-weight: 600;

  text-transform: none;

  box-shadow:
    0 8px 20px rgba(8,145,178,0.25);

}


.login-button ion-icon {

  font-size: 20px;

}


/* ========================================
   DEMO ACCOUNT
======================================== */

.demo-account {

  margin-top: 22px;

  padding-top: 18px;

  border-top: 1px solid #e2e8f0;

  text-align: center;

}


.demo-account p {

  margin: 0 0 8px;

  font-size: 12px;

  color: #94a3b8;

}


.demo-info {

  display: flex;

  flex-direction: column;

  gap: 3px;

  font-size: 12px;

  color: #64748b;

}


/* ========================================
   FOOTER
======================================== */

.footer {

  text-align: center;

  margin-top: 20px;

  color: rgba(255,255,255,0.65);

  font-size: 11px;

}


.footer p {

  margin: 0 0 3px;

}


.footer span {

  font-size: 10px;

}


/* ========================================
   MOBILE
======================================== */

@media (max-width: 480px) {

  .login-page {

    padding: 20px 15px;

  }


  .login-card {

    padding: 24px 20px;

    border-radius: 24px;

  }


  .logo {

    width: 68px;

    height: 68px;

    font-size: 36px;

  }


  .logo-section h1 {

    font-size: 28px;

  }


  .welcome-section h2 {

    font-size: 21px;

  }

}

</style>