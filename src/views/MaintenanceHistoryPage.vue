<template>
  <ion-page class="history-page">

    <!-- =================================
         HEADER
    ================================== -->

    <ion-header class="history-header">
      <ion-toolbar>

        <ion-title>
          Riwayat Perawatan
        </ion-title>

      </ion-toolbar>
    </ion-header>


    <!-- =================================
         CONTENT
    ================================== -->

    <ion-content
      :fullscreen="true"
      class="history-content"
    >

      <div class="history-container">


        <!-- =================================
             INTRO
        ================================== -->

        <section class="page-intro">

          <div>

            <p class="section-small">
              RIWAYAT
            </p>

            <h1>
              Perawatan Selesai
            </h1>

            <p class="intro-description">
              Catatan perawatan barang
              yang sudah dilakukan.
            </p>

          </div>

        </section>


        <!-- =================================
             STATISTIK
        ================================== -->

        <div
          v-if="history.length > 0"
          class="stats-grid"
        >

          <div class="stat-card">

            <div class="stat-icon blue">

              <ion-icon
                :icon="timeOutline"
              />

            </div>

            <div>

              <strong>
                {{ history.length }}
              </strong>

              <span>
                Total Riwayat
              </span>

            </div>

          </div>


          <div class="stat-card">

            <div class="stat-icon green">

              <ion-icon
                :icon="checkmarkCircleOutline"
              />

            </div>

            <div>

              <strong>
                {{ history.length }}
              </strong>

              <span>
                Selesai
              </span>

            </div>

          </div>


          <div class="stat-card">

            <div class="stat-icon purple">

              <ion-icon
                :icon="calendarOutline"
              />

            </div>

            <div>

              <strong>
                {{ history.length }}
              </strong>

              <span>
                Tercatat
              </span>

            </div>

          </div>

        </div>


        <!-- =================================
             LOADING
        ================================== -->

        <div
          v-if="isLoading"
          class="empty-state"
        >

          <div class="empty-icon">

            <ion-icon
              :icon="timeOutline"
            />

          </div>

          <h2>
            Memuat riwayat...
          </h2>

          <p>
            Sedang mengambil data
            riwayat perawatan.
          </p>

        </div>


        <!-- =================================
             EMPTY STATE
        ================================== -->

        <div
          v-else-if="history.length === 0"
          class="empty-state"
        >

          <div class="empty-icon">

            <ion-icon
              :icon="timeOutline"
            />

          </div>

          <h2>
            Belum ada riwayat
          </h2>

          <p>
            Riwayat perawatan akan muncul
            setelah kamu menyelesaikan
            jadwal perawatan.
          </p>

        </div>


        <!-- =================================
             DAFTAR RIWAYAT
        ================================== -->

        <div
          v-else
          class="history-list"
        >

          <div class="list-title">

            <span>
              Riwayat Kamu
            </span>

            <span>
              {{ history.length }} catatan
            </span>

          </div>


          <!-- =================================
               HISTORY CARD
          ================================== -->

          <ion-card
            v-for="item in history"
            :key="item.id"
            class="history-card"
          >

            <ion-card-content>


              <!-- =================================
                   BAGIAN ATAS
              ================================== -->

              <div class="history-top">


                <!-- ICON -->

                <div class="history-icon">

                  <ion-icon
                    :icon="checkmarkCircleOutline"
                  />

                </div>


                <!-- INFORMASI UTAMA -->

                <div class="history-main">

                  <h2>
                    {{ item.itemName }}
                  </h2>

                  <p>
                    {{ item.task }}
                  </p>

                </div>


                <!-- STATUS -->

                <div class="completed-badge">

                  <span
                    class="status-dot"
                  ></span>

                  Selesai

                </div>

              </div>


              <!-- =================================
                   DETAIL
              ================================== -->

              <div class="history-details">


                <!-- TANGGAL SELESAI -->

                <div class="detail-box">

                  <div class="detail-icon">

                    <ion-icon
                      :icon="calendarOutline"
                    />

                  </div>

                  <div>

                    <span>
                      Dirawat pada
                    </span>

                    <strong>
                      {{
                        formatDate(
                          item.completedDate
                        )
                      }}
                    </strong>

                  </div>

                </div>


                <!-- JADWAL BERIKUTNYA -->

                <div class="detail-box">

                  <div class="detail-icon">

                    <ion-icon
                      :icon="repeatOutline"
                    />

                  </div>

                  <div>

                    <span>
                      Berikutnya
                    </span>

                    <strong>
                      {{
                        formatDate(
                          item.nextDate
                        )
                      }}
                    </strong>

                  </div>

                </div>

              </div>


              <!-- =================================
                   FOOTER CARD
              ================================== -->

              <div class="history-footer">

                <div class="interval-info">

                  <ion-icon
                    :icon="refreshOutline"
                  />

                  <span>
                    {{ item.interval }}
                  </span>

                </div>


                <button
                  class="delete-button"
                  @click.stop="
                    bukaKonfirmasiHapus(item.id)
                  "
                >

                  <ion-icon
                    :icon="trashOutline"
                  />

                  Hapus

                </button>

              </div>

            </ion-card-content>

          </ion-card>

        </div>


        <!-- =================================
             BOTTOM SPACE
        ================================== -->

        <div class="bottom-space"></div>

      </div>


      <!-- =================================
           DELETE ALERT
      ================================== -->

      <ion-alert
        :is-open="showDeleteAlert"
        header="Hapus Riwayat?"
        message="Riwayat perawatan ini akan dihapus."
        :buttons="deleteAlertButtons"
        @didDismiss="
          showDeleteAlert = false
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
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  IonAlert,
  onIonViewWillEnter
} from '@ionic/vue'

