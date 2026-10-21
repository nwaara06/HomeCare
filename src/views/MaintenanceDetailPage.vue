<template>
  <ion-page class="maintenance-detail-page">

    <!-- =================================
         HEADER
    ================================== -->

    <ion-header class="detail-header">

      <ion-toolbar>

        <ion-buttons slot="start">

          <ion-back-button
            default-href="/maintenance"
          />

        </ion-buttons>

        <ion-title>
          Detail Perawatan
        </ion-title>

      </ion-toolbar>

    </ion-header>


    <!-- =================================
         CONTENT
    ================================== -->

    <ion-content
      :fullscreen="true"
      class="detail-content"
    >

      <div class="detail-container">


        <!-- =================================
             LOADING
        ================================== -->

        <div
          v-if="isLoading"
          class="empty-state"
        >

          <div class="empty-icon">

            <ion-icon
              :icon="constructOutline"
            />

          </div>

          <h2>
            Memuat data...
          </h2>

          <p>
            Sedang mengambil detail jadwal perawatan.
          </p>

        </div>


        <!-- =================================
             DATA DITEMUKAN
        ================================== -->

        <div
          v-else-if="schedule"
          class="schedule-detail"
        >

          <!-- =================================
               HERO
          ================================= -->

          <section class="detail-hero">

            <div class="hero-icon">

              <ion-icon
                :icon="constructOutline"
              />

            </div>

            <p class="section-small">
              DETAIL PERAWATAN
            </p>

            <h1>
              {{ schedule.itemName }}
            </h1>

            <p class="hero-task">
              {{ schedule.task }}
            </p>


            <!-- STATUS -->

            <div
              class="status-badge"
              :class="{
                'status-late':
                  getStatus(schedule.nextDate) ===
                  'Terlambat',

                'status-upcoming':
                  getStatus(schedule.nextDate) ===
                  'Akan Datang'
              }"
            >

              <span class="status-dot"></span>

              {{
                getStatus(schedule.nextDate)
              }}

            </div>

          </section>


          <!-- =================================
               JADWAL BERIKUTNYA
          ================================== -->

          <section class="next-maintenance-card">

            <div class="next-icon">

              <ion-icon
                :icon="calendarOutline"
              />

            </div>

            <div class="next-content">

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

          </section>


          <!-- =================================
               INFORMASI
          ================================== -->

          <section class="info-section">

            <div class="section-heading">

              <span>
                Informasi Jadwal
              </span>

            </div>


            <div class="info-card">


              <!-- INTERVAL -->

              <div class="info-row">

                <div class="info-label">

                  <div class="row-icon blue">

                    <ion-icon
                      :icon="repeatOutline"
                    />

                  </div>

                  <span>
                    Interval
                  </span>

                </div>

                <strong>
                  {{ schedule.interval }}
                </strong>

              </div>


              <!-- CATATAN -->

              <div class="info-row">

                <div class="info-label">

                  <div class="row-icon green">

                    <ion-icon
                      :icon="documentTextOutline"
                    />

                  </div>

                  <span>
                    Catatan
                  </span>

                </div>

                <strong
                  class="notes-value"
                >
                  {{
                    schedule.notes ||
                    'Tidak ada catatan'
                  }}
                </strong>

              </div>

            </div>

          </section>


          <!-- =================================
               TOMBOL AKSI
          ================================== -->

          <section class="action-section">

            <button
              class="complete-button"
              type="button"
              :disabled="isSaving"
              @click="sudahDirawat"
            >

              <div class="action-icon">

                <ion-icon
                  :icon="
                    checkmarkCircleOutline
                  "
                />

              </div>

              <div class="action-text">

                <strong>
                  {{
                    isSaving
                      ? 'Menyimpan...'
                      : 'Sudah Dirawat'
                  }}
                </strong>

                <span>
                  Catat perawatan hari ini
                </span>

              </div>

            </button>


            <button
              class="back-button"
              type="button"
              @click="kembali"
            >

              <ion-icon
                :icon="
                  arrowBackOutline
                "
              />

              Kembali ke Jadwal

            </button>

          </section>


        </div>


        <!-- =================================
             DATA TIDAK DITEMUKAN
        ================================== -->

        <div
          v-else
          class="empty-state"
        >

          <div class="empty-icon">

            <ion-icon
              :icon="searchOutline"
            />

          </div>

          <h2>
            Jadwal tidak ditemukan
          </h2>

          <p>
            Data jadwal perawatan
            tidak tersedia.
          </p>

          <button
            class="empty-button"
            type="button"
            @click="kembali"
          >

            <ion-icon
              :icon="arrowBackOutline"
            />

            Kembali ke Jadwal

          </button>

        </div>


        <!-- SPACE BOTTOM NAV -->

        <div class="bottom-space"></div>

      </div>


      <!-- =================================
           ALERT BERHASIL
      ================================== -->

      <ion-alert
        :is-open="showSuccessAlert"
        header="Perawatan Berhasil"
        :message="successMessage"
        :buttons="successAlertButtons"
        @didDismiss="
          showSuccessAlert = false
        "
      />


      <!-- =================================
           ALERT ERROR
      ================================== -->

      <ion-alert
        :is-open="showErrorAlert"
        header="Terjadi Kesalahan"
        :message="errorMessage"
        :buttons="errorAlertButtons"
        @didDismiss="
          showErrorAlert = false
        "
      />

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import {
  onMounted,
  ref
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import { API_BASE_URL } from '@/config/api'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonAlert
} from '@ionic/vue'

