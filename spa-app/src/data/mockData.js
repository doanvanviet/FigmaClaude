// ─── DANH MỤC DỊCH VỤ ──────────────────────────────────────────────────────
export const SERVICE_CATEGORIES = [
  { value: 'cham-soc-da',      label: 'Chăm sóc da' },
  { value: 'massage',          label: 'Massage' },
  { value: 'nail',             label: 'Nail' },
  { value: 'toc',              label: 'Tóc' },
  { value: 'cham-soc-co-the', label: 'Chăm sóc cơ thể' },
]

// ─── DỊCH VỤ ────────────────────────────────────────────────────────────────
export const services = [
  { id: 1,  name: 'Chăm sóc da mặt cơ bản',      category: 'cham-soc-da',      duration: 60,  price: 350000,  description: 'Làm sạch, tẩy tế bào chết, dưỡng ẩm chuyên sâu' },
  { id: 2,  name: 'Điều trị mụn chuyên sâu',      category: 'cham-soc-da',      duration: 90,  price: 450000,  description: 'Trị mụn viêm, mụn bọc, se lỗ chân lông' },
  { id: 3,  name: 'Nâng cơ – Trẻ hóa da',         category: 'cham-soc-da',      duration: 90,  price: 650000,  description: 'Công nghệ RF nâng cơ, xóa nếp nhăn' },
  { id: 4,  name: 'Trị nám & tàn nhang',           category: 'cham-soc-da',      duration: 75,  price: 580000,  description: 'Laser kết hợp serum trị nám hiệu quả' },
  { id: 5,  name: 'Massage toàn thân Thụy Điển',   category: 'massage',          duration: 90,  price: 500000,  description: 'Kỹ thuật Thụy Điển, thư giãn toàn thân' },
  { id: 6,  name: 'Massage đá nóng',               category: 'massage',          duration: 90,  price: 650000,  description: 'Đá bazan nóng kết hợp dầu dừa thiên nhiên' },
  { id: 7,  name: 'Massage đầu cổ vai gáy',        category: 'massage',          duration: 45,  price: 250000,  description: 'Giảm căng thẳng, đau vai gáy' },
  { id: 8,  name: 'Sơn gel tay',                   category: 'nail',             duration: 60,  price: 200000,  description: 'Sơn gel bền màu, đa dạng màu sắc' },
  { id: 9,  name: 'Sơn gel chân',                  category: 'nail',             duration: 60,  price: 220000,  description: 'Sơn gel chân, kết hợp chăm sóc da chân' },
  { id: 10, name: 'Nail art thiết kế',             category: 'nail',             duration: 90,  price: 380000,  description: 'Thiết kế móng theo yêu cầu, vẽ tay tinh xảo' },
  { id: 11, name: 'Cắt & tạo kiểu tóc',           category: 'toc',              duration: 60,  price: 200000,  description: 'Cắt + gội + sấy tạo kiểu' },
  { id: 12, name: 'Uốn tóc',                       category: 'toc',              duration: 180, price: 800000,  description: 'Uốn xoăn, uốn lạnh, uốn sóng biển' },
  { id: 13, name: 'Nhuộm tóc thời trang',          category: 'toc',              duration: 150, price: 750000,  description: 'Nhuộm màu, bạch kim, highlight' },
  { id: 14, name: 'Tẩy tế bào chết toàn thân',    category: 'cham-soc-co-the', duration: 60,  price: 400000,  description: 'Muối biển kết hợp tinh dầu thiên nhiên' },
  { id: 15, name: 'Đắp bùn khoáng',               category: 'cham-soc-co-the', duration: 90,  price: 550000,  description: 'Bùn khoáng tự nhiên thải độc tố cơ thể' },
]

// ─── NHÂN VIÊN ───────────────────────────────────────────────────────────────
export const staff = [
  { id: 1, name: 'Nguyễn Thị Mai',   phone: '0901 234 567', email: 'mai.nguyen@spa.vn',   skills: ['Chăm sóc da', 'Massage'],          avatar: null },
  { id: 2, name: 'Trần Thị Hương',   phone: '0902 345 678', email: 'huong.tran@spa.vn',   skills: ['Nail', 'Chăm sóc da'],             avatar: null },
  { id: 3, name: 'Lê Thị Lan',       phone: '0903 456 789', email: 'lan.le@spa.vn',        skills: ['Tóc', 'Chăm sóc cơ thể'],         avatar: null },
  { id: 4, name: 'Phạm Thị Thu',     phone: '0904 567 890', email: 'thu.pham@spa.vn',      skills: ['Massage', 'Chăm sóc cơ thể'],      avatar: null },
  { id: 5, name: 'Hoàng Thị Bích',   phone: '0905 678 901', email: 'bich.hoang@spa.vn',   skills: ['Nail'],                            avatar: null },
  { id: 6, name: 'Vũ Thị Ngọc',     phone: '0906 789 012', email: 'ngoc.vu@spa.vn',       skills: ['Chăm sóc da'],                     avatar: null },
  { id: 7, name: 'Đặng Thị Linh',   phone: '0907 890 123', email: 'linh.dang@spa.vn',    skills: ['Tóc'],                             avatar: null },
  { id: 8, name: 'Bùi Thị Hà',      phone: '0908 901 234', email: 'ha.bui@spa.vn',        skills: ['Massage', 'Chăm sóc cơ thể'],      avatar: null },
]