import {
  timeOutline,
  calendarOutline,
  checkmarkCircleOutline,
  repeatOutline,
  refreshOutline,
  trashOutline
} from 'ionicons/icons'

import { API_BASE_URL } from '@/config/api'


// ========================================
// TIPE DATA
// ========================================

interface MaintenanceHistory {

  id: number

  scheduleId: number

  itemId: number

  itemName: string

  task: string

  completedDate: string

  nextDate: string

  interval: string

  createdAt?: string

}


// ========================================
// STATE
// ========================================

const history =
  ref<MaintenanceHistory[]>([])


const isLoading =
  ref(false)


const showDeleteAlert =
  ref(false)


const selectedHistoryId =
  ref<number | null>(null)


// ========================================
// AMBIL DATA DARI API
// ========================================

const loadHistory = async () => {

  isLoading.value = true

  try {

    const response =
      await fetch(
        `${API_BASE_URL}/maintenance/history`
      )

    if (!response.ok) {

      throw new Error(
        'Gagal mengambil riwayat perawatan'
      )

    }

    const data =
      await response.json()

    history.value =
      data.map(
        (item: any) => ({

          id: item.id,

          scheduleId:
            item.schedule_id,

          itemId:
            item.item_id,

          itemName:
            item.item_name,

          task:
            item.task,

          completedDate:
            item.completed_date,

          nextDate:
            item.next_date,

          interval:
            item.maintenance_interval,

          createdAt:
            item.created_at

        })
      )

  } catch (error) {

    console.error(
      'Gagal mengambil riwayat:',
      error
    )

    history.value = []

  } finally {

    isLoading.value = false

  }

}


// ========================================
// PARSE TANGGAL
// ========================================