import {
  constructOutline,
  calendarOutline,
  repeatOutline,
  documentTextOutline,
  checkmarkCircleOutline,
  arrowBackOutline,
  searchOutline
} from 'ionicons/icons'


// ========================================
// ROUTER
// ========================================

const route = useRoute()

const router = useRouter()


// ========================================
// TIPE DATA JADWAL
// ========================================

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
// ID JADWAL
// ========================================

const scheduleId =
  Number(route.params.id)


// ========================================
// STATE
// ========================================

const schedule =
  ref<MaintenanceSchedule | null>(
    null
  )


const isLoading =
  ref(true)


const isSaving =
  ref(false)


const showSuccessAlert =
  ref(false)


const showErrorAlert =
  ref(false)


const successMessage =
  ref('')


const errorMessage =
  ref('')


// ========================================
// ALERT BUTTON
// ========================================

const successAlertButtons = [
  {
    text: 'OK',
    role: 'confirm'
  }
]


const errorAlertButtons = [
  {
    text: 'OK',
    role: 'confirm'
  }
]


// ========================================
// LOAD DETAIL DARI API
// ========================================

const loadSchedule = async () => {

  isLoading.value = true

  try {

    if (
      !Number.isFinite(scheduleId) ||
      scheduleId <= 0
    ) {

      schedule.value = null

      return

    }


    const response = await fetch(
      `${API_BASE_URL}/maintenance/${scheduleId}`
    )


    if (!response.ok) {

      if (response.status === 404) {

        schedule.value = null

        return

      }

      throw new Error(
        'Gagal mengambil detail jadwal'
      )

    }


    const data =
      await response.json()


    schedule.value = {

      id:
        data.id,

      itemId:
        data.item_id,

      itemName:
        data.item_name,

      task:
        data.task,

      nextDate:
        data.next_date,

      interval:
        data.maintenance_interval,

      notes:
        data.notes

    }

  } catch (error) {

    console.error(
      'Gagal mengambil detail jadwal:',
      error
    )

    schedule.value = null

    errorMessage.value =
      'Gagal mengambil data detail perawatan.'

    showErrorAlert.value =
      true

  } finally {

    isLoading.value = false

  }

}


// ========================================
// LOAD SAAT HALAMAN DIBUKA
// ========================================

onMounted(() => {

  loadSchedule()

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


  // ======================================
  // FORMAT YYYY-MM-DD
  // ======================================

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      dateString
    )
  ) {

    const [
      year,
      month,
      day
    ] =
      dateString
        .split('-')
        .map(Number)


    return new Date(
      year,
      month - 1,
      day
    )

  }


  // ======================================
  // FORMAT ISO
  // ======================================

  const isoMatch =
    dateString.match(
      /^(\d{4})-(\d{2})-(\d{2})/
    )


  if (isoMatch) {

    const year =
      Number(isoMatch[1])

    const month =
      Number(isoMatch[2])

    const day =
      Number(isoMatch[3])


    return new Date(
      year,
      month - 1,
      day
    )

  }


  // ======================================
  // FORMAT INDONESIA
  // ======================================

  const parts =
    dateString
      .toLowerCase()
      .trim()
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
// FORMAT TANGGAL
// ========================================

