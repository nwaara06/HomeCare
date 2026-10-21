<template>
  <ion-page class="item-form-page">

    <!-- HEADER -->

    <ion-header class="form-header">

      <ion-toolbar>

        <ion-buttons slot="start">

          <ion-back-button
            default-href="/inventory"
          />

        </ion-buttons>

        <ion-title>
          {{ isEditMode ? 'Edit Barang' : 'Tambah Barang' }}
        </ion-title>

      </ion-toolbar>

    </ion-header>


    <!-- CONTENT -->

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
              :icon="isEditMode ? createOutline : cubeOutline"
            />

          </div>

          <div>

            <p class="section-small">
              INVENTARIS
            </p>

            <h1>
              {{ isEditMode ? 'Edit Barang' : 'Tambah Barang' }}
            </h1>

            <p class="intro-description">
              {{
                isEditMode
                  ? 'Ubah informasi barang yang sudah tersimpan.'
                  : 'Masukkan informasi barang yang ada di rumah.'
              }}
            </p>

          </div>

        </section>


        <!-- =================================
             FORM CARD
        ================================== -->

        <section class="form-card">


          <!-- NAMA BARANG -->

          <div class="field-group">

            <div class="field-label">

              <div class="field-icon blue">

                <ion-icon
                  :icon="cubeOutline"
                />

              </div>

              <div>

                <strong>
                  Nama Barang
                </strong>

                <span>
                  Beri nama barang yang mudah dikenali
                </span>

              </div>

            </div>


            <ion-input
              v-model="form.name"
              class="custom-input"
              placeholder="Contoh: AC Samsung"
            />

          </div>


          <!-- KATEGORI -->

          <div class="field-group">

            <div class="field-label">

              <div class="field-icon purple">

                <ion-icon
                  :icon="pricetagOutline"
                />

              </div>

              <div>

                <strong>
                  Kategori
                </strong>

                <span>
                  Pilih kategori barang
                </span>

              </div>

            </div>


            <ion-select
              v-model="form.category"
              class="custom-select"
              interface="action-sheet"
              placeholder="Pilih kategori"
            >

              <ion-select-option value="Elektronik">
                Elektronik
              </ion-select-option>

              <ion-select-option value="Furniture">
                Furniture
              </ion-select-option>

              <ion-select-option value="Dapur">
                Dapur
              </ion-select-option>

              <ion-select-option value="Kendaraan">
                Kendaraan
              </ion-select-option>

              <ion-select-option value="Lainnya">
                Lainnya
              </ion-select-option>

            </ion-select>

          </div>


          <!-- LOKASI -->

          <div class="field-group">

            <div class="field-label">

              <div class="field-icon green">

                <ion-icon
                  :icon="locationOutline"
                />

              </div>

              <div>

                <strong>
                  Lokasi
                </strong>

                <span>
                  Di mana barang berada?
                </span>

              </div>

            </div>


            <ion-input
              v-model="form.location"
              class="custom-input"
              placeholder="Contoh: Ruang Tamu"
            />

          </div>


          <!-- TANGGAL PEMBELIAN -->

          <div class="field-group">

            <div class="field-label">

              <div class="field-icon orange">

                <ion-icon
                  :icon="calendarOutline"
                />

              </div>

              <div>

                <strong>
                  Tanggal Pembelian
                </strong>

                <span>
                  Kapan barang dibeli?
                </span>

              </div>

            </div>


            <ion-input
              v-model="form.purchaseDate"
              class="custom-input"
              type="date"
            />

          </div>


          <!-- CATATAN -->

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
                  Informasi tambahan jika diperlukan
                </span>

              </div>

            </div>


            <ion-textarea
              v-model="form.notes"
              class="custom-textarea"
              placeholder="Tambahkan catatan jika diperlukan..."
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
            @click="simpanBarang"
          >

            <ion-icon
              :icon="checkmarkCircleOutline"
            />

            <span>
              {{
                isSaving
                  ? 'Menyimpan...'
                  : (
                    isEditMode
                      ? 'Simpan Perubahan'
                      : 'Simpan Barang'
                  )
              }}
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
  useRoute,
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
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonIcon,
  toastController
} from '@ionic/vue'

import {
  cubeOutline,
  createOutline,
  pricetagOutline,
  locationOutline,
  calendarOutline,
  documentTextOutline,
  checkmarkCircleOutline
} from 'ionicons/icons'

import {
  API_BASE_URL
} from '@/config/api'


// ========================================
// ROUTER
// ========================================

const router =
  useRouter()

const route =
  useRoute()


// ========================================
// CEK MODE EDIT
// ========================================

const isEditMode =
  ref(
    route.path.startsWith(
      '/inventory/edit/'
    )
  )


const editId =
  Number(
    route.params.id
  )


// ========================================
// STATUS
// ========================================

const isSaving =
  ref(false)


// ========================================
// FORM
// ========================================

const form = reactive({

  name: '',

  category: '',

  location: '',

  purchaseDate: '',

  notes: ''

})


// ========================================
// NORMALISASI TANGGAL
// ========================================

const normalizeDate = (
  value: any
) => {

  if (!value) {
    return ''
  }

  const text =
    String(value)

  /*
   * Jika API mengirim:
   * 2025-06-15T00:00:00.000Z
   *
   * kita ambil:
   * 2025-06-15
   */

  if (
    /^\d{4}-\d{2}-\d{2}/.test(text)
  ) {

    return text.substring(
      0,
      10
    )

  }

  return ''

}


