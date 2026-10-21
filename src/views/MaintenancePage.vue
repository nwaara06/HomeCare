<template>
  <ion-page class="maintenance-page">

    <ion-header class="maintenance-header">
      <ion-toolbar>
        <ion-title>Perawatan</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content
      :fullscreen="true"
      class="maintenance-content"
    >

      <div class="maintenance-container">

        <!-- HEADER HALAMAN -->
        <section class="page-intro">

          <div class="intro-text">

            <p class="section-small">
              PERAWATAN
            </p>

            <h1>
              Jadwal Perawatan
            </h1>

            <p class="intro-description">
              Pantau jadwal perawatan barang
              di rumah kamu.
            </p>

          </div>

          <button
            class="add-button"
            @click="tambahJadwal"
          >
            <ion-icon :icon="addOutline" />
            <span>Tambah</span>
          </button>

        </section>


        <!-- STATISTIK -->
        <section
          v-if="schedules.length > 0"
          class="stats-grid"
        >

          <div class="stat-card">

            <div class="stat-icon blue">
              <ion-icon :icon="calendarOutline" />
            </div>

            <div class="stat-content">
              <strong>{{ schedules.length }}</strong>
              <span>Semua Jadwal</span>
            </div>

          </div>


          <div class="stat-card">

            <div class="stat-icon red">
              <ion-icon :icon="alertCircleOutline" />
            </div>

            <div class="stat-content">
              <strong>{{ jumlahTerlambat }}</strong>
              <span>Terlambat</span>
            </div>

          </div>


          <div class="stat-card">

            <div class="stat-icon green">
              <ion-icon :icon="checkmarkCircleOutline" />
            </div>

            <div class="stat-content">
              <strong>{{ jumlahAkanDatang }}</strong>
              <span>Akan Datang</span>
            </div>

          </div>

        </section>


        <!-- EMPTY STATE -->
        <section
          v-if="schedules.length === 0"
          class="empty-state"
        >

          <div class="empty-icon">
            <ion-icon :icon="constructOutline" />
          </div>

          <h2>
            Belum ada jadwal
          </h2>

          <p>
            Tambahkan jadwal perawatan untuk
            barang di rumah kamu.
          </p>

          <button
            class="primary-empty-button"
            @click="tambahJadwal"
          >
            <ion-icon :icon="addOutline" />
            <span>Tambah Jadwal</span>
          </button>

        </section>


        <!-- DAFTAR JADWAL -->
        <section
          v-else
          class="schedule-section"
        >

          <div class="list-heading">

            <div>
              <h2>Jadwal Kamu</h2>
              <p>Perawatan yang perlu diperhatikan</p>
            </div>

            <span class="schedule-count">
              {{ schedules.length }} jadwal
            </span>

          </div>


          <div class="schedule-list">

            <div
              v-for="schedule in schedules"
              :key="schedule.id"
              class="schedule-card"
              @click="
                router.push(
                  `/maintenance/${schedule.id}`
                )
              "
            >

              <!-- TOP CARD -->
              <div class="schedule-top">

                <div class="schedule-icon">
                  <ion-icon :icon="constructOutline" />
                </div>


                <div class="schedule-main">

                  <h3>
                    {{ schedule.itemName }}
                  </h3>

                  <p>
                    {{ schedule.task }}
                  </p>

                </div>


                <div
                  class="status-badge"
                  :class="{
                    'status-late':
                      getStatus(schedule.nextDate) === 'Terlambat',

                    'status-upcoming':
                      getStatus(schedule.nextDate) === 'Akan Datang'
                  }"
                >

                  <span class="status-dot"></span>

                  {{
                    getStatus(schedule.nextDate)
                  }}

                </div>

              </div>


              <!-- DETAIL -->
              <div class="schedule-details">

                <div class="detail-box">

                  <div class="detail-icon">
                    <ion-icon :icon="calendarOutline" />
                  </div>

                  <div class="detail-content">

                    <span>
                      Jadwal berikutnya
                    </span>

                    <strong>
                      {{
                        formatDate(
                          schedule.nextDate
                        )
                      }}
                    </strong>

                  </div>

                </div>


                <div class="detail-box">

                  <div class="detail-icon">
                    <ion-icon :icon="repeatOutline" />
                  </div>

                  <div class="detail-content">

                    <span>
                      Interval
                    </span>

                    <strong>
                      {{ schedule.interval }}
                    </strong>

                  </div>

                </div>

              </div>


              <!-- DETAIL LINK -->
              <div class="detail-link">

                <span>
                  Lihat detail perawatan
                </span>

                <div class="detail-arrow">
                  <ion-icon :icon="chevronForwardOutline" />
                </div>

              </div>

            </div>

          </div>

        </section>


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
  onIonViewWillEnter
} from '@ionic/vue'