const formatDate = (
  dateString: string
) => {

  const date =
    parseDate(dateString)


  if (!date) {

    return dateString || '-'

  }


  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`

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
// TANGGAL HARI INI
// ========================================

const getToday = () => {

  const today =
    new Date()


  const year =
    today.getFullYear()


  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, '0')


  const day =
    String(
      today.getDate()
    ).padStart(2, '0')


  return `${year}-${month}-${day}`

}


// ========================================
// SUDAH DIRAWAT
// ========================================

const sudahDirawat = async () => {

  if (!schedule.value) {

    errorMessage.value =
      'Data jadwal tidak ditemukan.'

    showErrorAlert.value =
      true

    return

  }


  if (isSaving.value) {

    return

  }


  isSaving.value = true


  try {

    // FIX: Gunakan tanggal jadwal (nextDate) sebagai tanggal dirawat,
    // bukan hari ini. Contoh: jadwal 12 Sep → dirawat 12 Sep → berikutnya 12 Okt
    const completedDate =
      schedule.value.nextDate || getToday()


    const response =
      await fetch(
        `${API_BASE_URL}/maintenance/${scheduleId}/complete`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            completed_date:
              completedDate
          })
        }
      )


    const data =
      await response.json()


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Gagal mencatat perawatan'
      )

    }


    // ====================================
    // UPDATE DATA DI HALAMAN
    // ====================================

    schedule.value = {

      ...schedule.value,

      nextDate:
        data.next_date

    }


    // ====================================
    // PESAN BERHASIL
    // ====================================

    successMessage.value =
      'Tanggal dirawat: ' +
      formatDate(completedDate) +
      '\n\n' +
      'Jadwal berikutnya: ' +
      formatDate(data.next_date)


    showSuccessAlert.value =
      true

  } catch (error) {

    console.error(
      'Gagal mencatat perawatan:',
      error
    )


    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Terjadi kesalahan saat menyimpan perawatan.'


    showErrorAlert.value =
      true

  } finally {

    isSaving.value = false

  }

}


// ========================================
// KEMBALI
// ========================================

const kembali = () => {

  router.push(
    '/maintenance'
  )

}

</script>


<style scoped>

.maintenance-detail-page {

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


.detail-header {

  box-shadow:
    0 2px 10px
    rgba(62, 143, 195, 0.06);

}


.detail-header ion-toolbar {

  --background:
    #ffffff;

  --color:
    var(--homecare-text);

  --border-width:
    0;

  --min-height:
    57px;

}


.detail-header ion-title {

  font-size:
    20px;

  font-weight:
    750;

  letter-spacing:
    -0.3px;

}


.detail-header ion-back-button {

  --color:
    var(--homecare-blue-dark);

}


.detail-content {

  --background:
    var(--homecare-background);

}


.detail-container {

  width:
    100%;

  max-width:
    700px;

  margin:
    0 auto;

  padding:
    18px 15px 120px;

}


.detail-hero {

  text-align:
    center;

  padding:
    8px 10px 20px;

}


.hero-icon {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  width:
    72px;

  height:
    72px;

  margin:
    0 auto 13px;

  border-radius:
    21px;

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

  font-size:
    34px;

}


.section-small {

  margin:
    0 0 4px;

  color:
    var(--homecare-blue-dark);

  font-size:
    9px;

  font-weight:
    800;

  letter-spacing:
    1px;

}


.detail-hero h1 {

  margin:
    0;

  color:
    var(--homecare-text);

  font-size:
    26px;

  line-height:
    1.15;

  font-weight:
    800;

  letter-spacing:
    -0.5px;

}


.hero-task {

  margin:
    6px 0 11px;

  color:
    var(--homecare-muted);

  font-size:
    12px;

}


.status-badge {

  display:
    inline-flex;

  align-items:
    center;

  gap:
    5px;

  padding:
    6px 9px;

  border-radius:
    9px;

  font-size:
    9px;

  font-weight:
    750;

}


.status-dot {

  width:
    6px;

  height:
    6px;

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


.next-maintenance-card {

  display:
    flex;

  align-items:
    center;

  gap:
    12px;

  padding:
    14px;

  border:
    1px solid #dcecf4;

  border-radius:
    15px;

  background:
    #ffffff;

  box-shadow:
    0 4px 14px
    rgba(62, 143, 195, 0.055);

}


.next-icon {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-shrink:
    0;

  width:
    43px;

  height:
    43px;

  border-radius:
    12px;

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

  font-size:
    21px;

}


.next-content {

  min-width:
    0;

}


.next-content span {

  display:
    block;

  color:
    var(--homecare-muted);

  font-size:
    9px;

}


.next-content strong {

  display:
    block;

  margin-top:
    3px;

  color:
    var(--homecare-text);

  font-size:
    16px;

  font-weight:
    800;

}


.info-section {

  margin-top:
    19px;

}


.section-heading {

  margin:
    0 2px 9px;

  color:
    var(--homecare-text);

  font-size:
    14px;

  font-weight:
    750;

}


.info-card {

  overflow:
    hidden;

  border:
    1px solid #e2edf3;

  border-radius:
    15px;

  background:
    #ffffff;

  box-shadow:
    0 4px 14px
    rgba(62, 143, 195, 0.045);

}


.info-row {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    15px;

  padding:
    12px 13px;

}


.info-row + .info-row {

  border-top:
    1px solid #edf3f6;

}


.info-label {

  display:
    flex;

  align-items:
    center;

  gap:
    8px;

  min-width:
    0;

  color:
    var(--homecare-muted);

  font-size:
    10px;

}


.row-icon {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-shrink:
    0;

  width:
    29px;

  height:
    29px;

  border-radius:
    9px;

  font-size:
    14px;

}


.row-icon.blue {

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

}


.row-icon.green {

  background:
    #e9f7f1;

  color:
    #4d9a7e;

}


.info-row strong {

  max-width:
    60%;

  color:
    var(--homecare-text);

  font-size:
    10px;

  font-weight:
    700;

  text-align:
    right;

}


.notes-value {

  line-height:
    1.4;

}


.action-section {

  display:
    flex;

  flex-direction:
    column;

  gap:
    9px;

  margin-top:
    19px;

}


.complete-button {

  display:
    flex;

  align-items:
    center;

  width:
    100%;

  padding:
    12px;

  border:
    0;

  border-radius:
    14px;

  background:
    #e9f7f1;

  color:
    #3f8d70;

  font-family:
    inherit;

  text-align:
    left;

  box-shadow:
    0 3px 12px
    rgba(77, 154, 126, 0.06);

}


.complete-button:disabled {

  opacity:
    0.65;

}


.action-icon {

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

  margin-right:
    10px;

  border-radius:
    12px;

  background:
    #4d9a7e;

  color:
    #ffffff;

  font-size:
    21px;

}


.action-text {

  display:
    flex;

  flex-direction:
    column;

  gap:
    3px;

}


.action-text strong {

  font-size:
    13px;

  font-weight:
    800;

}


.action-text span {

  font-size:
    9px;

  color:
    #6d9485;

}


.back-button {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    6px;

  height:
    39px;

  border:
    1px solid #dce8ee;

  border-radius:
    11px;

  background:
    #ffffff;

  color:
    var(--homecare-blue-dark);

  font-family:
    inherit;

  font-size:
    10px;

  font-weight:
    700;

}


.back-button ion-icon {

  font-size:
    15px;

}


.empty-state {

  padding:
    65px 20px;

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
    19px;

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


.empty-button {

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

}


.bottom-space {

  height:
    90px;

}


@media (max-width: 600px) {

  .detail-container {

    padding:
      17px 13px 120px;

  }


  .detail-hero h1 {

    font-size:
      23px;

  }


  .hero-icon {

    width:
      66px;

    height:
      66px;

    font-size:
      31px;

  }


  .next-content strong {

    font-size:
      15px;

  }

}


@media (max-width: 360px) {

  .detail-container {

    padding-left:
      10px;

    padding-right:
      10px;

  }


  .detail-hero h1 {

    font-size:
      21px;

  }


  .info-row {

    padding:
      11px;

  }


  .info-row strong {

    max-width:
      55%;

  }

}

</style>