// ========================================
// TOAST
// ========================================

const showToast =
  async (
    message: string
  ) => {

    const toast =
      await toastController.create({

        message,

        duration:
          1800,

        position:
          'bottom'

      })

    await toast.present()

  }


// ========================================
// LOAD DATA EDIT
// ========================================

const loadItem =
  async () => {

    if (
      !isEditMode.value
    ) {

      return

    }


    try {

      const response =
        await fetch(
          `${API_BASE_URL}/items/${editId}`
        )


      if (!response.ok) {

        throw new Error(
          'Barang tidak ditemukan'
        )

      }


      const item =
        await response.json()


      form.name =
        item.name || ''


      form.category =
        item.category || ''


      form.location =
        item.location || ''


      form.purchaseDate =
        normalizeDate(
          item.purchase_date
        )


      form.notes =
        item.notes || ''


    } catch (error) {

      console.error(
        'Gagal mengambil data barang:',
        error
      )


      await showToast(
        'Gagal mengambil data barang.'
      )


      router.push(
        '/inventory'
      )

    }

  }


// ========================================
// LOAD SAAT HALAMAN DIBUKA
// ========================================

onMounted(() => {

  loadItem()

})


// ========================================
// SIMPAN BARANG
// ========================================

const simpanBarang =
  async () => {

    // ====================================
    // VALIDASI
    // ====================================

    if (
      !form.name.trim() ||
      !form.category ||
      !form.location.trim()
    ) {

      await showToast(
        'Nama, kategori, dan lokasi wajib diisi.'
      )

      return

    }


    // ====================================
    // CEGAH DOUBLE CLICK
    // ====================================

    if (
      isSaving.value
    ) {

      return

    }


    isSaving.value =
      true


    try {

      // ==================================
      // DATA UNTUK API
      // ==================================

      const payload = {

        name:
          form.name.trim(),

        category:
          form.category,

        location:
          form.location.trim(),

        purchase_date:
          form.purchaseDate || null,

        notes:
          form.notes.trim() || null

      }


      // ==================================
      // MODE EDIT
      // ==================================

      if (
        isEditMode.value
      ) {

        const response =
          await fetch(
            `${API_BASE_URL}/items/${editId}`,
            {
              method:
                'PUT',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify(
                  payload
                )
            }
          )


        if (!response.ok) {

          let errorMessage =
            'Gagal mengubah barang.'


          try {

            const errorData =
              await response.json()

            if (
              errorData.message
            ) {

              errorMessage =
                errorData.message

            }

          } catch {
            // Abaikan jika response bukan JSON
          }


          throw new Error(
            errorMessage
          )

        }


        await showToast(
  'Perubahan berhasil disimpan.'
)


router.replace({
  path: '/inventory',
  query: {
    refresh: Date.now().toString()
  }
})


return

      }


      // ==================================
      // MODE TAMBAH
      // ==================================

      const response =
        await fetch(
          `${API_BASE_URL}/items`,
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify(
                payload
              )
          }
        )


      if (!response.ok) {

        let errorMessage =
          'Gagal menambahkan barang.'


        try {

          const errorData =
            await response.json()

          if (
            errorData.message
          ) {

            errorMessage =
              errorData.message

          }

        } catch {
          // Abaikan jika response bukan JSON
        }


        throw new Error(
          errorMessage
        )

      }


      const data =
        await response.json()


      console.log(
        'Barang berhasil ditambahkan:',
        data
      )


      await showToast(
        'Barang berhasil ditambahkan.'
      )


      // ==================================
      // KEMBALI KE INVENTARIS
      // ==================================

      router.push(
        '/inventory'
      )


    } catch (error) {

      console.error(
        'Gagal menyimpan barang:',
        error
      )


      await showToast(
        error instanceof Error
          ? error.message
          : 'Gagal menyimpan barang.'
      )


    } finally {

      isSaving.value =
        false

    }

  }


// ========================================
// BATAL
// ========================================

const batal = () => {

  if (
    isSaving.value
  ) {

    return

  }


  if (
    isEditMode.value
  ) {

    router.push(
      `/inventory/${editId}`
    )

  } else {

    router.push(
      '/inventory'
    )

  }

}

</script>


<style scoped>

/* ========================================
   WARNA
======================================== */

.item-form-page {

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

.form-header ion-toolbar {

  --background:
    #ffffff;

  --color:
    var(--homecare-text);

  --border-width:
    0;

  --min-height:
    57px;

  box-shadow:
    0 2px 10px
    rgba(62, 143, 195, 0.06);

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
   FIELD
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
   LABEL
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


.field-icon.purple {

  background:
    #f1edfb;

  color:
    #806bb2;

}


.field-icon.green {

  background:
    #e9f7f1;

  color:
    #4d9a7e;

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
   INPUT
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
   SELECT
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


/* ========================================
   TEXTAREA
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


.save-button:disabled {

  opacity:
    0.65;

  cursor:
    not-allowed;

}


.save-button ion-icon {

  font-size:
    17px;

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
    0.65;

  cursor:
    not-allowed;

}


/* ========================================
   BOTTOM
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