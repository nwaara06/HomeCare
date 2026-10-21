<template>
  <ion-page class="item-detail-page">

    <!-- HEADER -->

    <ion-header class="detail-header">

      <ion-toolbar>

        <ion-buttons slot="start">

          <ion-back-button
            default-href="/inventory"
          />

        </ion-buttons>

        <ion-title>
          Detail Barang
        </ion-title>

      </ion-toolbar>

    </ion-header>


    <!-- CONTENT -->

    <ion-content
      :fullscreen="true"
      class="detail-content"
    >

      <!-- =================================
           DATA BARANG
      ================================== -->

      <div
        v-if="item"
        class="detail-container"
      >

        <!-- HERO -->

        <section class="hero-section">

          <div class="item-icon">

            <ion-icon
              :icon="homeOutline"
            />

          </div>

          <div class="category-badge">
            {{ item.category }}
          </div>

          <h1>
            {{ item.name }}
          </h1>

          <p>
            Informasi lengkap barang di rumah
          </p>

        </section>


        <!-- =================================
             INFORMASI BARANG
        ================================== -->

        <section class="info-card">

          <div class="card-heading">

            <div class="heading-icon">

              <ion-icon
                :icon="informationCircleOutline"
              />

            </div>

            <div>

              <span>
                DETAIL
              </span>

              <h2>
                Informasi Barang
              </h2>

            </div>

          </div>


          <!-- NAMA -->

          <div class="info-row">

            <div class="info-left">

              <div class="row-icon blue">

                <ion-icon
                  :icon="cubeOutline"
                />

              </div>

              <span>
                Nama Barang
              </span>

            </div>

            <strong>
              {{ item.name }}
            </strong>

          </div>


          <!-- KATEGORI -->

          <div class="info-row">

            <div class="info-left">

              <div class="row-icon purple">

                <ion-icon
                  :icon="pricetagOutline"
                />

              </div>

              <span>
                Kategori
              </span>

            </div>

            <strong>
              {{ item.category }}
            </strong>

          </div>


          <!-- LOKASI -->

          <div class="info-row">

            <div class="info-left">

              <div class="row-icon green">

                <ion-icon
                  :icon="locationOutline"
                />

              </div>

              <span>
                Lokasi
              </span>

            </div>

            <strong>
              {{ item.location }}
            </strong>

          </div>


          <!-- TANGGAL PEMBELIAN -->

          <div class="info-row">

            <div class="info-left">

              <div class="row-icon orange">

                <ion-icon
                  :icon="calendarOutline"
                />

              </div>

              <span>
                Tanggal Pembelian
              </span>

            </div>

            <strong>
              {{ item.purchaseDate || '-' }}
            </strong>

          </div>


          <!-- CATATAN -->

          <div class="info-row notes-row">

            <div class="info-left">

              <div class="row-icon gray">

                <ion-icon
                  :icon="documentTextOutline"
                />

              </div>

              <span>
                Catatan
              </span>

            </div>

            <strong>
              {{ item.notes || '-' }}
            </strong>

          </div>

        </section>


        <!-- =================================
             ACTION
        ================================== -->

        <section class="action-section">

          <button
            class="edit-button"
            type="button"
            @click="editBarang"
          >

            <ion-icon
              :icon="createOutline"
            />

            <span>
              Edit Barang
            </span>

          </button>


          <button
            class="delete-button"
            type="button"
            @click="hapusBarang"
          >

            <ion-icon
              :icon="trashOutline"
            />

            <span>
              Hapus Barang
            </span>

          </button>

        </section>


        <div class="bottom-space"></div>

      </div>


      <!-- =================================
           EMPTY STATE
      ================================== -->

      <div
        v-else
        class="empty-state"
      >

        <div class="empty-icon">

          <ion-icon
            :icon="helpCircleOutline"
          />

        </div>

        <h2>
          Barang tidak ditemukan
        </h2>

        <p>
          Data barang yang kamu cari
          tidak tersedia.
        </p>

        <button
          class="back-button"
          type="button"
          @click="kembali"
        >

          <ion-icon
            :icon="arrowBackOutline"
          />

          Kembali ke Inventaris

        </button>

      </div>

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import { onMounted, ref } from 'vue'

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
  IonIcon,
  alertController
} from '@ionic/vue'

