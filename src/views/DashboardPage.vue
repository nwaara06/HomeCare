<template>
  <ion-page class="dashboard-page">

    <!-- =================================
         HEADER
    ================================== -->

    <ion-header class="dashboard-header">
      <ion-toolbar>

        <ion-title>
          HomeCare
        </ion-title>

      </ion-toolbar>
    </ion-header>


    <!-- =================================
         CONTENT
    ================================== -->

    <ion-content
      :fullscreen="true"
      class="dashboard-content"
    >

      <div class="dashboard-container">


        <!-- =================================
             WELCOME HERO
        ================================== -->

        <section class="welcome-section">

          <div class="welcome-content">

            <!-- TEKS -->

            <div class="welcome-text">

              <p class="welcome-small">
                Selamat datang 👋
              </p>

              <h1>
                Kelola rumah
                <span>lebih mudah</span>
              </h1>

              <p class="welcome-description">
                Pantau barang dan perawatan
                rumah dalam satu aplikasi.
              </p>

            </div>


            <!-- ILUSTRASI RUMAH -->

            <div class="welcome-illustration">

              <!-- Lingkaran belakang -->

              <div class="illustration-circle"></div>


              <!-- Awan -->

              <div class="cloud cloud-one">
                ☁
              </div>

              <div class="cloud cloud-two">
                ☁
              </div>


              <!-- Rumah -->

              <div class="house-animation">

                <div class="house-roof">
                </div>

                <div class="house-body">

                  <div class="house-window">
                  </div>

                  <div class="house-door">
                  </div>

                </div>

              </div>


              <!-- Sparkle -->

              <div class="sparkle sparkle-one">

                <ion-icon
                  :icon="sparklesOutline"
                />

              </div>

              <div class="sparkle sparkle-two">

                <ion-icon
                  :icon="sparklesOutline"
                />

              </div>

            </div>

          </div>

        </section>


        <!-- =================================
             STATISTIK
        ================================== -->

        <section class="stats-grid">


          <!-- TOTAL BARANG -->

          <ion-card class="stat-card">

            <ion-card-content>

              <div class="stat-icon inventory-icon">

                <ion-icon
                  :icon="cubeOutline"
                />

              </div>

              <div class="stat-number">
                {{ totalBarang }}
              </div>

              <div class="stat-label">
                Total Barang
              </div>

            </ion-card-content>

          </ion-card>


          <!-- PERAWATAN -->

          <ion-card
            class="stat-card"
            :class="{
              'stat-warning':
                perluPerawatan > 0
            }"
          >

            <ion-card-content>

              <div class="stat-icon maintenance-icon">

                <ion-icon
                  :icon="constructOutline"
                />

              </div>

              <div class="stat-number">
                {{ perluPerawatan }}
              </div>

              <div class="stat-label">
                Perawatan
              </div>

            </ion-card-content>

          </ion-card>


          <!-- JADWAL MENDATANG -->

          <ion-card class="stat-card">

            <ion-card-content>

              <div class="stat-icon calendar-icon">

                <ion-icon
                  :icon="calendarOutline"
                />

              </div>

              <div class="stat-number">
                {{ jadwalMendatang }}
              </div>

              <div class="stat-label">
                Jadwal Mendatang
              </div>

            </ion-card-content>

          </ion-card>

        </section>


        <!-- =================================
             STATUS PERAWATAN
        ================================== -->

        <ion-card
          class="maintenance-alert"
          :class="{
            'alert-danger':
              perluPerawatan > 0,

            'alert-success':
              perluPerawatan === 0
          }"
        >

          <ion-card-content>

            <div class="alert-content">


              <!-- ICON -->

              <div class="alert-icon">

                <ion-icon
                  v-if="perluPerawatan > 0"
                  :icon="warningOutline"
                />

                <ion-icon
                  v-else
                  :icon="checkmarkCircleOutline"
                />

              </div>


              <!-- TEXT -->

              <div class="alert-text">

                <h3 v-if="perluPerawatan > 0">
                  Perlu Perhatian
                </h3>

                <h3 v-else>
                  Semua Perawatan Aman
                </h3>


                <p v-if="perluPerawatan > 0">

                  Ada
                  <strong>
                    {{ perluPerawatan }}
                  </strong>
                  jadwal yang perlu diperhatikan.

                </p>


                <p v-else>

                  Tidak ada jadwal perawatan
                  yang terlambat.

                </p>

              </div>

            </div>

          </ion-card-content>

        </ion-card>


        <!-- =================================
             HEADER JADWAL
        ================================== -->

        <div class="section-header">

          <div>

            <p class="section-small">
              PERAWATAN
            </p>

            <h2>
              Jadwal Perawatan
            </h2>

          </div>


          <button
            class="see-all-button"
            @click="lihatSemuaJadwal"
          >

            Lihat semua

            <ion-icon
              :icon="arrowForwardOutline"
            />

          </button>

        </div>


        <!-- =================================
             EMPTY STATE
        ================================== -->

        <ion-card
          v-if="schedules.length === 0"
          class="empty-card"
        >

          <ion-card-content>

            <div class="empty-state">

              <div class="empty-icon">

                <ion-icon
                  :icon="constructOutline"
                />

              </div>


              <h3>
                Belum ada jadwal perawatan
              </h3>


              <p>
                Tambahkan jadwal perawatan
                untuk barang di rumah kamu.
              </p>

            </div>

          </ion-card-content>

        </ion-card>


        <!-- =================================
             DAFTAR JADWAL
        ================================== -->

        <div
          v-else
          class="schedule-list"
        >

          <ion-card
            v-for="schedule in displayedSchedules"
            :key="schedule.id"
            class="schedule-card"
          >

            <ion-card-content>


              <!-- BARIS UTAMA -->

              <div class="schedule-top">


                <!-- ICON -->

                <div class="schedule-icon">

                  <ion-icon
                    :icon="constructOutline"
                  />

                </div>


                <!-- INFORMASI -->

                <div class="schedule-main">

                  <h3>
                    {{ schedule.itemName }}
                  </h3>

                  <p class="schedule-task">
                    {{ schedule.task }}
                  </p>

                </div>


                <!-- STATUS -->

                <div
                  class="status-badge"
                  :class="{
                    'status-late':
                      getStatus(
                        schedule.nextDate
                      ) === 'Terlambat',

                    'status-upcoming':
                      getStatus(
                        schedule.nextDate
                      ) === 'Akan Datang'
                  }"
                >

                  {{ getStatus(schedule.nextDate) }}

                </div>

              </div>


              <!-- DETAIL JADWAL -->

              <div class="schedule-info">

                <div class="info-item">

                  <ion-icon
                    :icon="calendarOutline"
                  />

                  <span>
                    {{ formatDate(schedule.nextDate) }}
                  </span>

                </div>


                <div class="info-divider">
                  •
                </div>


                <div class="info-item">

                  <ion-icon
                    :icon="timeOutline"
                  />

                  <span>
                    {{ schedule.interval }}
                  </span>

                </div>

              </div>

            </ion-card-content>

          </ion-card>

        </div>


        <!--
          Ruang tambahan di bawah.
          Supaya jadwal terakhir tidak tertutup
          oleh bottom navigation.
        -->

        <div class="bottom-space"></div>

      </div>

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import {
  computed,
  onMounted,
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  onIonViewWillEnter
} from '@ionic/vue'

