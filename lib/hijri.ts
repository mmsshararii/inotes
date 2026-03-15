export function toHijri(date: Date): string {
  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth() + 1;
  const gregorianDay = date.getDate();

  let hijriYear = Math.floor((gregorianYear - 622) * 1.030684);
  let hijriMonth = Math.floor((gregorianMonth - 1) * 0.970224) + 1;
  let hijriDay = gregorianDay;

  if (hijriMonth > 12) {
    hijriMonth = hijriMonth - 12;
    hijriYear = hijriYear + 1;
  }

  const hijriMonthNames = [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الآخر',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
  ];

  return `${hijriDay} ${hijriMonthNames[hijriMonth - 1]} ${hijriYear}`;
}

export function formatHijriDate(dateString: string): string {
  const date = new Date(dateString);
  return toHijri(date);
}
