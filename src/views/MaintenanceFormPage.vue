<template>
  <ion-page class="maintenance-form-page">

    <!-- =================================
         HEADER
    ================================== -->

    <ion-header class="form-header">

      <ion-toolbar>

        <ion-buttons slot="start">

          <ion-back-button
            default-href="/maintenance"
          />

        </ion-buttons>

        <ion-title>
          Tambah Jadwal
        </ion-title>

      </ion-toolbar>

    </ion-header>


    <!-- =================================
         CONTENT
    ================================== -->

    <ion-content
      :fullscreen="true"
      class="form-content"
    >

      <div class="form-container">


        <!-- =================================
             INTRO
        ================================== -->

        <section class="page-intro">

          <div class="intro-icon">

            <ion-icon
              :icon="calendarOutline"
            />

          </div>

          <div>

            <p class="section-small">
              PERAWATAN
            </p>

            <h1>
              Tambah Jadwal
            </h1>

            <p class="intro-description">
              Buat jadwal perawatan untuk
              barang di rumah kamu.
            </p>

          </div>

        </section>


        <!-- =================================
             FORM CARD
        ================================== -->

        <section class="form-card">


          <!-- =================================
               BARANG
          ================================== -->

          <div class="field-group">

            <div class="field-label">

              <div class="field-icon blue">

                <ion-icon
                  :icon="cubeOutline"
                />

              </div>

              <div>

                <strong>
                  Barang
                </strong>

                <span>
                  Pilih barang yang akan dirawat
                </span>

              </div>

            </div>


            <ion-select
              v-model="form.itemId"
              class="custom-select"
              interface="action-sheet"
              placeholder="Pilih barang"
              :disabled="isLoadingItems"
            >

              <ion-select-option
                v-for="item in items"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </ion-select-option>

            </ion-select>

          </div>


          <!-- =================================
               JENIS PERAWATAN
          ================================== -->

          <div class="field-group">

            <div class="field-label">

              <div class="field-icon green">

                <ion-icon
                  :icon="constructOutline"
                />

              </div>

              <div>

                <strong>
                  Jenis Perawatan
                </strong>

                <span>
                  Apa yang perlu dilakukan?
                </span>

              </div>

            </div>


            <ion-input
              v-model="form.task"
              class="custom-input"
              placeholder="Contoh: Bersihkan filter AC"
            />

          </div>


          <!-- =================================
               TANGGAL
          ================================== -->

          <div class="field-group">

            <div class="field-label">

              <div class="field-icon purple">

                <ion-icon
                  :icon="calendarNumberOutline"
                />

              </div>

              <div>

                <strong>
                  Tanggal Berikutnya
                </strong>

                <span>
                  Kapan perawatan dilakukan?
                </span>

              </div>

            </div>


            <ion-input
              v-model="form.nextDate"
              class="custom-input"
              type="date"
            />

          </div>


          <!-- =================================
               INTERVAL
          ================================== -->

          <div class="field-group">

            <div class="field-label">

              <div class="field-icon orange">

                <ion-icon
                  :icon="repeatOutline"
                />

              </div>

              <div>

                <strong>
                  Interval Perawatan
                </strong>

                <span>
                  Seberapa sering dilakukan?
                </span>

              </div>

            </div>


            <ion-select
              v-model="form.interval"
              class="custom-select"
              interface="action-sheet"
              placeholder="Pilih interval"
            >

              <ion-select-option
                value="Setiap 1 bulan"
              >
                Setiap 1 bulan
              </ion-select-option>

              <ion-select-option
                value="Setiap 3 bulan"
              >
                Setiap 3 bulan
              </ion-select-option>

              <ion-select-option
                value="Setiap 6 bulan"
              >
                Setiap 6 bulan
              </ion-select-option>

              <ion-select-option
                value="Setiap 12 bulan"
              >
                Setiap 12 bulan
              </ion-select-option>

              <ion-select-option
                value="Sekali saja"
              >
                Sekali saja
              </ion-select-option>

            </ion-select>

          </div>


          <!-- =================================
               CATATAN
          ================================== -->

          <div class="field-group">

            <div class="field-label">

              <div class="field-icon gray">

                <ion-icon
                  :icon="documentTextOutline"
                />

              </div>

              <div>

                <strong>
                  Catatan
                </strong>

                <span>
                  Tambahkan informasi jika diperlukan
                </span>

              </div>

            </div>


            <ion-textarea
              v-model="form.notes"
              class="custom-textarea"
              placeholder="Contoh: Gunakan teknisi resmi."
              :auto-grow="true"
              :rows="3"
            />

          </div>


        </section>


        <!-- =================================
             ACTION
        ================================== -->

        <section class="action-section">

          <button
            class="save-button"
            type="button"
            :disabled="isSaving"
            @click="simpanJadwal"
          >

            <ion-icon
              :icon="checkmarkCircleOutline"
            />

            <span>
              {{ isSaving ? 'Menyimpan...' : 'Simpan Jadwal' }}
            </span>

          </button>


          <button
            class="cancel-button"
            type="button"
            :disabled="isSaving"
            @click="batal"
          >

            Batal

          </button>

        </section>


        <!-- BOTTOM SPACE -->

        <div class="bottom-space"></div>

      </div>

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import {
  onMounted,
  reactive,
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
  IonButtons,
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonTextarea,
  IonIcon,
  toastController
} from '@ionic/vue'