const parseDate = (
  dateString: string
): Date | null => {

  if (!dateString) {

    return null

  }


  // FORMAT YYYY-MM-DD

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


  // FORMAT ISO DARI MYSQL

  if (
    dateString.includes('T')
  ) {

    const date =
      new Date(dateString)

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {

      return date

    }

  }


  // FORMAT:
  // 20 Desember 2026

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
// FORMAT TANGGAL TAMPILAN
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
// KONFIRMASI HAPUS
// ========================================

const bukaKonfirmasiHapus = (
  id: number
) => {

  console.log(
    'Tombol hapus ditekan:',
    id
  )


  selectedHistoryId.value =
    id


  showDeleteAlert.value =
    true

}


// ========================================
// TOMBOL ALERT
// ========================================

const deleteAlertButtons = [

  {
    text: 'Batal',
    role: 'cancel'
  },

  {
    text: 'Hapus',
    role: 'destructive',

    handler: () => {

      hapusRiwayat()

    }

  }

]


// ========================================
// HAPUS RIWAYAT DARI API
// ========================================

const hapusRiwayat = async () => {

  if (
    selectedHistoryId.value === null
  ) {

    return

  }


  const id =
    selectedHistoryId.value


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/maintenance/history/${id}`,
        {
          method: 'DELETE'
        }
      )


    const data =
      await response.json()


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Gagal menghapus riwayat'
      )

    }


    history.value =
      history.value.filter(
        item =>
          item.id !== id
      )


    selectedHistoryId.value =
      null

  } catch (error) {

    console.error(
      'Gagal menghapus riwayat:',
      error
    )

  }

}


// ========================================
// LOAD AWAL
// ========================================

onMounted(() => {

  loadHistory()

})


// ========================================
// LOAD SETIAP KALI HALAMAN AKTIF KEMBALI
// ========================================

onIonViewWillEnter(() => {

  loadHistory()

})

</script>


<style scoped>

.history-page {

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


.history-header {

  box-shadow:
    0 2px 10px
    rgba(62, 143, 195, 0.06);

}


.history-header ion-toolbar {

  --background:
    #ffffff;

  --color:
    var(--homecare-text);

  --border-width:
    0;

  --min-height:
    57px;

}


.history-header ion-title {

  font-size:
    20px;

  font-weight:
    750;

  letter-spacing:
    -0.3px;

}


.history-content {

  --background:
    var(--homecare-background);

}


.history-container {

  width:
    100%;

  max-width:
    900px;

  margin:
    0 auto;

  padding:
    18px 15px 120px;

}


.page-intro {

  margin-bottom:
    17px;

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
    300px;

  margin:
    6px 0 0;

  color:
    var(--homecare-muted);

  font-size:
    11px;

  line-height:
    1.5;

}


.stats-grid {

  display:
    grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap:
    8px;

  margin-bottom:
    19px;

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


.stat-icon.green {

  background:
    #e9f7f1;

  color:
    #4d9a7e;

}


.stat-icon.purple {

  background:
    #f1edfb;

  color:
    #806bb2;

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


.list-title {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  margin:
    0 2px 9px;

}


.list-title span:first-child {

  color:
    var(--homecare-text);

  font-size:
    14px;

  font-weight:
    750;

}


.list-title span:last-child {

  color:
    var(--homecare-muted);

  font-size:
    9px;

}


.history-list {

  display:
    flex;

  flex-direction:
    column;

  gap:
    10px;

}


.history-card {

  margin:
    0;

  --background:
    #ffffff;

  border:
    1px solid #e2edf3;

  border-radius:
    15px;

  box-shadow:
    0 4px 14px
    rgba(62, 143, 195, 0.055);

}


.history-card ion-card-content {

  padding:
    13px;

}


.history-top {

  display:
    flex;

  align-items:
    flex-start;

  gap:
    10px;

}


.history-icon {

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
    #e9f7f1;

  color:
    #4d9a7e;

  font-size:
    21px;

}


.history-main {

  flex:
    1;

  min-width:
    0;

}


.history-main h2 {

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


.history-main p {

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


.completed-badge {

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

  background:
    #eaf7f1;

  color:
    #3f8d70;

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

  background:
    #4e9a7c;

}


.history-details {

  display:
    grid;

  grid-template-columns:
    1fr 1fr;

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


.detail-box div:last-child {

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


.history-footer {

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

}


.interval-info {

  display:
    flex;

  align-items:
    center;

  gap:
    5px;

  color:
    var(--homecare-muted);

  font-size:
    9px;

}


.interval-info ion-icon {

  font-size:
    14px;

  color:
    var(--homecare-blue-dark);

}


.delete-button {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    4px;

  padding:
    5px 7px;

  border:
    0;

  border-radius:
    8px;

  background:
    #fcedec;

  color:
    #c25353;

  font-family:
    inherit;

  font-size:
    8px;

  font-weight:
    700;

}


.delete-button ion-icon {

  font-size:
    13px;

}


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
    0 auto;

  color:
    var(--homecare-muted);

  font-size:
    11px;

  line-height:
    1.5;

}


.bottom-space {

  height:
    90px;

}


@media (max-width: 600px) {

  .history-container {

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

  .history-container {

    padding-left:
      10px;

    padding-right:
      10px;

  }


  .page-intro h1 {

    font-size:
      21px;

  }


  .history-top {

    gap:
      7px;

  }


  .history-icon {

    width:
      38px;

    height:
      38px;

    font-size:
      19px;

  }


  .history-main h2 {

    font-size:
      14px;

  }


  .completed-badge {

    padding:
      4px 5px;

    font-size:
      7px;

  }

}

</style>