import {
  cubeOutline,
  constructOutline,
  calendarOutline,
  warningOutline,
  checkmarkCircleOutline,
  arrowForwardOutline,
  timeOutline,
  sparklesOutline
} from 'ionicons/icons'

import { API_BASE_URL } from '@/config/api'

// ========================================
// ROUTER
// ========================================

const router = useRouter()


// ========================================
// TIPE DATA
// ========================================

interface Item {

  id: number

  name: string

  category: string

  location: string

  purchaseDate?: string

  notes?: string

}


interface MaintenanceSchedule {

  id: number

  itemId: number

  itemName: string

  task: string

  nextDate: string

  interval: string

  notes?: string

}


// ========================================
// DATA INVENTARIS
// ========================================

const items =
  ref<Item[]>([])


// ========================================
// DATA JADWAL PERAWATAN
// ========================================

const schedules =
  ref<MaintenanceSchedule[]>([])


// ========================================
// LOADING
// ========================================

const isLoading =
  ref(true)


// ========================================
// AMBIL DATA DARI API
// ========================================

const loadDashboardData =
  async () => {

    try {

      isLoading.value = true


      // ==================================
      // AMBIL DATA BARANG
      // ==================================

      const itemsResponse =
        await fetch(
          `${API_BASE_URL}/items`
        )


      if (!itemsResponse.ok) {

        throw new Error(
          'Gagal mengambil data inventaris'
        )

      }


      const itemsData =
        await itemsResponse.json()


      items.value =
        itemsData.map(
          (item: any) => ({

            id:
              item.id,

            name:
              item.name,

            category:
              item.category,

            location:
              item.location,

            purchaseDate:
              item.purchase_date,

            notes:
              item.notes

          })
        )


      // ==================================
      // AMBIL DATA JADWAL
      // ==================================

      const maintenanceResponse =
        await fetch(
           `${API_BASE_URL}/maintenance`
        )


      if (!maintenanceResponse.ok) {

        throw new Error(
          'Gagal mengambil data jadwal perawatan'
        )

      }


      const maintenanceData =
        await maintenanceResponse.json()


      schedules.value =
        maintenanceData.map(
          (schedule: any) => ({

            id:
              schedule.id,

            itemId:
              schedule.item_id,

            itemName:
              schedule.item_name,

            task:
              schedule.task,

            nextDate:
              schedule.next_date,

            interval:
              schedule.maintenance_interval,

            notes:
              schedule.notes

          })
        )


    } catch (error) {

      console.error(
        'Gagal mengambil data Dashboard:',
        error
      )

      items.value = []

      schedules.value = []

    } finally {

      isLoading.value = false

    }

  }