// ─── KHÁCH HÀNG ──────────────────────────────────────────────────────────────
export const customers = [
  { id: 1,  name: 'Nguyễn Thị Bảo Châu',  phone: '0911 111 001', email: 'baochau@email.com',  birthDate: '1992-05-14', skinNote: 'Da khô, nhạy cảm',     points: 850,  visitCount: 12, totalSpent: 4200000, lastVisit: '2026-05-22' },
  { id: 2,  name: 'Trần Minh Khánh',       phone: '0922 222 002', email: 'khanh.tran@email.com',birthDate: '1988-08-20', skinNote: 'Da dầu, dễ nổi mụn',  points: 1200, visitCount: 18, totalSpent: 7800000, lastVisit: '2026-05-25' },
  { id: 3,  name: 'Lê Thị Thu Hà',         phone: '0933 333 003', email: 'thuha@email.com',     birthDate: '1995-03-10', skinNote: 'Da thường',            points: 430,  visitCount: 6,  totalSpent: 1950000, lastVisit: '2026-05-18' },
  { id: 4,  name: 'Phạm Ngọc Ánh',         phone: '0944 444 004', email: 'ngoccanh@email.com',  birthDate: '1990-11-25', skinNote: 'Da hỗn hợp',          points: 680,  visitCount: 9,  totalSpent: 3100000, lastVisit: '2026-05-20' },
  { id: 5,  name: 'Hoàng Thu Trang',        phone: '0955 555 005', email: 'thutrang@email.com',  birthDate: '1997-07-04', skinNote: 'Da nhạy cảm',         points: 290,  visitCount: 4,  totalSpent: 1200000, lastVisit: '2026-05-15' },
  { id: 6,  name: 'Vũ Bảo Ngọc',           phone: '0966 666 006', email: 'baongoc@email.com',   birthDate: '1993-01-17', skinNote: 'Da khô',               points: 1540, visitCount: 22, totalSpent: 9600000, lastVisit: '2026-05-26' },
  { id: 7,  name: 'Đặng Thị Mỹ Linh',     phone: '0977 777 007', email: 'mylinh@email.com',    birthDate: '1986-09-30', skinNote: 'Da dầu',               points: 720,  visitCount: 11, totalSpent: 4500000, lastVisit: '2026-05-21' },
  { id: 8,  name: 'Bùi Hương Giang',        phone: '0988 888 008', email: 'huonggiang@email.com',birthDate: '1999-12-08', skinNote: 'Da thường, ít chăm sóc',points: 150, visitCount: 3,  totalSpent: 650000,  lastVisit: '2026-05-10' },
  { id: 9,  name: 'Đinh Thị Lan Anh',      phone: '0999 999 009', email: 'lananh@email.com',    birthDate: '1991-06-22', skinNote: 'Da hỗn hợp, nám nhẹ', points: 960,  visitCount: 14, totalSpent: 5800000, lastVisit: '2026-05-24' },
  { id: 10, name: 'Ngô Thị Phương Linh',   phone: '0901 010 010', email: 'phuonglinh@email.com',birthDate: '1994-02-28', skinNote: 'Da thường',            points: 380,  visitCount: 7,  totalSpent: 2100000, lastVisit: '2026-05-17' },
  { id: 11, name: 'Trịnh Ngọc Mai',         phone: '0912 121 011', email: 'ngocmai@email.com',   birthDate: '1989-04-15', skinNote: 'Da dầu, lỗ chân lông to',points: 1100,visitCount: 16, totalSpent: 6700000, lastVisit: '2026-05-23' },
  { id: 12, name: 'Lý Thị Thanh Tâm',      phone: '0923 232 012', email: 'thanhtam@email.com',  birthDate: '1996-10-01', skinNote: 'Da khô, bong tróc',    points: 560,  visitCount: 8,  totalSpent: 2800000, lastVisit: '2026-05-19' },
  { id: 13, name: 'Phan Thị Diễm Quỳnh',  phone: '0934 343 013', email: 'diemquynh@email.com', birthDate: '2000-07-12', skinNote: 'Da dầu mụn',          points: 220,  visitCount: 5,  totalSpent: 900000,  lastVisit: '2026-05-12' },
  { id: 14, name: 'Dương Bích Ngọc',        phone: '0945 454 014', email: 'bichhngoc@email.com', birthDate: '1987-03-05', skinNote: 'Da thường, chăm chút', points: 1350, visitCount: 20, totalSpent: 8900000, lastVisit: '2026-05-25' },
  { id: 15, name: 'Cao Thị Quỳnh Như',     phone: '0956 565 015', email: 'quynhnhu@email.com',  birthDate: '1998-08-18', skinNote: 'Da hỗn hợp',          points: 490,  visitCount: 7,  totalSpent: 2300000, lastVisit: '2026-05-16' },
]

