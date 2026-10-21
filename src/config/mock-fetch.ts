import { API_BASE_URL } from './api';

const DB_NAME = 'HomeCareDB';
const DB_VERSION = 1;

let db: IDBDatabase;

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains('items')) {
        database.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
      }
      if (!database.objectStoreNames.contains('maintenance')) {
        database.createObjectStore('maintenance', { keyPath: 'id', autoIncrement: true });
      }
      if (!database.objectStoreNames.contains('maintenance_history')) {
        database.createObjectStore('maintenance_history', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event: any) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
};

const getAll = (storeName: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getById = (storeName: string, id: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const addData = (storeName: string, data: any): Promise<number> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.add(data);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
};

const updateData = (storeName: string, data: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const deleteData = (storeName: string, id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const originalFetch = window.fetch;

export const setupMockFetch = async () => {
  await initDB();

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    if (!url.startsWith(API_BASE_URL)) {
      return originalFetch(input, init);
    }

    const method = init?.method || 'GET';
    const path = url.replace(API_BASE_URL, '').split('?')[0];
    const segments = path.split('/').filter(Boolean);

    const jsonResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    try {
      if (segments[0] === 'items') {
        if (method === 'GET' && segments.length === 1) {
          const items = await getAll('items');
          return jsonResponse(items);
        }
        if (method === 'GET' && segments.length === 2) {
          const id = Number(segments[1]);
          const item = await getById('items', id);
          if (!item) return jsonResponse({ message: 'Not found' }, 404);
          return jsonResponse(item);
        }
        if (method === 'POST') {
          const body = JSON.parse(init?.body as string);
          const id = await addData('items', body);
          return jsonResponse({ id, ...body }, 201);
        }
        if (method === 'PUT' && segments.length === 2) {
          const id = Number(segments[1]);
          const body = JSON.parse(init?.body as string);
          await updateData('items', { ...body, id });
          return jsonResponse({ id, ...body });
        }
        if (method === 'DELETE' && segments.length === 2) {
          const id = Number(segments[1]);
          await deleteData('items', id);
          
          // Cascade delete associated maintenance records
          const schedules = await getAll('maintenance');
          for (const s of schedules) {
            if (s.item_id === id) {
              await deleteData('maintenance', s.id);
            }
          }
          
          // Cascade delete associated history records
          const histories = await getAll('maintenance_history');
          for (const h of histories) {
            if (h.item_id === id) {
              await deleteData('maintenance_history', h.id);
            }
          }

          return jsonResponse({ success: true });
        }
      }

      if (segments[0] === 'maintenance') {
        if (segments[1] === 'history') {
          if (method === 'GET' && segments.length === 2) {
            const history = await getAll('maintenance_history');
            const items = await getAll('items');
            
            const historyResult = history
              .map(h => {
                const item = items.find(i => i.id === h.item_id);
                if (!item) return null; // Filter out orphaned records
                return {
                  id: h.id,
                  schedule_id: h.schedule_id,
                  item_id: h.item_id,
                  item_name: item.name,
                  task: h.task,
                  completed_date: h.completed_date,
                  next_date: h.next_date,
                  maintenance_interval: h.maintenance_interval,
                  created_at: h.completed_date
                };
              })
              .filter(Boolean); // Remove nulls
              
            // Sort by completedDate desc
            historyResult.sort((a: any, b: any) => new Date(b.completed_date).getTime() - new Date(a.completed_date).getTime());
            return jsonResponse(historyResult);
          }
          if (method === 'DELETE' && segments.length === 3) {
            const id = Number(segments[2]);
            await deleteData('maintenance_history', id);
            return jsonResponse({ success: true });
          }
        }

        if (method === 'GET' && segments.length === 1) {
          const schedules = await getAll('maintenance');
          const items = await getAll('items');
          
          const scheduleResult = schedules
            .map(s => {
              const item = items.find(i => i.id === s.item_id);
              if (!item) return null; // Filter out orphaned records
              return {
                id: s.id,
                item_id: s.item_id,
                item_name: item.name,
                task: s.task,
                next_date: s.next_date,
                maintenance_interval: s.maintenance_interval,
                notes: s.notes
              };
            })
            .filter(Boolean); // Remove nulls
            
          // Sort by nextDate asc
          scheduleResult.sort((a: any, b: any) => new Date(a.next_date).getTime() - new Date(b.next_date).getTime());
          return jsonResponse(scheduleResult);
        }

        if (method === 'GET' && segments.length === 2) {
          const id = Number(segments[1]);
          const s = await getById('maintenance', id);
          if (!s) return jsonResponse({ message: 'Not found' }, 404);
          const items = await getAll('items');
          const item = items.find(i => i.id === s.item_id);
          if (!item) return jsonResponse({ message: 'Item not found' }, 404);
          return jsonResponse({
            id: s.id,
            item_id: s.item_id,
            item_name: item.name,
            task: s.task,
            next_date: s.next_date,
            maintenance_interval: s.maintenance_interval,
            notes: s.notes
          });
        }

        if (method === 'POST' && segments.length === 1) {
          const body = JSON.parse(init?.body as string);
          const id = await addData('maintenance', body);
          return jsonResponse({ id, ...body }, 201);
        }

        if (method === 'POST' && segments[2] === 'complete') {
          const scheduleId = Number(segments[1]);
          const body = JSON.parse(init?.body as string);
          const completedDate = body.completed_date;

          const schedule = await getById('maintenance', scheduleId);
          if (!schedule) return jsonResponse({ message: 'Not found' }, 404);

          let newNextDate = schedule.next_date;

          if (schedule.maintenance_interval === 'Sekali saja') {
            await deleteData('maintenance', scheduleId);
          } else {
            // FIX: Hitung next_date dari tanggal JADWAL (schedule.next_date),
            // BUKAN dari hari ini (completedDate).
            // Tujuannya agar perawatan tetap pada jadwal yang benar.
            // Contoh: dijadwalkan 12 Sep + 1 bulan = 12 Okt
            //         meski dirawat pada 30 Sep, next_date tetap 12 Okt
            let date: Date;
            if (schedule.next_date && /^\d{4}-\d{2}-\d{2}$/.test(schedule.next_date)) {
              const [y, m, d] = schedule.next_date.split('-').map(Number);
              date = new Date(y, m - 1, d);
            } else {
              date = new Date();
            }

            const intervalStr = schedule.maintenance_interval;
            if (intervalStr.includes('12 bulan')) date.setFullYear(date.getFullYear() + 1);
            else if (intervalStr.includes('6 bulan')) date.setMonth(date.getMonth() + 6);
            else if (intervalStr.includes('3 bulan')) date.setMonth(date.getMonth() + 3);
            else if (intervalStr.includes('1 bulan')) date.setMonth(date.getMonth() + 1);

            // Format tanggal: YYYY-MM-DD tanpa konversi UTC
            const yy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            newNextDate = `${yy}-${mm}-${dd}`;

            schedule.next_date = newNextDate;
            await updateData('maintenance', schedule);
          }

          // FIX: Simpan next_date yang sudah dihitung ke riwayat,
          // bukan next_date lama dari jadwal sebelumnya
          await addData('maintenance_history', {
            schedule_id: schedule.id,
            item_id: schedule.item_id,
            task: schedule.task,
            completed_date: completedDate,
            next_date: newNextDate,
            maintenance_interval: schedule.maintenance_interval
          });

          return jsonResponse({ success: true, next_date: newNextDate });
        }
      }

      return jsonResponse({ message: 'Not Found' }, 404);
    } catch (err: any) {
      console.error(err);
      return jsonResponse({ message: err.message }, 500);
    }
  };
};
