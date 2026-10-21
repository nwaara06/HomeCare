<template>
  <ion-page class="inventory-page">

    <!-- HEADER -->
    <ion-header class="inventory-header">
      <ion-toolbar>
        <ion-title>Inventaris</ion-title>
      </ion-toolbar>
    </ion-header>


    <!-- CONTENT -->
    <ion-content
      :fullscreen="true"
      class="inventory-content"
    >

      <div class="inventory-container">

        <!-- =====================================
             PAGE INTRO
        ====================================== -->

        <section class="page-intro">

          <div class="intro-text">
            <span class="intro-label">
              RUMAH
            </span>

            <h1>
              Barang Saya
            </h1>

            <p>
              Kelola barang rumah dengan mudah.
            </p>
          </div>

          <button
            class="add-button"
            @click="tambahBarang"
          >
            <ion-icon :icon="addOutline" />
            <span>Tambah</span>
          </button>

        </section>


        <!-- =====================================
             SEARCH
        ====================================== -->

        <div class="search-box">

          <ion-icon
            :icon="searchOutline"
            class="search-icon"
          />

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari barang..."
            class="search-input"
          />

          <button
            v-if="searchQuery"
            class="clear-button"
            @click="searchQuery = ''"
          >
            <ion-icon :icon="closeCircle" />
          </button>

        </div>


        <!-- =====================================
             SUMMARY
        ====================================== -->

        <section class="summary-row">

          <div class="summary-main">

            <strong>
              {{ filteredItems.length }}
            </strong>

            <span>
              barang
            </span>

          </div>

          <div class="summary-category">

            <div class="category-summary-icon">
              <ion-icon :icon="cubeOutline" />
            </div>

            <div>
              <strong>
                {{ categoryCount }}
              </strong>

              <span>
                kategori
              </span>
            </div>

          </div>

        </section>


        <!-- =====================================
             SEARCH EMPTY
        ====================================== -->

        <section
          v-if="
            items.length > 0 &&
            filteredItems.length === 0
          "
          class="empty-state"
        >

          <div class="empty-icon">
            <ion-icon :icon="searchOutline" />
          </div>

          <h2>
            Barang tidak ditemukan
          </h2>

          <p>
            Coba gunakan kata kunci pencarian
            yang berbeda.
          </p>

          <button
            class="secondary-button"
            @click="searchQuery = ''"
          >
            Tampilkan Semua
          </button>

        </section>


        <!-- =====================================
             NO ITEMS
        ====================================== -->

        <section
          v-else-if="items.length === 0"
          class="empty-state"
        >

          <div class="empty-icon">
            <ion-icon :icon="cubeOutline" />
          </div>

          <h2>
            Belum ada barang
          </h2>

          <p>
            Tambahkan barang rumah kamu
            agar mudah dipantau.
          </p>

          <button
            class="primary-button"
            @click="tambahBarang"
          >
            <ion-icon :icon="addOutline" />
            Tambah Barang
          </button>

        </section>


        <!-- =====================================
             ITEM LIST
        ====================================== -->

        <div
          v-else
          class="item-list"
        >

          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="item-card"
            @click="lihatDetail(item.id)"
          >

            <!-- MAIN ITEM -->

            <div class="item-main">

              <div
                class="item-icon"
                :class="getCategoryClass(item.category)"
              >

                <ion-icon
                  :icon="getCategoryIcon(item.category)"
                />

              </div>


              <div class="item-info">

                <h2>
                  {{ item.name }}
                </h2>

                <span class="item-category">
                  {{ item.category }}
                </span>

                <div class="item-location">

                  <ion-icon
                    :icon="locationOutline"
                  />

                  <span>
                    {{ item.location }}
                  </span>

                </div>

              </div>


              <div class="item-arrow">

                <ion-icon
                  :icon="chevronForwardOutline"
                />

              </div>

            </div>


            <!-- EXTRA INFORMATION -->

            <div
              v-if="
                item.purchaseDate ||
                item.notes
              "
              class="item-extra"
            >

              <div
                v-if="item.purchaseDate"
                class="extra-info"
              >

                <ion-icon
                  :icon="calendarOutline"
                />

                <span>
                  {{ formatDate(item.purchaseDate) }}
                </span>

              </div>


              <div
                v-if="item.notes"
                class="extra-info notes"
              >

                <ion-icon
                  :icon="documentTextOutline"
                />

                <span>
                  {{ item.notes }}
                </span>

              </div>

            </div>

          </div>

        </div>


        <!-- BOTTOM SPACE -->

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
  IonIcon,
  onIonViewWillEnter
} from '@ionic/vue'

