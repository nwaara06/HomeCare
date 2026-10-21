<template>
  <ion-app>
    <ion-tabs>
      <ion-router-outlet />

      <ion-tab-bar v-if="route.path !== '/welcome'" slot="bottom" class="homecare-tab-bar">
        <!-- Beranda -->
        <ion-tab-button
          tab="dashboard"
          href="/dashboard"
          class="homecare-tab-button"
        >
          <ion-icon :icon="homeOutline" />
          <ion-label>Beranda</ion-label>
        </ion-tab-button>

        <!-- Inventaris -->
        <ion-tab-button
          tab="inventory"
          href="/inventory"
          class="homecare-tab-button"
        >
          <ion-icon :icon="cubeOutline" />
          <ion-label>Inventaris</ion-label>
        </ion-tab-button>

        <!-- Perawatan -->
        <ion-tab-button
          tab="maintenance"
          href="/maintenance"
          class="homecare-tab-button"
        >
          <ion-icon :icon="constructOutline" />
          <ion-label>Perawatan</ion-label>
        </ion-tab-button>

        <!-- Riwayat -->
        <ion-tab-button
          tab="history"
          href="/history"
          class="homecare-tab-button"
        >
          <ion-icon :icon="timeOutline" />
          <ion-label>Riwayat</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-app>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  IonApp,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/vue'

const route = useRoute()

import {
  homeOutline,
  cubeOutline,
  constructOutline,
  timeOutline
} from 'ionicons/icons'
</script>

<style>
/* ========================================
   HOMECARE BOTTOM NAVIGATION
   ======================================== */

.homecare-tab-bar {
  --background: #ffffff;
  --border: none;

  height: 70px;

  padding-top: 6px;
  padding-bottom: calc(6px + env(safe-area-inset-bottom));

  border-top: 1px solid #e5e7eb;

  box-shadow: 0 -3px 12px rgba(0, 0, 0, 0.08);
}

/* Tombol navigasi */
.homecare-tab-button {
  --color: #8a8f98;
  --color-selected: #63a9d5;

  min-height: 58px;

  padding: 5px 4px;

  font-size: 12px;
  font-weight: 500;
}

/* Icon */
.homecare-tab-button ion-icon {
  font-size: 23px;
  margin-bottom: 3px;

  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

/* Label */
.homecare-tab-button ion-label {
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
}

/* Menu aktif */
.homecare-tab-button.tab-selected {
  font-weight: 600;
}

/* Icon menu aktif */
.homecare-tab-button.tab-selected ion-icon {
  transform: scale(1.08);
}

/* Label menu aktif */
.homecare-tab-button.tab-selected ion-label {
  font-weight: 600;
}

/* Efek ketika tombol ditekan */
.homecare-tab-button:active ion-icon {
  transform: scale(0.92);
}

/* Layar kecil */
@media (max-width: 360px) {
  .homecare-tab-bar {
    height: 66px;
  }

  .homecare-tab-button {
    min-height: 54px;
  }

  .homecare-tab-button ion-icon {
    font-size: 21px;
  }

  .homecare-tab-button ion-label {
    font-size: 10px;
  }
}
</style>