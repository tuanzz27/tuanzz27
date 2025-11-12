import { Jar, Category, JarName, Pet } from './types';

export const CATEGORIES: Category[] = ['Ăn uống', 'Học tập', 'Giải trí', 'Di chuyển', 'Mua sắm', 'Khác'];

export const JARS_CONFIG: Record<JarName, Omit<Jar, 'balance'>> = {
  NEC: {
    name: 'NEC',
    fullName: 'Chi tiêu cần thiết',
    percentage: 0.55,
    icon: '🍚',
    color: 'bg-blue-100 text-blue-700',
    description: 'Nhu cầu thiết yếu hàng ngày như ăn uống, đi lại...'
  },
  LTSS: {
    name: 'LTSS',
    fullName: 'Tiết kiệm dài hạn',
    percentage: 0.10,
    icon: '🎯',
    color: 'bg-purple-100 text-purple-700',
    description: 'Mua sắm món đồ lớn như điện thoại, xe đạp...'
  },
  EDU: {
    name: 'EDU',
    fullName: 'Giáo dục',
    percentage: 0.10,
    icon: '📚',
    color: 'bg-green-100 text-green-700',
    description: 'Đầu tư cho bản thân: sách vở, khóa học...'
  },
  PLAY: {
    name: 'PLAY',
    fullName: 'Hưởng thụ',
    percentage: 0.10,
    icon: '🎮',
    color: 'bg-yellow-100 text-yellow-700',
    description: 'Giải trí, xem phim, trà sữa với bạn bè...'
  },
  FFA: {
    name: 'FFA',
    fullName: 'Tự do tài chính',
    percentage: 0.10,
    icon: '💰',
    color: 'bg-pink-100 text-pink-700',
    description: 'Xây dựng quỹ tự do, không bao giờ tiêu đến.'
  },
  GIVE: {
    name: 'GIVE',
    fullName: 'Cho đi',
    percentage: 0.05,
    icon: '🎁',
    color: 'bg-red-100 text-red-700',
    description: 'Giúp đỡ người khác, làm từ thiện, quà tặng...'
  }
};

export const ALL_JAR_NAMES = Object.keys(JARS_CONFIG) as JarName[];

export const CHART_COLORS = [
  '#8B5CF6', // purple-500
  '#EC4899', // pink-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#3B82F6', // blue-500
  '#EF4444', // red-500
];

export const PETS_CONFIG: Pet[] = [
  {
    id: 'heo-dat',
    name: 'Heo Đất',
    description: 'Một người bạn đồng hành quen thuộc, giúp bạn giữ tiền an toàn.',
    evolutions: [
      { name: 'Heo Con', image: '🐷', requiredSavings: 0 },
      { name: 'Heo Trưởng Thành', image: '🐖', requiredSavings: 50000 },
      { name: 'Heo Vàng', image: '💰', requiredSavings: 200000 },
      { name: 'Vua Heo', image: '👑', requiredSavings: 500000 },
    ],
  },
  {
    id: 'mam-cay',
    name: 'Mầm Cây Tài Lộc',
    description: 'Nuôi dưỡng hạt mầm tiết kiệm để nó lớn thành cây tiền vững chãi.',
    evolutions: [
      { name: 'Hạt Mầm', image: '🌱', requiredSavings: 0 },
      { name: 'Cây Non', image: '🌿', requiredSavings: 75000 },
      { name: 'Cây Lớn', image: '🌳', requiredSavings: 250000 },
      { name: 'Cây Ra Vàng', image: '🪙', requiredSavings: 600000 },
    ],
  },
  {
    id: 'trung-rong',
    name: 'Trứng Rồng',
    description: 'Một quả trứng bí ẩn. Ai biết được sinh vật huyền thoại nào sẽ nở ra?',
    evolutions: [
      { name: 'Trứng Bí Ẩn', image: '🥚', requiredSavings: 0 },
      { name: 'Trứng Nứt', image: '🐣', requiredSavings: 100000 },
      { name: 'Rồng Con', image: '🐲', requiredSavings: 400000 },
      { name: 'Hỏa Long', image: '🔥', requiredSavings: 1000000 },
    ],
  },
];