// ========================================
// LOAD SAAT HALAMAN DIBUKA
// ========================================

onMounted(() => {

  loadDashboardData()

})


// ========================================
// LOAD SETIAP KALI HALAMAN AKTIF KEMBALI
// ========================================

onIonViewWillEnter(() => {

  loadDashboardData()

})


// ========================================
// TOTAL BARANG
// ========================================

const totalBarang =
  computed(() => {

    return items.value.length

  })


// ========================================
// PARSE TANGGAL
// ========================================

const parseDate = (
  dateString: string
): Date | null => {

  if (!dateString) {

    return null

  }


  // ==================================
  // FORMAT API MYSQL
  // Contoh:
  // 2026-12-08T16:00:00.000Z
  // ==================================

  const isoMatch =
    dateString.match(
      /^(\d{4})-(\d{2})-(\d{2})/
    )


  if (isoMatch) {

    const year =
      Number(
        isoMatch[1]
      )

    const month =
      Number(
        isoMatch[2]
      )

    const day =
      Number(
        isoMatch[3]
      )


    return new Date(
      year,
      month - 1,
      day
    )

  }


  // ==================================
  // FORMAT:
  // 20 Desember 2026
  // ==================================

  const months: Record<
    string,
    number
  > = {

    januari: 0,
    februari: 1,
    maret: 2,
    april: 3,
    mei: 4,
    juni: 5,
    juli: 6,
    agustus: 7,
    september: 8,
    oktober: 9,
    november: 10,
    desember: 11

  }


  const parts =
    dateString
      .toLowerCase()
      .trim()
      .split(' ')


  if (parts.length === 3) {

    const day =
      Number(
        parts[0]
      )


    const month =
      months[
        parts[1]
      ]


    const year =
      Number(
        parts[2]
      )


    if (
      !Number.isNaN(day) &&
      month !== undefined &&
      !Number.isNaN(year)
    ) {

      return new Date(
        year,
        month,
        day
      )

    }

  }


  return null

}


// ========================================
// TANGGAL HARI INI
// ========================================

const getToday =
  () => {

    const date =
      new Date()


    date.setHours(
      0,
      0,
      0,
      0
    )


    return date

  }


