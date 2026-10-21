const express = require('express')
const cors = require('cors')
const db = require('./config/database')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())


// ==================================================
// ROOT API
// ==================================================

app.get('/', async (req, res) => {
  try {
    await db.query('SELECT 1')

    res.json({
      message: 'HomeCare API berjalan',
      database: 'MySQL terhubung'
    })

  } catch (error) {

    console.error(
      'Database error:',
      error.message
    )

    res.status(500).json({
      message: 'HomeCare API berjalan',
      database: 'MySQL tidak terhubung',
      error: error.message
    })

  }
})


// ==================================================
// GET SEMUA INVENTARIS
// ==================================================

app.get('/api/items', async (req, res) => {

  try {

    const [rows] = await db.query(
      `SELECT
        id,
        name,
        category,
        location,
        purchase_date,
        notes,
        created_at,
        updated_at
       FROM items
       ORDER BY id DESC`
    )

    res.json(rows)

  } catch (error) {

    console.error(
      'Gagal mengambil data inventaris:',
      error.message
    )

    res.status(500).json({
      message: 'Gagal mengambil data inventaris',
      error: error.message
    })

  }

})


// ==================================================
// GET DETAIL INVENTARIS
// ==================================================

app.get('/api/items/:id', async (req, res) => {

  try {

    const { id } = req.params

    const [rows] = await db.query(
      `SELECT
        id,
        name,
        category,
        location,
        purchase_date,
        notes,
        created_at,
        updated_at
       FROM items
       WHERE id = ?`,
      [id]
    )

    if (rows.length === 0) {

      return res.status(404).json({
        message: 'Barang tidak ditemukan'
      })

    }

    res.json(rows[0])

  } catch (error) {

    console.error(
      'Gagal mengambil detail inventaris:',
      error.message
    )

    res.status(500).json({
      message: 'Gagal mengambil detail inventaris',
      error: error.message
    })

  }

})


// ==================================================
// TAMBAH INVENTARIS
// ==================================================