import {
  calendarOutline,
  calendarNumberOutline,
  cubeOutline,
  constructOutline,
  repeatOutline,
  documentTextOutline,
  checkmarkCircleOutline
} from 'ionicons/icons'

import { API_BASE_URL } from '@/config/api'
import { LocalNotifications } from '@capacitor/local-notifications'


// ========================================
// ROUTER
// ========================================

const router =
  useRouter()


// ========================================
// TIPE DATA BARANG
// ========================================

interface Item {

  id: number

  name: string

  category: string

  location: string

  purchaseDate?: string

  notes?: string

}


// ========================================
// DATA BARANG
// ========================================

const items =
  ref<Item[]>([])


// ========================================
// STATUS
// ========================================

const isLoadingItems =
  ref(false)

const isSaving =
  ref(false)


// ========================================
// FORM
// ========================================

const form = reactive({

  itemId:
    null as number | null,

  task:
    '',

  nextDate:
    '',

  interval:
    '',

  notes:
    ''

})


// ========================================
// AMBIL DATA BARANG DARI API
// ========================================

const loadItems =
  async () => {

    isLoadingItems.value =
      true

    try {

      const response =
        await fetch(
          `${API_BASE_URL}/items`
        )


      if (!response.ok) {

        throw new Error(
          'Gagal mengambil data barang'
        )

      }


      const data =
        await response.json()


      items.value =
        data.map(
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


    } catch (error) {

      console.error(
        'Gagal mengambil data barang:',
        error
      )


      const toast =
        await toastController.create({

          message:
            'Gagal mengambil data barang dari server.',

          duration:
            2500,

          position:
            'bottom'

        })


      await toast.present()


    } finally {

      isLoadingItems.value =
        false

    }

}


// ========================================
// SIMPAN JADWAL
// ========================================

const simpanJadwal =
  async () => {


  // ====================================
  // VALIDASI
  // ====================================

  if (
    !form.itemId ||
    !form.task.trim() ||
    !form.nextDate ||
    !form.interval
  ) {

    const toast =
      await toastController.create({

        message:
          'Barang, jenis perawatan, tanggal, dan interval wajib diisi.',

        duration:
          2500,

        position:
          'bottom'

      })


    await toast.present()

    return

  }


  // ====================================
  // CEGAH DOUBLE CLICK
  // ====================================

  if (isSaving.value) {

    return

  }


  // ====================================
  // PASTIKAN BARANG ADA
  // ====================================

  const selectedItem =
    items.value.find(
      item =>
        item.id ===
        form.itemId
    )


  if (!selectedItem) {

    const toast =
      await toastController.create({

        message:
          'Barang tidak ditemukan.',

        duration:
          2000,

        position:
          'bottom'

      })


    await toast.present()

    return

  }


  // ====================================
  // MULAI SIMPAN
  // ====================================

  isSaving.value =
    true


  try {


    // ==================================
    // KIRIM KE API
    // ==================================

    const response =
      await fetch(
        `${API_BASE_URL}/maintenance`,
        {

          method:
            'POST',

          headers: {

            'Content-Type':
              'application/json'

          },

          body:
            JSON.stringify({

              item_id:
                selectedItem.id,

              task:
                form.task.trim(),

              next_date:
                form.nextDate,

              maintenance_interval:
                form.interval,

              notes:
                form.notes.trim() || null

            })

        }
      )


    // ==================================
    // BACA RESPONSE
    // ==================================

    const data =
      await response.json()


    // ==================================
    // CEK ERROR API
    // ==================================

    if (!response.ok) {

      throw new Error(
        data.message ||
        'Gagal menyimpan jadwal'
      )

    }


    // ==================================
    // TOAST BERHASIL
    // ==================================

    const toast =
      await toastController.create({

        message:
          'Jadwal berhasil ditambahkan.',

        duration:
          1500,

        position:
          'bottom'

      })


    await toast.present()


    // ==================================
    // JADWALKAN NOTIFIKASI
    // ==================================

    let permStatus = await LocalNotifications.checkPermissions()
    if (permStatus.display !== 'granted') {
      permStatus = await LocalNotifications.requestPermissions()
    }

    if (permStatus.display === 'granted') {
      const scheduleDate = new Date(form.nextDate)
      scheduleDate.setHours(8, 0, 0, 0) // Notifikasi muncul jam 8 pagi
      
      if (scheduleDate.getTime() > new Date().getTime()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: 'Pengingat Perawatan 🛠️',
              body: `Waktunya: ${form.task.trim()} untuk ${selectedItem.name}.`,
              id: data.id || Math.floor(Math.random() * 100000),
              schedule: { at: scheduleDate },
            }
          ]
        })
      }
    }


    // ==================================
    // KEMBALI
    // ==================================

    router.replace({
  path: '/maintenance',
  query: {
    refresh: Date.now().toString()
  }
})


  } catch (error) {

    console.error(
      'Gagal menyimpan jadwal:',
      error
    )


    const message =
      error instanceof Error
        ? error.message
        : 'Gagal menyimpan jadwal.'


    const toast =
      await toastController.create({

        message:
          message,

        duration:
          3000,

        position:
          'bottom'

      })


    await toast.present()


  } finally {

    isSaving.value =
      false

  }

}


