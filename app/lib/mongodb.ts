import mongoose from 'mongoose';

// Lấy URI từ biến môi trường
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Vui lòng định nghĩa biến MONGODB_URI trong file .env.local');
}

/** * Sử dụng biến global để duy trì kết nối khi Next.js reload trong quá trình dev.
 * Điều này ngăn chặn việc tạo ra hàng loạt kết nối mới gây tràn bộ nhớ.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Nếu đã có kết nối trước đó, sử dụng lại nó
  if (cached.conn) {
    return cached.conn;
  }

  // Nếu chưa có kết nối, khởi tạo một Promise kết nối mới
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Tắt buffer để báo lỗi ngay nếu kết nối thất bại
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ Đã kết nối MongoDB thành công');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;