import { API_BASE_URL } from '@/config/api'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon
} from '@ionic/vue'

import {
  addOutline,
  calendarOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  constructOutline,
  repeatOutline,
  chevronForwardOutline
} from 'ionicons/icons'


// ========================================
// ROUTER
// ========================================

const router = useRouter()


// ========================================
// TIPE DATA
// ========================================

interface MaintenanceSchedule {

  id: number

  itemId: number

  itemName: string

  task: string

  nextDate: string

  interval: string

}


// ========================================
// STATE
// ========================================

const schedules =
  ref<MaintenanceSchedule[]>([])

const isLoading =
  ref(false)


// ========================================
// LOAD DATA DARI API
// ========================================

const loadSchedules = async () => {

  isLoading.value = true

  try {

    const response =
      await fetch(
        (`${API_BASE_URL}/maintenance`)
      )

    if (!response.ok) {
      throw new Error(
        'Gagal mengambil jadwal perawatan'
      )
    }

    const data =
      await response.json()

    schedules.value =
      data.map((schedule: any) => ({
        id: schedule.id,

        itemId:
          schedule.item_id,

        itemName:
          schedule.item_name,

        task:
          schedule.task,

        nextDate:
          schedule.next_date,

        interval:
          schedule.maintenance_interval

      }))

  } catch (error) {

    console.error(
      'Gagal mengambil jadwal perawatan:',
      error
    )

  } finally {

    isLoading.value = false

  }

}


// ========================================
// LOAD SAAT HALAMAN PERTAMA KALI DIBUKA
// ========================================

onMounted(() => {

  loadSchedules()

})


// ========================================
// LOAD SETIAP KALI HALAMAN AKTIF KEMBALI
// ========================================