// ========================================
// PERLU PERAWATAN
// ========================================

const perluPerawatan =
  computed(() => {

    const today =
      getToday()


    return schedules.value.filter(
      schedule => {

        const date =
          parseDate(
            schedule.nextDate
          )


        if (!date) {

          return false

        }


        date.setHours(
          0,
          0,
          0,
          0
        )


        return date < today

      }
    ).length

  })


// ========================================
// JADWAL MENDATANG
// ========================================

const jadwalMendatang =
  computed(() => {

    const today =
      getToday()


    return schedules.value.filter(
      schedule => {

        const date =
          parseDate(
            schedule.nextDate
          )


        if (!date) {

          return false

        }


        date.setHours(
          0,
          0,
          0,
          0
        )


        return date >= today

      }
    ).length

  })


// ========================================
// JADWAL YANG DITAMPILKAN
// ========================================

const displayedSchedules =
  computed(() => {

    return schedules.value
      .slice(0, 3)

  })


// ========================================
// FORMAT TANGGAL
// ========================================

const formatDate = (
  dateString: string
) => {

  const date =
    parseDate(
      dateString
    )


  if (!date) {

    return dateString

  }


  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`

}


// ========================================
// STATUS PERAWATAN
// ========================================

const getStatus = (
  dateString: string
) => {

  const date =
    parseDate(
      dateString
    )


  if (!date) {

    return 'Tidak diketahui'

  }


  const currentDate =
    getToday()


  date.setHours(
    0,
    0,
    0,
    0
  )


  if (
    date < currentDate
  ) {

    return 'Terlambat'

  }


  return 'Akan Datang'

}


// ========================================
// LIHAT SEMUA JADWAL
// ========================================

const lihatSemuaJadwal = () => {

  router.push(
    '/maintenance'
  )

}

</script>


<style scoped>

/* ========================================
   WARNA HOMECARE
======================================== */

.dashboard-page {

  --homecare-blue: #63a9d5;

  --homecare-blue-dark: #3f8fc3;

  --homecare-background: #f5f9fc;

  --homecare-text: #263746;

  --homecare-muted: #7b8994;

}


/* ========================================
   HEADER
======================================== */

.dashboard-header {

  box-shadow:
    0 2px 10px
    rgba(62, 143, 195, 0.06);

}


.dashboard-header ion-toolbar {

  --background: #ffffff;

  --color:
    var(--homecare-text);

  --border-width: 0;

  --min-height: 57px;

}


.dashboard-header ion-title {

  font-size: 20px;

  font-weight: 750;

  letter-spacing:
    -0.3px;

}


/* ========================================
   CONTENT
======================================== */

.dashboard-content {

  --background:
    var(--homecare-background);

  --padding-bottom: 110px;

}


.dashboard-container {

  width: 100%;

  max-width: 900px;

  margin: 0 auto;

  padding:
    17px 15px 120px;

}


/* ========================================
   WELCOME HERO
======================================== */

.welcome-section {

  position: relative;

  overflow: hidden;

  min-height: 165px;

  margin-bottom: 18px;

  padding:
    20px 17px;

  border-radius: 20px;

  background:
    linear-gradient(
      135deg,
      #eaf6fc 0%,
      #f5fbfe 100%
    );

  border:
    1px solid #dceef7;

  box-shadow:
    0 5px 18px
    rgba(62, 143, 195, 0.07);

}


.welcome-content {

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  width: 100%;

  height: 100%;

}


.welcome-text {

  position: relative;

  z-index: 3;

  max-width: 62%;

}


.welcome-small {

  margin:
    0 0 5px;

  color:
    var(--homecare-blue-dark);

  font-size: 11px;

  font-weight: 750;

}


.welcome-section h1 {

  margin: 0;

  color:
    var(--homecare-text);

  font-size: 25px;

  line-height: 1.15;

  font-weight: 800;

  letter-spacing:
    -0.5px;

}


.welcome-section h1 span {

  display: block;

  color:
    var(--homecare-blue-dark);

}


.welcome-description {

  max-width: 240px;

  margin:
    8px 0 0;

  color:
    #718595;

  font-size: 11px;

  line-height: 1.5;

}


/* ========================================
   ILUSTRASI
======================================== */

.welcome-illustration {

  position: relative;

  flex-shrink: 0;

  width: 125px;

  height: 125px;

  margin-right: -5px;

}


.illustration-circle {

  position: absolute;

  top: 12px;

  left: 8px;

  width: 105px;

  height: 105px;

  border-radius: 50%;

  background:
    #d8edf8;

  opacity: 0.9;

}


/* ========================================
   RUMAH
======================================== */

.house-animation {

  position: absolute;

  z-index: 3;

  top: 35px;

  left: 27px;

  width: 76px;

  animation:
    houseFloat 3s ease-in-out infinite;

}


.house-roof {

  width: 0;

  height: 0;

  margin: 0 auto;

  border-left:
    42px solid transparent;

  border-right:
    42px solid transparent;

  border-bottom:
    38px solid #5fa8d3;

}


.house-body {

  position: relative;

  width: 76px;

  height: 54px;

  border-radius:
    0 0 8px 8px;

  background:
    #ffffff;

  box-shadow:
    0 5px 12px
    rgba(62, 143, 195, 0.15);

}


.house-door {

  position: absolute;

  bottom: 0;

  left: 29px;

  width: 20px;

  height: 31px;

  border-radius:
    6px 6px 0 0;

  background:
    #78b8da;

}


.house-window {

  position: absolute;

  top: 10px;

  left: 10px;

  width: 20px;

  height: 20px;

  border-radius: 5px;

  background:
    #dff2fb;

  border:
    3px solid #65a9d2;

}


/* ========================================
   AWAN
======================================== */

.cloud {

  position: absolute;

  z-index: 2;

  color:
    #ffffff;

  font-size: 24px;

  opacity: 0.85;

  animation:
    cloudFloat 4s ease-in-out infinite;

}


.cloud-one {

  top: 15px;

  right: 2px;

}


.cloud-two {

  bottom: 14px;

  left: -2px;

  font-size: 18px;

  animation-delay:
    1s;

}


/* ========================================
   SPARKLE
======================================== */

.sparkle {

  position: absolute;

  z-index: 4;

  display: flex;

  align-items: center;

  justify-content: center;

  color:
    #5da8d4;

  font-size: 16px;

  animation:
    sparkleAnimation 2.5s ease-in-out infinite;

}


.sparkle-one {

  top: 25px;

  left: 15px;

}


.sparkle-two {

  right: 4px;

  bottom: 25px;

  font-size: 12px;

  animation-delay:
    0.8s;

}


/* ========================================
   ANIMASI RUMAH
======================================== */

@keyframes houseFloat {

  0%,
  100% {

    transform:
      translateY(0);

  }

  50% {

    transform:
      translateY(-6px);

  }

}


/* ========================================
   ANIMASI AWAN
======================================== */

@keyframes cloudFloat {

  0%,
  100% {

    transform:
      translateX(0);

  }

  50% {

    transform:
      translateX(5px);

  }

}


/* ========================================
   ANIMASI SPARKLE
======================================== */

@keyframes sparkleAnimation {

  0%,
  100% {

    transform:
      scale(1);

    opacity:
      0.6;

  }

  50% {

    transform:
      scale(1.25);

    opacity:
      1;

  }

}


/* ========================================
   STATISTIK
======================================== */

.stats-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 8px;

  margin-bottom: 15px;

}


.stat-card {

  margin: 0;

  --background: #ffffff;

  border:
    1px solid #e4eef4;

  border-radius: 15px;

  box-shadow:
    0 3px 12px
    rgba(62, 143, 195, 0.06);

}


.stat-card ion-card-content {

  padding:
    12px 9px;

}


.stat-icon {

  display: flex;

  align-items: center;

  justify-content: center;

  width: 34px;

  height: 34px;

  margin-bottom: 8px;

  border-radius: 10px;

  font-size: 18px;

}


.inventory-icon {

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

}


.maintenance-icon {

  background:
    #edf7fc;

  color:
    #4e9ac7;

}


.calendar-icon {

  background:
    #eaf7f8;

  color:
    #4c9ca4;

}


.stat-number {

  color:
    var(--homecare-text);

  font-size: 23px;

  line-height: 1;

  font-weight: 800;

}


.stat-label {

  min-height: 26px;

  margin-top: 5px;

  color:
    var(--homecare-muted);

  font-size: 9px;

  line-height: 1.3;

}


.stat-warning {

  border-color:
    #f0d7ca;

}


/* ========================================
   STATUS PERAWATAN
======================================== */

.maintenance-alert {

  margin:
    0 0 25px;

  border-radius: 15px;

  box-shadow:
    0 3px 12px
    rgba(62, 143, 195, 0.05);

}


.maintenance-alert ion-card-content {

  padding:
    13px 14px;

}


.alert-danger {

  --background:
    #fff8f4;

  border:
    1px solid #f3ded3;

}


.alert-success {

  --background:
    #f3fafc;

  border:
    1px solid #dceff5;

}


.alert-content {

  display: flex;

  align-items: center;

  gap: 11px;

}


.alert-icon {

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  width: 37px;

  height: 37px;

  border-radius: 11px;

  font-size: 20px;

}


.alert-danger .alert-icon {

  background:
    #fff0e7;

  color:
    #d47a43;

}


.alert-success .alert-icon {

  background:
    #e6f5f8;

  color:
    var(--homecare-blue-dark);

}


.alert-text {

  flex: 1;

}


.alert-text h3 {

  margin:
    0 0 3px;

  color:
    var(--homecare-text);

  font-size: 14px;

  font-weight: 750;

}


.alert-text p {

  margin: 0;

  color:
    var(--homecare-muted);

  font-size: 11px;

  line-height: 1.4;

}


.alert-text strong {

  color:
    var(--homecare-text);

}


/* ========================================
   SECTION JADWAL
======================================== */

.section-header {

  display: flex;

  align-items: flex-end;

  justify-content:
    space-between;

  gap: 10px;

  margin-bottom: 10px;

}


.section-small {

  margin:
    0 0 2px;

  color:
    var(--homecare-blue-dark);

  font-size: 9px;

  font-weight: 800;

  letter-spacing:
    1px;

}


.section-header h2 {

  margin: 0;

  color:
    var(--homecare-text);

  font-size: 20px;

  font-weight: 800;

  letter-spacing:
    -0.3px;

}


.see-all-button {

  display: flex;

  align-items: center;

  gap: 3px;

  padding: 0;

  border: 0;

  background: transparent;

  color:
    var(--homecare-blue-dark);

  font-family: inherit;

  font-size: 11px;

  font-weight: 700;

  cursor: pointer;

}


.see-all-button ion-icon {

  font-size: 13px;

}


/* ========================================
   DAFTAR JADWAL
======================================== */

.schedule-list {

  display: flex;

  flex-direction: column;

  gap: 9px;

}


.schedule-card {

  margin: 0;

  --background: #ffffff;

  border:
    1px solid #e5eef4;

  border-radius: 15px;

  box-shadow:
    0 3px 12px
    rgba(62, 143, 195, 0.05);

}


.schedule-card ion-card-content {

  padding:
    13px;

}


.schedule-top {

  display: flex;

  align-items: flex-start;

  gap: 9px;

}


.schedule-icon {

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  width: 40px;

  height: 40px;

  border-radius: 11px;

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

  font-size: 20px;

}


.schedule-main {

  flex: 1;

  min-width: 0;

}


.schedule-main h3 {

  margin:
    0 0 2px;

  color:
    var(--homecare-text);

  font-size: 15px;

  font-weight: 750;

}


.schedule-task {

  margin: 0;

  color:
    var(--homecare-muted);

  font-size: 11px;

}


.status-badge {

  flex-shrink: 0;

  padding:
    4px 7px;

  border-radius: 20px;

  font-size: 8px;

  font-weight: 750;

  white-space: nowrap;

}


.status-upcoming {

  background:
    #e8f6f7;

  color:
    #4f5d5e;

}


.status-late {

  background:
    #fff0eb;

  color:
    #c96e49;

}


/* ========================================
   DETAIL JADWAL
======================================== */

.schedule-info {

  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 7px;

  margin-top: 11px;

  padding-top: 9px;

  border-top:
    1px solid #edf3f6;

}


.info-item {

  display: flex;

  align-items: center;

  gap: 4px;

  color:
    var(--homecare-muted);

  font-size: 10px;

}


.info-item ion-icon {

  color:
    var(--homecare-blue);

  font-size: 13px;

}


.info-divider {

  color:
    #c5d1d8;

  font-size: 10px;

}


/* ========================================
   EMPTY STATE
======================================== */

.empty-card {

  margin: 0;

  --background: #ffffff;

  border:
    1px solid #e5eef4;

  border-radius: 15px;

}


.empty-state {

  padding:
    22px 10px;

  text-align: center;

}


.empty-icon {

  display: flex;

  align-items: center;

  justify-content: center;

  width: 52px;

  height: 52px;

  margin:
    0 auto 10px;

  border-radius: 15px;

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

  font-size: 25px;

}


.empty-state h3 {

  margin:
    0 0 6px;

  color:
    var(--homecare-text);

  font-size: 16px;

  font-weight: 700;

}


.empty-state p {

  max-width: 290px;

  margin:
    0 auto;

  color:
    var(--homecare-muted);

  font-size: 12px;

  line-height: 1.5;

}


/* ========================================
   RUANG BAWAH
======================================== */

.bottom-space {

  height: 90px;

}


/* ========================================
   MOBILE
======================================== */

@media (max-width: 600px) {

  .dashboard-container {

    padding:
      17px 13px 125px;

  }


  /* WELCOME */

  .welcome-section {

    min-height: 155px;

    padding:
      18px 14px;

  }


  .welcome-text {

    max-width: 63%;

  }


  .welcome-section h1 {

    font-size: 23px;

  }


  .welcome-description {

    font-size: 10px;

  }


  .welcome-illustration {

    width: 112px;

    height: 112px;

    margin-right: -8px;

  }


  .illustration-circle {

    width: 96px;

    height: 96px;

  }


  .house-animation {

    top: 32px;

    left: 23px;

    transform-origin:
      center bottom;

  }


  /* STATISTIK */

  .stats-grid {

    gap: 7px;

  }


  .stat-card ion-card-content {

    padding:
      11px 8px;

  }


  .stat-icon {

    width: 32px;

    height: 32px;

    font-size: 17px;

  }


  .stat-number {

    font-size: 22px;

  }


  .stat-label {

    font-size: 8.5px;

  }


  /* JADWAL */

  .section-header h2 {

    font-size: 19px;

  }


  .schedule-main h3 {

    font-size: 14px;

  }


  .schedule-task {

    font-size: 10px;

  }

}


/* ========================================
   HP SANGAT KECIL
======================================== */

@media (max-width: 360px) {

  .dashboard-container {

    padding-left: 10px;

    padding-right: 10px;

  }


  .welcome-section {

    min-height: 150px;

    padding:
      16px 12px;

  }


  .welcome-text {

    max-width: 64%;

  }


  .welcome-section h1 {

    font-size: 21px;

  }


  .welcome-description {

    font-size: 9px;

  }


  .welcome-illustration {

    width: 100px;

    height: 100px;

  }


  .illustration-circle {

    width: 88px;

    height: 88px;

  }


  .house-animation {

    top: 29px;

    left: 18px;

    transform:
      scale(0.88);

    transform-origin:
      center bottom;

  }


  .stats-grid {

    gap: 5px;

  }


  .stat-card ion-card-content {

    padding:
      10px 6px;

  }


  .stat-icon {

    width: 30px;

    height: 30px;

    font-size: 16px;

  }


  .stat-number {

    font-size: 20px;

  }


  .stat-label {

    font-size: 8px;

  }


  .status-badge {

    font-size: 7px;

    padding:
      3px 5px;

  }

}

</style>