import {
  homeOutline,
  informationCircleOutline,
  cubeOutline,
  pricetagOutline,
  locationOutline,
  calendarOutline,
  documentTextOutline,
  createOutline,
  trashOutline,
  helpCircleOutline,
  arrowBackOutline
} from 'ionicons/icons'

import {
  API_BASE_URL
} from '@/config/api'


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


// ========================================
// ROUTER
// ========================================

const route = useRoute()
const router = useRouter()


// ========================================
// AMBIL ID
// ========================================

const itemId = Number(route.params.id)


// ========================================
// DATA BARANG
// ========================================

const item = ref<Item | undefined>(undefined)


// ========================================
// AMBIL DATA DARI API
// ========================================

const loadItem = async () => {

  if (!itemId) {
    item.value = undefined
    return
  }

  try {

    const response = await fetch(
      `${API_BASE_URL}/items/${itemId}`
    )

    if (!response.ok) {

      if (response.status === 404) {
        item.value = undefined
        return
      }

      throw new Error('Gagal mengambil detail barang')
    }

    const data = await response.json()

    item.value = {
      id: data.id,
      name: data.name,
      category: data.category,
      location: data.location,
      purchaseDate: data.purchase_date
        ? String(data.purchase_date).slice(0, 10)
        : '',
      notes: data.notes || ''
    }

  } catch (error) {

    console.error(
      'Gagal mengambil detail barang:',
      error
    )

    item.value = undefined
  }
}


// ========================================
// EDIT BARANG
// ========================================

const editBarang = () => {

  if (!item.value) {
    return
  }

  router.push(
    `/inventory/edit/${item.value.id}`
  )
}


// ========================================
// HAPUS BARANG DARI API
// ========================================

const hapusBarangDariApi = async () => {

  if (!item.value) {
    return
  }

  try {

    const response = await fetch(
      `${API_BASE_URL}/items/${item.value.id}`,
      {
        method: 'DELETE'
      }
    )

    let result: any = null

    try {
      result = await response.json()
    } catch {
      result = null
    }

    if (!response.ok) {
      throw new Error(
        result?.message || 'Gagal menghapus barang'
      )
    }

    router.push('/inventory')

  } catch (error) {

    console.error(
      'Gagal menghapus barang:',
      error
    )

    const alert = await alertController.create({
      header: 'Gagal Menghapus',
      message:
        error instanceof Error
          ? error.message
          : 'Gagal menghapus barang.',
      buttons: ['OK']
    })

    await alert.present()
  }
}


// ========================================
// KONFIRMASI HAPUS
// ========================================

const hapusBarang = async () => {

  if (!item.value) {
    return
  }

  const alert = await alertController.create({

    header: 'Hapus Barang?',

    message:
      `Apakah kamu yakin ingin menghapus "${item.value.name}"?`,

    buttons: [

      {
        text: 'Batal',
        role: 'cancel'
      },

      {
        text: 'Hapus',
        role: 'destructive',
        handler: () => {
          void hapusBarangDariApi()
        }
      }

    ]
  })

  await alert.present()
}


// ========================================
// KEMBALI
// ========================================

const kembali = () => {

  router.push('/inventory')
}


// ========================================
// SAAT HALAMAN DIBUKA
// ========================================

onMounted(() => {
  loadItem()
})

</script>


<style scoped>