import {
  addOutline,
  searchOutline,
  closeCircle,
  cubeOutline,
  locationOutline,
  calendarOutline,
  documentTextOutline,
  chevronForwardOutline,
  homeOutline,
  tvOutline,
  waterOutline,
  constructOutline
} from 'ionicons/icons'

import {
  API_BASE_URL
} from '@/config/api'


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


// ========================================
// SEARCH
// ========================================

const searchQuery = ref('')


// ========================================
// DATA INVENTARIS
// ========================================

const items = ref<Item[]>([])


// ========================================
// LOAD DATA DARI API
// ========================================

const loadItems = async () => {

  try {

    const response = await fetch(
      `${API_BASE_URL}/items`
    )


    if (!response.ok) {

      throw new Error(
        'Gagal mengambil data inventaris'
      )

    }


    const data = await response.json()


    /*
     * Data dari API menggunakan:
     *
     * purchase_date
     *
     * sedangkan Vue menggunakan:
     *
     * purchaseDate
     *
     * Jadi kita sesuaikan terlebih dahulu.
     */

    items.value = data.map(
      (item: any) => ({

        id: item.id,

        name: item.name,

        category: item.category,

        location: item.location,

        purchaseDate:
          item.purchase_date,

        notes:
          item.notes

      })
    )


  } catch (error) {

    console.error(
      'Gagal mengambil data inventaris:',
      error
    )

  }

}


// ========================================
// LOAD SAAT HALAMAN DIBUKA
// ========================================

onMounted(() => {

  loadItems()

})


// ========================================
// LOAD SETIAP KALI HALAMAN AKTIF KEMBALI
// ========================================

onIonViewWillEnter(() => {

  loadItems()

})


// ========================================
// FILTER BARANG
// ========================================

const filteredItems = computed(() => {

  const keyword =
    searchQuery.value
      .toLowerCase()
      .trim()


  if (!keyword) {

    return items.value

  }


  return items.value.filter(
    item => {

      return (

        item.name
          .toLowerCase()
          .includes(keyword)

        ||

        item.category
          .toLowerCase()
          .includes(keyword)

        ||

        item.location
          .toLowerCase()
          .includes(keyword)

        ||

        (item.notes || '')
          .toLowerCase()
          .includes(keyword)

      )

    }
  )

})


// ========================================
// JUMLAH KATEGORI
// ========================================

const categoryCount = computed(() => {

  const categories =
    new Set(
      items.value.map(
        item => item.category
      )
    )


  return categories.size

})


// ========================================
// TAMBAH BARANG
// ========================================

const tambahBarang = () => {

  router.push(
    '/inventory/add'
  )

}


// ========================================
// DETAIL BARANG
// ========================================

const lihatDetail = (
  id: number
) => {

  router.push(
    `/inventory/${id}`
  )

}


// ========================================
// FORMAT TANGGAL
// ========================================