onIonViewWillEnter(() => {

  loadSchedules()

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


  const value =
    String(dateString)
      .trim()


  // ====================================
  // FORMAT API / ISO
  // Contoh:
  // 2026-09-10T16:00:00.000Z
  // ====================================

  if (
    /^\d{4}-\d{2}-\d{2}T/.test(
      value
    )
  ) {

    const datePart =
      value.substring(
        0,
        10
      )


    const [
      year,
      month,
      day
    ] =
      datePart
        .split('-')
        .map(Number)


    if (
      Number.isNaN(year) ||
      Number.isNaN(month) ||
      Number.isNaN(day)
    ) {

      return null

    }


    return new Date(
      year,
      month - 1,
      day
    )

  }


  // ====================================
  // FORMAT YYYY-MM-DD
  // ====================================

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {

    const [
      year,
      month,
      day
    ] =
      value
        .split('-')
        .map(Number)


    return new Date(
      year,
      month - 1,
      day
    )

  }


  // ====================================
  // FORMAT TANGGAL INDONESIA
  // Contoh:
  // 10 September 2026
  // ====================================

  const parts =
    value
      .toLowerCase()
      .split(' ')


  if (
    parts.length !== 3
  ) {

    return null

  }


  const day =
    Number(parts[0])


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


  const month =
    months[parts[1]]


  const year =
    Number(parts[2])


  if (
    Number.isNaN(day) ||
    month === undefined ||
    Number.isNaN(year)
  ) {

    return null

  }


  return new Date(
    year,
    month,
    day
  )

}


// ========================================
// STATUS
// ========================================

const getStatus = (
  dateString: string
) => {

  const date =
    parseDate(dateString)


  if (!date) {
    return 'Tidak diketahui'
  }


  const today =
    new Date()


  today.setHours(
    0,
    0,
    0,
    0
  )


  date.setHours(
    0,
    0,
    0,
    0
  )


  if (date < today) {
    return 'Terlambat'
  }


  return 'Akan Datang'

}


// ========================================
// JUMLAH TERLAMBAT
// ========================================

const jumlahTerlambat =
  computed(() => {

    return schedules.value.filter(
      schedule =>
        getStatus(
          schedule.nextDate
        ) === 'Terlambat'
    ).length

  })


// ========================================
// JUMLAH AKAN DATANG
// ========================================

const jumlahAkanDatang =
  computed(() => {

    return schedules.value.filter(
      schedule =>
        getStatus(
          schedule.nextDate
        ) === 'Akan Datang'
    ).length

  })


// ========================================
// FORMAT TANGGAL
// ========================================

const formatDate = (
  dateString: string
) => {

  const date =
    parseDate(dateString)


  if (!date) {
    return dateString
  }


  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`

}


// ========================================
// TAMBAH JADWAL
// ========================================

const tambahJadwal = () => {

  router.push(
    '/maintenance/add'
  )

}

</script>


<style scoped>

.maintenance-page {

  --homecare-blue:
    #63a9d5;

  --homecare-blue-dark:
    #3f8fc3;

  --homecare-background:
    #f5f9fc;

  --homecare-text:
    #263746;

  --homecare-muted:
    #7b8994;

}


/* ========================================
   HEADER
======================================== */

.maintenance-header {

  box-shadow:
    0 2px 10px
    rgba(62, 143, 195, 0.06);

}


.maintenance-header ion-toolbar {

  --background:
    #ffffff;

  --color:
    var(--homecare-text);

  --border-width:
    0;

  --min-height:
    57px;

}


.maintenance-header ion-title {

  font-size:
    20px;

  font-weight:
    750;

  letter-spacing:
    -0.3px;

}


/* ========================================
   CONTENT
======================================== */

.maintenance-content {

  --background:
    var(--homecare-background);

}


.maintenance-container {

  width:
    100%;

  max-width:
    900px;

  margin:
    0 auto;

  padding:
    18px 15px 120px;

}


/* ========================================
   INTRO
======================================== */

.page-intro {

  display:
    flex;

  align-items:
    flex-end;

  justify-content:
    space-between;

  gap:
    15px;

  margin-bottom:
    17px;

}


.intro-text {

  min-width:
    0;

}


.section-small {

  margin:
    0 0 3px;

  color:
    var(--homecare-blue-dark);

  font-size:
    9px;

  font-weight:
    800;

  letter-spacing:
    1px;

}


.page-intro h1 {

  margin:
    0;

  color:
    var(--homecare-text);

  font-size:
    25px;

  line-height:
    1.15;

  font-weight:
    800;

  letter-spacing:
    -0.5px;

}


.intro-description {

  max-width:
    270px;

  margin:
    6px 0 0;

  color:
    var(--homecare-muted);

  font-size:
    11px;

  line-height:
    1.5;

}


/* ========================================
   TOMBOL TAMBAH
======================================== */

.add-button {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    5px;

  flex-shrink:
    0;

  min-width:
    78px;

  height:
    37px;

  padding:
    0 11px;

  border:
    0;

  border-radius:
    11px;

  background:
    var(--homecare-blue);

  color:
    #ffffff;

  font-family:
    inherit;

  font-size:
    11px;

  font-weight:
    750;

  box-shadow:
    0 4px 10px
    rgba(63, 143, 195, 0.18);

  -webkit-tap-highlight-color:
    transparent;

}


.add-button:active {

  background:
    var(--homecare-blue-dark);

  transform:
    translateY(1px);

}


.add-button ion-icon {

  font-size:
    17px;

}


/* ========================================
   STATISTIK
======================================== */

.stats-grid {

  display:
    grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap:
    8px;

  margin-bottom:
    20px;

}


.stat-card {

  display:
    flex;

  align-items:
    center;

  gap:
    8px;

  min-width:
    0;

  padding:
    10px;

  border:
    1px solid #e3edf3;

  border-radius:
    13px;

  background:
    #ffffff;

  box-shadow:
    0 3px 12px
    rgba(62, 143, 195, 0.045);

}


.stat-icon {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-shrink:
    0;

  width:
    31px;

  height:
    31px;

  border-radius:
    9px;

  font-size:
    16px;

}


.stat-icon.blue {

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

}


.stat-icon.red {

  background:
    #fceceb;

  color:
    #c85d5d;

}


.stat-icon.green {

  background:
    #e9f7f1;

  color:
    #4d9a7e;

}


.stat-content {

  min-width:
    0;

}


.stat-card strong {

  display:
    block;

  color:
    var(--homecare-text);

  font-size:
    17px;

  line-height:
    1.1;

  font-weight:
    800;

}


.stat-card span {

  display:
    block;

  margin-top:
    3px;

  overflow:
    hidden;

  color:
    var(--homecare-muted);

  font-size:
    8px;

  text-overflow:
    ellipsis;

  white-space:
    nowrap;

}


/* ========================================
   LIST HEADER
======================================== */

.list-heading {

  display:
    flex;

  align-items:
    flex-end;

  justify-content:
    space-between;

  gap:
    10px;

  margin:
    0 2px 10px;

}


.list-heading h2 {

  margin:
    0;

  color:
    var(--homecare-text);

  font-size:
    15px;

  font-weight:
    750;

}


.list-heading p {

  margin:
    3px 0 0;

  color:
    var(--homecare-muted);

  font-size:
    9px;

}


.schedule-count {

  flex-shrink:
    0;

  padding:
    5px 8px;

  border-radius:
    8px;

  background:
    #eaf5fb;

  color:
    var(--homecare-blue-dark);

  font-size:
    8px;

  font-weight:
    700;

}


/* ========================================
   LIST
======================================== */

.schedule-list {

  display:
    flex;

  flex-direction:
    column;

  gap:
    10px;

}


/* ========================================
   CARD
======================================== */

.schedule-card {

  padding:
    13px;

  border:
    1px solid #e2edf3;

  border-radius:
    15px;

  background:
    #ffffff;

  box-shadow:
    0 4px 14px
    rgba(62, 143, 195, 0.055);

  cursor:
    pointer;

  -webkit-tap-highlight-color:
    transparent;

  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    border-color 0.16s ease;

}


.schedule-card:active {

  transform:
    scale(0.99);

  border-color:
    #cfe4f0;

  box-shadow:
    0 2px 8px
    rgba(62, 143, 195, 0.08);

}


/* ========================================
   BAGIAN ATAS
======================================== */

.schedule-top {

  display:
    flex;

  align-items:
    flex-start;

  gap:
    10px;

}


.schedule-icon {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-shrink:
    0;

  width:
    42px;

  height:
    42px;

  border-radius:
    12px;

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

  font-size:
    21px;

}


.schedule-main {

  flex:
    1;

  min-width:
    0;

}


.schedule-main h3 {

  margin:
    0 0 3px;

  overflow:
    hidden;

  color:
    var(--homecare-text);

  font-size:
    15px;

  font-weight:
    750;

  text-overflow:
    ellipsis;

  white-space:
    nowrap;

}


.schedule-main p {

  margin:
    0;

  overflow:
    hidden;

  color:
    var(--homecare-muted);

  font-size:
    10px;

  line-height:
    1.4;

  text-overflow:
    ellipsis;

  white-space:
    nowrap;

}


/* ========================================
   STATUS
======================================== */

.status-badge {

  display:
    flex;

  align-items:
    center;

  gap:
    4px;

  flex-shrink:
    0;

  padding:
    5px 7px;

  border-radius:
    8px;

  font-size:
    8px;

  font-weight:
    750;

}


.status-dot {

  width:
    5px;

  height:
    5px;

  border-radius:
    50%;

}


.status-upcoming {

  background:
    #eaf7f1;

  color:
    #3f8d70;

}


.status-upcoming .status-dot {

  background:
    #4e9a7c;

}


.status-late {

  background:
    #fcedec;

  color:
    #c25353;

}


.status-late .status-dot {

  background:
    #c25353;

}


/* ========================================
   DETAIL
======================================== */

.schedule-details {

  display:
    grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap:
    8px;

  margin-top:
    13px;

  padding-top:
    12px;

  border-top:
    1px solid #edf3f6;

}


.detail-box {

  display:
    flex;

  align-items:
    center;

  gap:
    7px;

  min-width:
    0;

  padding:
    8px;

  border-radius:
    10px;

  background:
    #f8fbfd;

}


.detail-icon {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-shrink:
    0;

  width:
    27px;

  height:
    27px;

  border-radius:
    8px;

  background:
    #e7f3fa;

  color:
    var(--homecare-blue-dark);

}


.detail-icon ion-icon {

  font-size:
    13px;

}


.detail-content {

  min-width:
    0;

}


.detail-box span {

  display:
    block;

  color:
    var(--homecare-muted);

  font-size:
    8px;

}


.detail-box strong {

  display:
    block;

  margin-top:
    2px;

  overflow:
    hidden;

  color:
    var(--homecare-text);

  font-size:
    10px;

  font-weight:
    700;

  text-overflow:
    ellipsis;

  white-space:
    nowrap;

}


/* ========================================
   DETAIL LINK
======================================== */

.detail-link {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  margin-top:
    10px;

  padding-top:
    9px;

  border-top:
    1px solid #edf3f6;

  color:
    var(--homecare-blue-dark);

  font-size:
    9px;

  font-weight:
    700;

}


.detail-arrow {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  width:
    23px;

  height:
    23px;

  border-radius:
    7px;

  background:
    #eaf5fb;

}


.detail-arrow ion-icon {

  font-size:
    14px;

}


/* ========================================
   EMPTY STATE
======================================== */

.empty-state {

  padding:
    55px 20px;

  text-align:
    center;

}


.empty-icon {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  width:
    65px;

  height:
    65px;

  margin:
    0 auto 14px;

  border-radius:
    19px;

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

  font-size:
    30px;

}


.empty-state h2 {

  margin:
    0 0 7px;

  color:
    var(--homecare-text);

  font-size:
    18px;

  font-weight:
    750;

}


.empty-state p {

  max-width:
    280px;

  margin:
    0 auto 18px;

  color:
    var(--homecare-muted);

  font-size:
    11px;

  line-height:
    1.5;

}


.primary-empty-button {

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    5px;

  height:
    38px;

  padding:
    0 14px;

  border:
    0;

  border-radius:
    11px;

  background:
    var(--homecare-blue);

  color:
    #ffffff;

  font-family:
    inherit;

  font-size:
    10px;

  font-weight:
    700;

  -webkit-tap-highlight-color:
    transparent;

}


.primary-empty-button:active {

  background:
    var(--homecare-blue-dark);

  transform:
    translateY(1px);

}


/* ========================================
   BOTTOM SPACE
======================================== */

.bottom-space {

  height:
    90px;

}


/* ========================================
   RESPONSIVE
======================================== */

@media (max-width: 600px) {

  .maintenance-container {

    padding:
      17px 13px 120px;

  }


  .page-intro h1 {

    font-size:
      23px;

  }


  .stats-grid {

    gap:
      6px;

  }


  .stat-card {

    padding:
      8px;

    gap:
      6px;

  }


  .stat-icon {

    width:
      29px;

    height:
      29px;

    font-size:
      15px;

  }


  .stat-card strong {

    font-size:
      16px;

  }


  .stat-card span {

    font-size:
      7px;

  }

}


@media (max-width: 360px) {

  .maintenance-container {

    padding-left:
      10px;

    padding-right:
      10px;

  }


  .page-intro {

    gap:
      8px;

  }


  .page-intro h1 {

    font-size:
      21px;

  }


  .add-button {

    min-width:
      68px;

    height:
      35px;

    padding:
      0 8px;

    font-size:
      10px;

  }


  .schedule-top {

    gap:
      7px;

  }


  .schedule-icon {

    width:
      38px;

    height:
      38px;

    font-size:
      19px;

  }


  .schedule-main h3 {

    font-size:
      14px;

  }


  .status-badge {

    padding:
      4px 5px;

    font-size:
      7px;

  }

}

</style>