// ========================================
// BATAL
// ========================================

const batal = () => {

  router.push(
    '/maintenance'
  )

}


// ========================================
// LOAD DATA SAAT HALAMAN DIBUKA
// ========================================

onMounted(() => {

  loadItems()

})

</script>


<style scoped>

/* ========================================
   WARNA UTAMA
======================================== */

.maintenance-form-page {

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

.form-header {

  box-shadow:
    0 2px 10px
    rgba(62, 143, 195, 0.06);

}


.form-header ion-toolbar {

  --background:
    #ffffff;

  --color:
    var(--homecare-text);

  --border-width:
    0;

  --min-height:
    57px;

}


.form-header ion-title {

  font-size:
    20px;

  font-weight:
    750;

  letter-spacing:
    -0.3px;

}


.form-header ion-back-button {

  --color:
    var(--homecare-blue-dark);

}


/* ========================================
   CONTENT
======================================== */

.form-content {

  --background:
    var(--homecare-background);

}


.form-container {

  width:
    100%;

  max-width:
    700px;

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
    center;

  gap:
    12px;

  margin-bottom:
    17px;

}


.intro-icon {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-shrink:
    0;

  width:
    47px;

  height:
    47px;

  border-radius:
    14px;

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

  font-size:
    22px;

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
    24px;

  line-height:
    1.15;

  font-weight:
    800;

  letter-spacing:
    -0.5px;

}


.intro-description {

  margin:
    5px 0 0;

  color:
    var(--homecare-muted);

  font-size:
    10px;

  line-height:
    1.45;

}


/* ========================================
   FORM CARD
======================================== */

.form-card {

  overflow:
    hidden;

  border:
    1px solid #e2edf3;

  border-radius:
    16px;

  background:
    #ffffff;

  box-shadow:
    0 4px 14px
    rgba(62, 143, 195, 0.055);

}


/* ========================================
   FIELD GROUP
======================================== */

.field-group {

  padding:
    14px;

}


.field-group + .field-group {

  border-top:
    1px solid #edf3f6;

}


/* ========================================
   FIELD LABEL
======================================== */

.field-label {

  display:
    flex;

  align-items:
    center;

  gap:
    9px;

  margin-bottom:
    9px;

}


.field-icon {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex-shrink:
    0;

  width:
    32px;

  height:
    32px;

  border-radius:
    9px;

  font-size:
    15px;

}


.field-icon.blue {

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

}


.field-icon.green {

  background:
    #e9f7f1;

  color:
    #4d9a7e;

}


.field-icon.purple {

  background:
    #f1edfb;

  color:
    #806bb2;

}


.field-icon.orange {

  background:
    #fff2e5;

  color:
    #c98242;

}


.field-icon.gray {

  background:
    #eef2f4;

  color:
    #71808b;

}


.field-label strong {

  display:
    block;

  color:
    var(--homecare-text);

  font-size:
    11px;

  font-weight:
    750;

}


.field-label span {

  display:
    block;

  margin-top:
    2px;

  color:
    var(--homecare-muted);

  font-size:
    8px;

}


/* ========================================
   ION SELECT
======================================== */

.custom-select {

  width:
    100%;

  min-height:
    43px;

  padding:
    0 10px;

  border:
    1px solid #dce8ee;

  border-radius:
    10px;

  --background:
    #f8fbfd;

  --color:
    var(--homecare-text);

  --placeholder-color:
    #9aa7af;

  --placeholder-opacity:
    1;

  font-size:
    11px;

}


.custom-select::part(container) {

  padding:
    0;

}


/* ========================================
   ION INPUT
======================================== */

.custom-input {

  min-height:
    43px;

  padding:
    0 10px;

  border:
    1px solid #dce8ee;

  border-radius:
    10px;

  --background:
    #f8fbfd;

  --color:
    var(--homecare-text);

  --placeholder-color:
    #9aa7af;

  --placeholder-opacity:
    1;

  font-size:
    11px;

}


/* ========================================
   ION TEXTAREA
======================================== */

.custom-textarea {

  min-height:
    70px;

  padding:
    8px 10px;

  border:
    1px solid #dce8ee;

  border-radius:
    10px;

  --background:
    #f8fbfd;

  --color:
    var(--homecare-text);

  --placeholder-color:
    #9aa7af;

  --placeholder-opacity:
    1;

  font-size:
    11px;

}


/* ========================================
   FOCUS
======================================== */

.custom-input:focus-within,
.custom-select:focus-within,
.custom-textarea:focus-within {

  border-color:
    var(--homecare-blue);

}


/* ========================================
   ACTION
======================================== */

.action-section {

  display:
    flex;

  flex-direction:
    column;

  gap:
    9px;

  margin-top:
    16px;

}


.save-button {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    7px;

  width:
    100%;

  height:
    44px;

  border:
    0;

  border-radius:
    12px;

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
    0 4px 12px
    rgba(63, 143, 195, 0.18);

}


.save-button ion-icon {

  font-size:
    17px;

}


.save-button:disabled {

  opacity:
    0.6;

}


.cancel-button {

  width:
    100%;

  height:
    39px;

  border:
    1px solid #dce8ee;

  border-radius:
    11px;

  background:
    #ffffff;

  color:
    var(--homecare-muted);

  font-family:
    inherit;

  font-size:
    10px;

  font-weight:
    700;

}


.cancel-button:disabled {

  opacity:
    0.6;

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

  .form-container {

    padding:
      17px 13px 120px;

  }


  .page-intro h1 {

    font-size:
      22px;

  }


  .intro-icon {

    width:
      44px;

    height:
      44px;

    font-size:
      21px;

  }


  .field-group {

    padding:
      13px;

  }

}


@media (max-width: 360px) {

  .form-container {

    padding-left:
      10px;

    padding-right:
      10px;

  }


  .page-intro {

    gap:
      9px;

  }


  .page-intro h1 {

    font-size:
      20px;

  }


  .intro-description {

    font-size:
      9px;

  }


  .field-label span {

    font-size:
      7px;

  }

}

</style>