app.post('/api/items', async (req, res) => {

  try {

    const {
      name,
      category,
      location,
      purchase_date,
      notes
    } = req.body

    if (
      !name ||
      !category ||
      !location
    ) {

      return res.status(400).json({
        message:
          'Nama, kategori, dan lokasi wajib diisi'
      })

    }

    const [result] = await db.query(
      `INSERT INTO items (
        name,
        category,
        location,
        purchase_date,
        notes
      )
      VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        category,
        location,
        purchase_date || null,
        notes || null
      ]
    )

    res.status(201).json({
      message: 'Barang berhasil ditambahkan',
      id: result.insertId
    })

  } catch (error) {

    console.error(
      'Gagal menambahkan inventaris:',
      error.message
    )

    res.status(500).json({
      message: 'Gagal menambahkan inventaris',
      error: error.message
    })

  }

})


// ==================================================
// UPDATE INVENTARIS
// ==================================================

app.put('/api/items/:id', async (req, res) => {

  try {

    const { id } = req.params

    const {
      name,
      category,
      location,
      purchase_date,
      notes
    } = req.body

    if (
      !name ||
      !category ||
      !location
    ) {

      return res.status(400).json({
        message:
          'Nama, kategori, dan lokasi wajib diisi'
      })

    }

    const [result] = await db.query(
      `UPDATE items
       SET
         name = ?,
         category = ?,
         location = ?,
         purchase_date = ?,
         notes = ?
       WHERE id = ?`,
      [
        name,
        category,
        location,
        purchase_date || null,
        notes || null,
        id
      ]
    )

    if (result.affectedRows === 0) {

      return res.status(404).json({
        message: 'Barang tidak ditemukan'
      })

    }

    res.json({
      message: 'Barang berhasil diperbarui'
    })

  } catch (error) {

    console.error(
      'Gagal memperbarui inventaris:',
      error.message
    )

    res.status(500).json({
      message: 'Gagal memperbarui inventaris',
      error: error.message
    })

  }

})


// ==================================================
// DELETE INVENTARIS
// ==================================================

app.delete('/api/items/:id', async (req, res) => {

  try {

    const { id } = req.params

    const [result] = await db.query(
      `DELETE FROM items
       WHERE id = ?`,
      [id]
    )

    if (result.affectedRows === 0) {

      return res.status(404).json({
        message: 'Barang tidak ditemukan'
      })

    }

    res.json({
      message: 'Barang berhasil dihapus'
    })

  } catch (error) {

    console.error(
      'Gagal menghapus inventaris:',
      error.message
    )

    res.status(500).json({
      message: 'Gagal menghapus inventaris',
      error: error.message
    })

  }

})


// ==================================================
// GET SEMUA JADWAL PERAWATAN
// ==================================================

app.get('/api/maintenance', async (req, res) => {

  try {

    const [rows] = await db.query(
      `SELECT
        ms.id,
        ms.item_id,
        i.name AS item_name,
        ms.task,
        ms.next_date,
        ms.maintenance_interval,
        ms.notes
       FROM maintenance_schedules ms
       INNER JOIN items i
         ON i.id = ms.item_id
       ORDER BY ms.next_date ASC`
    )

    res.json(rows)

  } catch (error) {

    console.error(
      'Gagal mengambil data jadwal perawatan:',
      error.message
    )

    res.status(500).json({
      message:
        'Gagal mengambil data jadwal perawatan',
      error: error.message
    })

  }

})


// ==================================================
// TAMBAH JADWAL PERAWATAN
// ==================================================

app.post('/api/maintenance', async (req, res) => {

  try {

    const {
      item_id,
      task,
      next_date,
      maintenance_interval,
      notes
    } = req.body

    // ============================================
    // VALIDASI DATA
    // ============================================

    if (
      !item_id ||
      !task ||
      !next_date ||
      !maintenance_interval
    ) {

      return res.status(400).json({
        message:
          'Barang, jenis perawatan, tanggal, dan interval wajib diisi'
      })

    }

    // ============================================
    // CEK BARANG
    // ============================================

    const [items] = await db.query(
      `SELECT
        id
       FROM items
       WHERE id = ?`,
      [item_id]
    )

    if (items.length === 0) {

      return res.status(404).json({
        message:
          'Barang tidak ditemukan'
      })

    }

    // ============================================
    // SIMPAN JADWAL
    // ============================================

    const [result] = await db.query(
      `INSERT INTO maintenance_schedules (
        item_id,
        task,
        next_date,
        maintenance_interval,
        notes
      )
      VALUES (?, ?, ?, ?, ?)`,
      [
        item_id,
        task.trim(),
        next_date,
        maintenance_interval,
        notes || null
      ]
    )

    // ============================================
    // RESPONSE
    // ============================================

    res.status(201).json({

      message:
        'Jadwal perawatan berhasil ditambahkan',

      id:
        result.insertId

    })

  } catch (error) {

    console.error(
      'Gagal menambahkan jadwal perawatan:',
      error.message
    )

    res.status(500).json({

      message:
        'Gagal menambahkan jadwal perawatan',

      error:
        error.message

    })

  }

})


// ==================================================
// GET RIWAYAT PERAWATAN
// ==================================================

app.get(
  '/api/maintenance/history',
  async (req, res) => {

    try {

      const [rows] =
        await db.query(
          `SELECT
            id,
            schedule_id,
            item_id,
            item_name,
            task,
            completed_date,
            next_date,
            maintenance_interval,
            created_at
           FROM maintenance_history
           ORDER BY completed_date DESC, id DESC`
        )

      res.json(rows)

    } catch (error) {

      console.error(
        'Gagal mengambil riwayat perawatan:',
        error.message
      )

      res.status(500).json({
        message:
          'Gagal mengambil riwayat perawatan',
        error:
          error.message
      })

    }

  }
)


// ==================================================
// DELETE RIWAYAT PERAWATAN
// ==================================================

app.delete(
  '/api/maintenance/history/:id',
  async (req, res) => {

    try {

      const { id } = req.params

      const [result] =
        await db.query(
          `DELETE FROM maintenance_history
           WHERE id = ?`,
          [id]
        )

      if (result.affectedRows === 0) {

        return res.status(404).json({
          message:
            'Riwayat perawatan tidak ditemukan'
        })

      }

      res.json({
        message:
          'Riwayat perawatan berhasil dihapus'
      })

    } catch (error) {

      console.error(
        'Gagal menghapus riwayat perawatan:',
        error.message
      )

      res.status(500).json({
        message:
          'Gagal menghapus riwayat perawatan',
        error:
          error.message
      })

    }

  }
)


// ==================================================
// GET DETAIL JADWAL PERAWATAN
// ==================================================

app.get('/api/maintenance/:id', async (req, res) => {

  try {

    const { id } = req.params

    const [rows] = await db.query(
      `SELECT
        ms.id,
        ms.item_id,
        i.name AS item_name,
        ms.task,
        ms.next_date,
        ms.maintenance_interval,
        ms.notes
       FROM maintenance_schedules ms
       INNER JOIN items i
         ON i.id = ms.item_id
       WHERE ms.id = ?`,
      [id]
    )

    if (rows.length === 0) {

      return res.status(404).json({
        message:
          'Jadwal perawatan tidak ditemukan'
      })

    }

    res.json(rows[0])

  } catch (error) {

    console.error(
      'Gagal mengambil detail jadwal perawatan:',
      error.message
    )

    res.status(500).json({
      message:
        'Gagal mengambil detail jadwal perawatan',
      error: error.message
    })

  }

})


// ==================================================
// FUNGSI HITUNG JADWAL PERAWATAN BERIKUTNYA
// ==================================================

const getNextMaintenanceDate = (
  currentDate,
  interval
) => {

  const text =
    String(interval).toLowerCase()

  let months = 0

  if (text.includes('12')) {

    months = 12

  } else if (text.includes('6')) {

    months = 6

  } else if (text.includes('3')) {

    months = 3

  } else if (text.includes('1 bulan')) {

    months = 1

  }

  if (months === 0) {

    return null

  }

  const date =
    new Date(
      `${currentDate}T00:00:00`
    )

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return null

  }

  date.setMonth(
    date.getMonth() + months
  )

  const year =
    date.getFullYear()

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, '0')

  const day =
    String(
      date.getDate()
    ).padStart(2, '0')

  return `${year}-${month}-${day}`

}


// ==================================================
// SUDAH DIRAWAT
// ==================================================

app.post(
  '/api/maintenance/:id/complete',
  async (req, res) => {

    const connection =
      await db.getConnection()

    try {

      const { id } =
        req.params

      const {
        completed_date
      } = req.body

      // ============================================
      // VALIDASI TANGGAL
      // ============================================

      if (!completed_date) {

        return res.status(400).json({
          message:
            'Tanggal perawatan wajib diisi'
        })

      }

      // ============================================
      // AMBIL JADWAL
      // ============================================

      const [rows] =
        await connection.query(
          `SELECT
            ms.id,
            ms.item_id,
            i.name AS item_name,
            ms.task,
            ms.next_date,
            ms.maintenance_interval,
            ms.notes
           FROM maintenance_schedules ms
           INNER JOIN items i
             ON i.id = ms.item_id
           WHERE ms.id = ?`,
          [id]
        )

      if (rows.length === 0) {

        return res.status(404).json({
          message:
            'Jadwal perawatan tidak ditemukan'
        })

      }

      const schedule =
        rows[0]

      // ============================================
      // HITUNG JADWAL BERIKUTNYA
      // ============================================

      const nextDate =
        getNextMaintenanceDate(
          completed_date,
          schedule.maintenance_interval
        )

      if (!nextDate) {

        return res.status(400).json({
          message:
            'Interval jadwal tidak dikenali'
        })

      }

      // ============================================
      // MULAI TRANSACTION
      // ============================================

      await connection.beginTransaction()

      // ============================================
      // SIMPAN KE RIWAYAT
      // ============================================

      await connection.query(
        `INSERT INTO maintenance_history (
          schedule_id,
          item_id,
          item_name,
          task,
          completed_date,
          next_date,
          maintenance_interval
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          schedule.id,
          schedule.item_id,
          schedule.item_name,
          schedule.task,
          completed_date,
          nextDate,
          schedule.maintenance_interval
        ]
      )

      // ============================================
      // UPDATE JADWAL PERAWATAN
      // ============================================

      await connection.query(
        `UPDATE maintenance_schedules
         SET next_date = ?
         WHERE id = ?`,
        [
          nextDate,
          schedule.id
        ]
      )

      // ============================================
      // SELESAIKAN TRANSACTION
      // ============================================

      await connection.commit()

      // ============================================
      // RESPONSE
      // ============================================

      res.json({

        message:
          'Perawatan berhasil dicatat',

        completed_date:
          completed_date,

        next_date:
          nextDate

      })

    } catch (error) {

      // ============================================
      // BATALKAN TRANSACTION
      // ============================================

      await connection.rollback()

      console.error(
        'Gagal mencatat perawatan:',
        error.message
      )

      res.status(500).json({

        message:
          'Gagal mencatat perawatan',

        error:
          error.message

      })

    } finally {

      // ============================================
      // LEPASKAN CONNECTION
      // ============================================

      connection.release()

    }

  }
)


// ==================================================
// JALANKAN SERVER
// ==================================================

app.listen(
  PORT,
  () => {

    console.log(
      `HomeCare API berjalan di http://localhost:${PORT}`
    )

  }
)