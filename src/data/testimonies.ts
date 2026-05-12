export interface Testimony {
  id: string
  name: string
  wilaya: string
  category: 'delay' | 'medication' | 'treatment' | 'other'
  message: string
  date: string
  likes: number
}

export const categoryLabels: Record<Testimony['category'], string> = {
  delay: '⏳ تأخر موعد',
  medication: '💊 ندرة دواء',
  treatment: '🏥 مشكل في العلاج',
  other: '📢 شكوى أخرى',
}

export const categoryColors: Record<Testimony['category'], string> = {
  delay: 'bg-amber-100 text-amber-700',
  medication: 'bg-red-100 text-red-700',
  treatment: 'bg-blue-100 text-blue-700',
  other: 'bg-gray-100 text-gray-700',
}

export const sampleTestimonies: Testimony[] = [
  {
    id: '1',
    name: 'سفيان',
    wilaya: 'سطيف',
    category: 'delay',
    message: 'عندي 4 أشهر وأنا نستنى في الراديوتيرابي في سطيف. كل مرة يقولولي الشهر الجاي. المرض ما يستناش!',
    date: '2025-05-08',
    likes: 24,
  },
  {
    id: '2',
    name: 'خديجة',
    wilaya: 'الجزائر',
    category: 'medication',
    message: 'نبحث عن دواء Fortimel لماما مريضة بسرطان المعدة. مش موجود في الصيدليات من شهرين. إذا حد يعرف وين، ساعدونا.',
    date: '2025-05-07',
    likes: 18,
  },
  {
    id: '3',
    name: 'محمد',
    wilaya: 'وهران',
    category: 'delay',
    message: 'موعد الجراحة تأجل 3 مرات في CHU وهران. 6 أشهر نستنى والورم يكبر. وين حقوقنا؟',
    date: '2025-05-06',
    likes: 31,
  },
  {
    id: '4',
    name: 'فاطمة',
    wilaya: 'قسنطينة',
    category: 'medication',
    message: 'دواء Herceptin غير متوفر من 3 أسابيع في قسنطينة. بنتي تحتاجه كل 21 يوم. اللي عنده معلومة يفيدنا.',
    date: '2025-05-05',
    likes: 27,
  },
  {
    id: '5',
    name: 'عبد الرحمان',
    wilaya: 'باتنة',
    category: 'treatment',
    message: 'جهاز الأشعة في باتنة معطّل من شهر. كل المرضى يتنقلو لسطيف أو قسنطينة. التنقل صعيب على المريض.',
    date: '2025-05-04',
    likes: 42,
  },
  {
    id: '6',
    name: 'نورة',
    wilaya: 'تيزي وزو',
    category: 'other',
    message: 'ما كاينش أخصائي نفسي في مركز السرطان تاعنا. المرضى يحتاجو دعم نفسي مش غير دواء.',
    date: '2025-05-03',
    likes: 15,
  },
]