// ─── TRẠNG THÁI LỊCH HẸN ─────────────────────────────────────────────────────
export const APPOINTMENT_STATUSES = [
  { value: 'pending',     label: 'Chờ xác nhận',    color: 'warning' },
  { value: 'confirmed',   label: 'Đã xác nhận',     color: 'info' },
  { value: 'inprogress',  label: 'Đang thực hiện',  color: 'brand' },
  { value: 'completed',   label: 'Hoàn thành',      color: 'success' },
  { value: 'cancelled',   label: 'Đã hủy',          color: 'danger' },
]

// ─── LỊCH HẸN ────────────────────────────────────────────────────────────────
export const appointments = [
  { id: 1,  customerId: 1,  customerName: 'Nguyễn Thị Bảo Châu', phone: '0911 111 001', serviceId: 1,  serviceName: 'Chăm sóc da mặt cơ bản',    staffId: 1, staffName: 'Nguyễn Thị Mai',  date: '2026-05-27', time: '09:00', duration: 60,  status: 'confirmed',  note: '' },
  { id: 2,  customerId: 2,  customerName: 'Trần Minh Khánh',      phone: '0922 222 002', serviceId: 5,  serviceName: 'Massage toàn thân Thụy Điển',staffId: 4, staffName: 'Phạm Thị Thu',    date: '2026-05-27', time: '10:00', duration: 90,  status: 'inprogress', note: 'Khách thích áp lực nhẹ' },
  { id: 3,  customerId: 3,  customerName: 'Lê Thị Thu Hà',        phone: '0933 333 003', serviceId: 8,  serviceName: 'Sơn gel tay',               staffId: 2, staffName: 'Trần Thị Hương',  date: '2026-05-27', time: '11:00', duration: 60,  status: 'pending',    note: '' },
  { id: 4,  customerId: 4,  customerName: 'Phạm Ngọc Ánh',        phone: '0944 444 004', serviceId: 11, serviceName: 'Cắt & tạo kiểu tóc',       staffId: 3, staffName: 'Lê Thị Lan',      date: '2026-05-27', time: '13:30', duration: 60,  status: 'confirmed',  note: '' },
  { id: 5,  customerId: 5,  customerName: 'Hoàng Thu Trang',       phone: '0955 555 005', serviceId: 14, serviceName: 'Tẩy tế bào chết toàn thân',staffId: 8, staffName: 'Bùi Thị Hà',     date: '2026-05-27', time: '14:00', duration: 60,  status: 'pending',    note: 'Lần đầu sử dụng dịch vụ' },
  { id: 6,  customerId: 6,  customerName: 'Vũ Bảo Ngọc',          phone: '0966 666 006', serviceId: 3,  serviceName: 'Nâng cơ – Trẻ hóa da',     staffId: 6, staffName: 'Vũ Thị Ngọc',    date: '2026-05-27', time: '15:00', duration: 90,  status: 'confirmed',  note: '' },
  { id: 7,  customerId: 7,  customerName: 'Đặng Thị Mỹ Linh',    phone: '0977 777 007', serviceId: 7,  serviceName: 'Massage đầu cổ vai gáy',    staffId: 1, staffName: 'Nguyễn Thị Mai',  date: '2026-05-27', time: '16:00', duration: 45,  status: 'pending',    note: '' },
  { id: 8,  customerId: 8,  customerName: 'Bùi Hương Giang',       phone: '0988 888 008', serviceId: 10, serviceName: 'Nail art thiết kế',         staffId: 5, staffName: 'Hoàng Thị Bích', date: '2026-05-28', time: '09:30', duration: 90,  status: 'confirmed',  note: 'Mẫu nail đính đá' },
  { id: 9,  customerId: 9,  customerName: 'Đinh Thị Lan Anh',     phone: '0999 999 009', serviceId: 4,  serviceName: 'Trị nám & tàn nhang',       staffId: 6, staffName: 'Vũ Thị Ngọc',    date: '2026-05-28', time: '10:00', duration: 75,  status: 'confirmed',  note: '' },
  { id: 10, customerId: 10, customerName: 'Ngô Thị Phương Linh',  phone: '0901 010 010', serviceId: 6,  serviceName: 'Massage đá nóng',           staffId: 4, staffName: 'Phạm Thị Thu',    date: '2026-05-28', time: '11:30', duration: 90,  status: 'pending',    note: 'Khách VIP, ưu tiên phòng yên tĩnh' },
  { id: 11, customerId: 11, customerName: 'Trịnh Ngọc Mai',        phone: '0912 121 011', serviceId: 2,  serviceName: 'Điều trị mụn chuyên sâu',   staffId: 1, staffName: 'Nguyễn Thị Mai',  date: '2026-05-28', time: '14:00', duration: 90,  status: 'confirmed',  note: '' },
  { id: 12, customerId: 12, customerName: 'Lý Thị Thanh Tâm',     phone: '0923 232 012', serviceId: 12, serviceName: 'Uốn tóc',                  staffId: 7, staffName: 'Đặng Thị Linh',  date: '2026-05-28', time: '15:30', duration: 180, status: 'confirmed',  note: '' },
  { id: 13, customerId: 1,  customerName: 'Nguyễn Thị Bảo Châu',  phone: '0911 111 001', serviceId: 9,  serviceName: 'Sơn gel chân',             staffId: 2, staffName: 'Trần Thị Hương',  date: '2026-05-26', time: '10:00', duration: 60,  status: 'completed',  note: '' },
  { id: 14, customerId: 13, customerName: 'Phan Thị Diễm Quỳnh', phone: '0934 343 013', serviceId: 5,  serviceName: 'Massage toàn thân Thụy Điển',staffId: 8, staffName: 'Bùi Thị Hà',     date: '2026-05-26', time: '13:00', duration: 90,  status: 'completed',  note: '' },
  { id: 15, customerId: 14, customerName: 'Dương Bích Ngọc',       phone: '0945 454 014', serviceId: 15, serviceName: 'Đắp bùn khoáng',          staffId: 4, staffName: 'Phạm Thị Thu',    date: '2026-05-25', time: '09:00', duration: 90,  status: 'completed',  note: '' },
  { id: 16, customerId: 15, customerName: 'Cao Thị Quỳnh Như',    phone: '0956 565 015', serviceId: 13, serviceName: 'Nhuộm tóc thời trang',     staffId: 7, staffName: 'Đặng Thị Linh',  date: '2026-05-25', time: '14:00', duration: 150, status: 'completed',  note: '' },
  { id: 17, customerId: 3,  customerName: 'Lê Thị Thu Hà',         phone: '0933 333 003', serviceId: 1,  serviceName: 'Chăm sóc da mặt cơ bản',  staffId: 1, staffName: 'Nguyễn Thị Mai',  date: '2026-05-24', time: '11:00', duration: 60,  status: 'completed',  note: '' },
  { id: 18, customerId: 5,  customerName: 'Hoàng Thu Trang',        phone: '0955 555 005', serviceId: 8,  serviceName: 'Sơn gel tay',             staffId: 2, staffName: 'Trần Thị Hương',  date: '2026-05-23', time: '14:30', duration: 60,  status: 'cancelled',  note: 'Khách báo bận đột xuất' },
  { id: 19, customerId: 9,  customerName: 'Đinh Thị Lan Anh',      phone: '0999 999 009', serviceId: 7,  serviceName: 'Massage đầu cổ vai gáy',  staffId: 1, staffName: 'Nguyễn Thị Mai',  date: '2026-05-22', time: '16:00', duration: 45,  status: 'cancelled',  note: '' },
  { id: 20, customerId: 2,  customerName: 'Trần Minh Khánh',        phone: '0922 222 002', serviceId: 3,  serviceName: 'Nâng cơ – Trẻ hóa da',   staffId: 6, staffName: 'Vũ Thị Ngọc',    date: '2026-05-22', time: '10:00', duration: 90,  status: 'completed',  note: '' },
]

// ─── HELPER ─────────────────────────────────────────────────────────────────
export function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN').format(value) + ' ₫'
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function getStatusInfo(value) {
  return APPOINTMENT_STATUSES.find(s => s.value === value) || { label: value, color: 'neutral' }
}

export function getCategoryLabel(value) {
  return SERVICE_CATEGORIES.find(c => c.value === value)?.label || value
}