const formatDate = (
  dateString: string
) => {

  if (!dateString) {

    return ''

  }


  const date =
    new Date(dateString)


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return dateString

  }


  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`

}


// ========================================
// ICON KATEGORI
// ========================================

const getCategoryIcon = (
  category: string
) => {

  const value =
    category.toLowerCase()


  if (
    value.includes('elektronik')
  ) {

    return tvOutline

  }


  if (
    value.includes('dapur')
  ) {

    return waterOutline

  }


  if (
    value.includes('rumah')
  ) {

    return homeOutline

  }


  if (
    value.includes('peralatan')
  ) {

    return constructOutline

  }


  return cubeOutline

}


// ========================================
// CLASS KATEGORI
// ========================================

const getCategoryClass = (
  category: string
) => {

  const value =
    category.toLowerCase()


  if (
    value.includes('elektronik')
  ) {

    return 'category-blue'

  }


  if (
    value.includes('dapur')
  ) {

    return 'category-green'

  }


  if (
    value.includes('rumah')
  ) {

    return 'category-purple'

  }


  if (
    value.includes('peralatan')
  ) {

    return 'category-orange'

  }


  return 'category-default'

}

</script>


<style scoped>

/* ========================================
   WARNA UTAMA
======================================== */

.inventory-page {

  --homecare-blue: #63a9d5;

  --homecare-blue-dark: #3f8fc3;

  --homecare-background: #f5f9fc;

  --homecare-text: #263746;

  --homecare-muted: #7b8994;

}


/* ========================================
   HEADER
======================================== */

.inventory-header {

  box-shadow:
    0 2px 10px
    rgba(62, 143, 195, 0.05);

}


.inventory-header ion-toolbar {

  --background: #ffffff;

  --color:
    var(--homecare-text);

  --border-width: 0;

  --min-height: 56px;

}


.inventory-header ion-title {

  font-size: 19px;

  font-weight: 750;

  letter-spacing: -0.3px;

}


/* ========================================
   CONTENT
======================================== */

.inventory-content {

  --background:
    var(--homecare-background);

}


.inventory-container {

  width: 100%;

  max-width: 900px;

  margin: 0 auto;

  padding:
    18px 15px 120px;

}


/* ========================================
   INTRO
======================================== */

.page-intro {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  margin-bottom: 16px;

}


.intro-text {

  min-width: 0;

}


.intro-label {

  display: block;

  margin-bottom: 3px;

  color:
    var(--homecare-blue-dark);

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1px;

}


.page-intro h1 {

  margin: 0;

  color:
    var(--homecare-text);

  font-size: 24px;

  line-height: 1.15;

  font-weight: 800;

  letter-spacing: -0.5px;

}


.intro-text p {

  margin:
    5px 0 0;

  color:
    var(--homecare-muted);

  font-size: 10px;

}


/* ========================================
   TAMBAH
======================================== */

.add-button {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

  flex-shrink: 0;

  height: 36px;

  padding: 0 12px;

  border: 0;

  border-radius: 11px;

  background:
    var(--homecare-blue);

  color: #ffffff;

  font-family: inherit;

  font-size: 10px;

  font-weight: 750;

  box-shadow:
    0 4px 10px
    rgba(63, 143, 195, 0.16);

}


.add-button ion-icon {

  font-size: 16px;

}


.add-button:active {

  transform: scale(0.97);

}


/* ========================================
   SEARCH
======================================== */

.search-box {

  display: flex;

  align-items: center;

  height: 45px;

  margin-bottom: 13px;

  border:
    1px solid #e1edf3;

  border-radius: 13px;

  background: #ffffff;

  box-shadow:
    0 3px 12px
    rgba(62, 143, 195, 0.04);

}


.search-icon {

  flex-shrink: 0;

  margin-left: 13px;

  color: #8aa0ad;

  font-size: 18px;

}


.search-input {

  flex: 1;

  width: 100%;

  height: 100%;

  padding: 0 9px;

  border: 0;

  outline: none;

  background: transparent;

  color:
    var(--homecare-text);

  font-family: inherit;

  font-size: 12px;

}


.search-input::placeholder {

  color: #9aabb5;

}


.clear-button {

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  width: 36px;

  height: 36px;

  margin-right: 4px;

  border: 0;

  background: transparent;

  color: #a2b2bc;

  font-size: 18px;

}


/* ========================================
   SUMMARY
======================================== */

.summary-row {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 11px;

}


.summary-main {

  display: flex;

  align-items: baseline;

  gap: 4px;

}


.summary-main strong {

  color:
    var(--homecare-text);

  font-size: 18px;

  font-weight: 800;

}


.summary-main span {

  color:
    var(--homecare-muted);

  font-size: 10px;

}


.summary-category {

  display: flex;

  align-items: center;

  gap: 7px;

}


.category-summary-icon {

  display: flex;

  align-items: center;

  justify-content: center;

  width: 29px;

  height: 29px;

  border-radius: 9px;

  background: #e8f4fb;

  color:
    var(--homecare-blue-dark);

  font-size: 15px;

}


.summary-category div:last-child {

  display: flex;

  align-items: baseline;

  gap: 3px;

}


.summary-category strong {

  color:
    var(--homecare-text);

  font-size: 12px;

  font-weight: 750;

}


.summary-category span {

  color:
    var(--homecare-muted);

  font-size: 9px;

}


/* ========================================
   LIST
======================================== */

.item-list {

  display: flex;

  flex-direction: column;

  gap: 9px;

}


.item-card {

  padding: 13px;

  border:
    1px solid #e4eef4;

  border-radius: 15px;

  background: #ffffff;

  box-shadow:
    0 3px 12px
    rgba(62, 143, 195, 0.045);

  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

}


.item-card:active {

  transform: scale(0.99);

  box-shadow:
    0 2px 7px
    rgba(62, 143, 195, 0.07);

}


.item-main {

  display: flex;

  align-items: center;

  gap: 10px;

}


.item-icon {

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  width: 43px;

  height: 43px;

  border-radius: 12px;

  font-size: 21px;

}


.category-blue {

  background: #e8f4fb;

  color: #4b9ac8;

}


.category-green {

  background: #e8f7f2;

  color: #4b9d86;

}


.category-purple {

  background: #f0edfa;

  color: #8071b3;

}


.category-orange {

  background: #fff2e7;

  color: #d68b4d;

}


.category-default {

  background: #eaf3f8;

  color:
    var(--homecare-blue-dark);

}


.item-info {

  flex: 1;

  min-width: 0;

}


.item-info h2 {

  margin:
    0 0 2px;

  overflow: hidden;

  color:
    var(--homecare-text);

  font-size: 14px;

  font-weight: 750;

  text-overflow: ellipsis;

  white-space: nowrap;

}


.item-category {

  display: block;

  margin-bottom: 4px;

  color:
    var(--homecare-blue-dark);

  font-size: 9px;

  font-weight: 700;

}


.item-location {

  display: flex;

  align-items: center;

  gap: 3px;

  overflow: hidden;

  color:
    var(--homecare-muted);

  font-size: 10px;

  white-space: nowrap;

}


.item-location ion-icon {

  flex-shrink: 0;

  color:
    var(--homecare-blue);

  font-size: 12px;

}


.item-arrow {

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  color: #aab8c1;

  font-size: 18px;

}


/* ========================================
   EXTRA INFO
======================================== */

.item-extra {

  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 8px;

  margin-top: 11px;

  padding-top: 9px;

  border-top:
    1px solid #edf3f6;

}


.extra-info {

  display: flex;

  align-items: center;

  gap: 4px;

  min-width: 0;

  color:
    var(--homecare-muted);

  font-size: 9px;

}


.extra-info ion-icon {

  flex-shrink: 0;

  color:
    var(--homecare-blue);

  font-size: 12px;

}


.extra-info.notes {

  max-width: 100%;

}


.extra-info.notes span {

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

}


/* ========================================
   EMPTY STATE
======================================== */

.empty-state {

  padding:
    55px 20px;

  text-align: center;

}


.empty-icon {

  display: flex;

  align-items: center;

  justify-content: center;

  width: 64px;

  height: 64px;

  margin:
    0 auto 14px;

  border-radius: 19px;

  background: #e8f4fb;

  color:
    var(--homecare-blue-dark);

  font-size: 29px;

}


.empty-state h2 {

  margin:
    0 0 7px;

  color:
    var(--homecare-text);

  font-size: 18px;

  font-weight: 750;

}


.empty-state p {

  max-width: 275px;

  margin:
    0 auto 18px;

  color:
    var(--homecare-muted);

  font-size: 11px;

  line-height: 1.5;

}


.secondary-button,
.primary-button {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

  height: 38px;

  padding: 0 14px;

  border-radius: 11px;

  font-family: inherit;

  font-size: 10px;

  font-weight: 700;

}


.secondary-button {

  border:
    1px solid #d9eaf3;

  background: #ffffff;

  color:
    var(--homecare-blue-dark);

}


.primary-button {

  border: 0;

  background:
    var(--homecare-blue);

  color: #ffffff;

}


/* ========================================
   BOTTOM SPACE
======================================== */

.bottom-space {

  height: 90px;

}


/* ========================================
   MOBILE
======================================== */

@media (max-width: 600px) {

  .inventory-container {

    padding:
      16px 13px 120px;

  }

  .page-intro h1 {

    font-size: 23px;

  }

}


/* ========================================
   HP KECIL
======================================== */

@media (max-width: 360px) {

  .inventory-container {

    padding-left: 10px;

    padding-right: 10px;

  }


  .page-intro {

    gap: 8px;

  }


  .page-intro h1 {

    font-size: 21px;

  }


  .intro-text p {

    font-size: 9px;

  }


  .add-button {

    height: 34px;

    padding: 0 9px;

    font-size: 9px;

  }


  .item-icon {

    width: 40px;

    height: 40px;

    font-size: 19px;

  }


  .item-info h2 {

    font-size: 13px;

  }

}

</style>