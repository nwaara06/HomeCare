<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <div class="welcome-page">

        <!-- Background Decoration -->
        <div class="circle circle-one"></div>
        <div class="circle circle-two"></div>

        <!-- Welcome Container -->
        <div class="welcome-container">

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

          <!-- Welcome Card -->
          <div class="welcome-card">

            <div class="intro-section">
              <h2>Selamat Datang! 👋</h2>
              <p>
                Aplikasi HomeCare membantu Anda mengelola inventaris dan pemeliharaan rumah dengan mudah dan terorganisir.
              </p>
            </div>

            <!-- Start Button -->
            <ion-button
              expand="block"
              class="start-button"
              @click="start"
            >
              <span>Mulai Sekarang</span>
              <ion-icon
                :icon="arrowForwardOutline"
                slot="end"
              />
            </ion-button>

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
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/vue'
import { arrowForwardOutline } from 'ionicons/icons'

const router = useRouter()

const start = () => {
  router.push('/dashboard')
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
   WARNA HOMECARE
======================================== */
.welcome-page {
  --homecare-blue: #63a9d5;
  --homecare-blue-dark: #3f8fc3;
  --homecare-background: #f5f9fc;
  --homecare-text: #263746;
  --homecare-muted: #7b8994;

  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 30px 20px;
  background: var(--homecare-background);
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
  background: #d8edf8;
  top: -150px;
  right: -100px;
}
.circle-two {
  width: 300px;
  height: 300px;
  background: #eaf6fc;
  bottom: -160px;
  left: -120px;
}

/* ========================================
   CONTAINER
======================================== */
.welcome-container {
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
  color: var(--homecare-text);
  margin-bottom: 25px;
}
.logo {
  width: 90px;
  height: 90px;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  border-radius: 25px;
  background: #ffffff;
  border: 1px solid #dceef7;
  box-shadow: 0 10px 30px rgba(62,143,195,0.15);
  backdrop-filter: blur(10px);
}
.logo-section h1 {
  margin: 0;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.logo-section p {
  margin: 10px 0 0;
  color: var(--homecare-muted);
  font-size: 16px;
}

/* ========================================
   WELCOME CARD
======================================== */
.welcome-card {
  background: #ffffff;
  border-radius: 28px;
  padding: 35px 30px;
  box-shadow: 0 25px 60px rgba(62,143,195,0.15);
  text-align: center;
  border: 1px solid #dceef7;
}
.intro-section {
  margin-bottom: 30px;
}
.intro-section h2 {
  margin: 0;
  font-size: 26px;
  color: var(--homecare-text);
  font-weight: 800;
}
.intro-section p {
  margin: 15px 0 0;
  color: var(--homecare-muted);
  font-size: 15px;
  line-height: 1.5;
}

/* ========================================
   START BUTTON
======================================== */
.start-button {
  --background: var(--homecare-blue);
  --background-hover: var(--homecare-blue-dark);
  --border-radius: 14px;
  height: 56px;
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 8px 20px rgba(62,143,195,0.25);
  color: #ffffff;
}
.start-button ion-icon {
  font-size: 22px;
}

/* ========================================
   FOOTER
======================================== */
.footer {
  text-align: center;
  margin-top: 30px;
  color: var(--homecare-muted);
  font-size: 12px;
}
.footer p {
  margin: 0 0 5px;
}
.footer span {
  font-size: 11px;
}

/* ========================================
   MOBILE
======================================== */
@media (max-width: 480px) {
  .welcome-page {
    padding: 20px 15px;
  }
  .welcome-card {
    padding: 30px 20px;
    border-radius: 24px;
  }
  .logo {
    width: 76px;
    height: 76px;
    font-size: 42px;
  }
  .logo-section h1 {
    font-size: 32px;
  }
  .intro-section h2 {
    font-size: 23px;
  }
}
</style>