.item-detail-page {

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


.detail-header ion-toolbar {

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


.hero-section {

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  text-align:
    center;

  padding:
    8px 0 20px;

}


.item-icon {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  width:
    68px;

  height:
    68px;

  margin-bottom:
    10px;

  border-radius:
    20px;

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

  font-size:
    34px;

  box-shadow:
    0 5px 14px
    rgba(63, 143, 195, 0.08);

}


.category-badge {

  display:
    inline-flex;

  align-items:
    center;

  padding:
    5px 10px;

  margin-bottom:
    7px;

  border-radius:
    20px;

  background:
    #eaf5fb;

  color:
    var(--homecare-blue-dark);

  font-size:
    9px;

  font-weight:
    750;

}


.hero-section h1 {

  margin:
    0;

  color:
    var(--homecare-text);

  font-size:
    25px;

  line-height:
    1.2;

  font-weight:
    800;

  letter-spacing:
    -0.5px;

}


.hero-section p {

  margin:
    6px 0 0;

  color:
    var(--homecare-muted);

  font-size:
    10px;

}


.info-card {

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


.card-heading {

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

  padding:
    15px;

  border-bottom:
    1px solid #edf3f6;

}


.heading-icon {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  width:
    34px;

  height:
    34px;

  border-radius:
    10px;

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

  font-size:
    17px;

}


.card-heading span {

  display:
    block;

  margin-bottom:
    2px;

  color:
    var(--homecare-blue-dark);

  font-size:
    8px;

  font-weight:
    800;

  letter-spacing:
    1px;

}


.card-heading h2 {

  margin:
    0;

  color:
    var(--homecare-text);

  font-size:
    14px;

  font-weight:
    750;

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

  min-height:
    54px;

  padding:
    10px 15px;

  border-bottom:
    1px solid #edf3f6;

}


.info-row:last-child {

  border-bottom:
    none;

}


.info-left {

  display:
    flex;

  align-items:
    center;

  gap:
    9px;

  min-width:
    0;

}


.info-left > span {

  color:
    var(--homecare-muted);

  font-size:
    10px;

}


.info-row strong {

  max-width:
    55%;

  color:
    var(--homecare-text);

  font-size:
    10px;

  font-weight:
    700;

  text-align:
    right;

  overflow-wrap:
    anywhere;

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
    8px;

  font-size:
    14px;

}


.row-icon.blue {

  background:
    #e8f4fb;

  color:
    var(--homecare-blue-dark);

}


.row-icon.purple {

  background:
    #f1edfb;

  color:
    #806bb2;

}


.row-icon.green {

  background:
    #e9f7f1;

  color:
    #4d9a7e;

}


.row-icon.orange {

  background:
    #fff2e5;

  color:
    #c98242;

}


.row-icon.gray {

  background:
    #eef2f4;

  color:
    #71808b;

}


.notes-row {

  align-items:
    flex-start;

  padding-top:
    13px;

  padding-bottom:
    13px;

}


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


.edit-button {

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


.edit-button ion-icon {

  font-size:
    16px;

}


.delete-button {

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
    39px;

  border:
    1px solid #eddada;

  border-radius:
    11px;

  background:
    #ffffff;

  color:
    #b85c5c;

  font-family:
    inherit;

  font-size:
    10px;

  font-weight:
    700;

}


.delete-button ion-icon {

  font-size:
    15px;

}


.empty-state {

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  min-height:
    70vh;

  padding:
    30px 20px;

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
    64px;

  height:
    64px;

  margin-bottom:
    15px;

  border-radius:
    18px;

  background:
    #edf3f6;

  color:
    #8a99a3;

  font-size:
    32px;

}


.empty-state h2 {

  margin:
    0;

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
    7px 0 18px;

  color:
    var(--homecare-muted);

  font-size:
    10px;

  line-height:
    1.5;

}


.back-button {

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  gap:
    7px;

  min-width:
    180px;

  height:
    40px;

  padding:
    0 16px;

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


  .hero-section h1 {

    font-size:
      22px;

  }


  .item-icon {

    width:
      62px;

    height:
      62px;

    font-size:
      31px;

  }

}


@media (max-width: 360px) {

  .detail-container {

    padding-left:
      10px;

    padding-right:
      10px;

  }


  .info-row {

    gap:
      8px;

    padding-left:
      12px;

    padding-right:
      12px;

  }


  .info-left > span {

    font-size:
      9px;

  }


  .info-row strong {

    font-size:
      9px;

  }

}

</style>