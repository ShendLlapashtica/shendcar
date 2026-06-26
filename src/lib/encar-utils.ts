// ── Translation maps ────────────────────────────────────────────────────────

export const MANUFACTURER_MAP: Record<string, string> = {
  '벤츠': 'Mercedes-Benz',
  '비엠더블유': 'BMW',
  '아우디': 'Audi',
  '폭스바겐': 'Volkswagen',
  '현대': 'Hyundai',
  '기아': 'Kia',
  '토요타': 'Toyota',
  '렉서스': 'Lexus',
  '혼다': 'Honda',
  '닛산': 'Nissan',
  '제네시스': 'Genesis',
  '포르쉐': 'Porsche',
  '랜드로버': 'Land Rover',
  '볼보': 'Volvo',
  '쉐보레': 'Chevrolet',
  '포드': 'Ford',
  '링컨': 'Lincoln',
  '캐딜락': 'Cadillac',
  '지프': 'Jeep',
  '크라이슬러': 'Chrysler',
  '닷지': 'Dodge',
  '테슬라': 'Tesla',
  '마세라티': 'Maserati',
  '페라리': 'Ferrari',
  '람보르기니': 'Lamborghini',
  '롤스로이스': 'Rolls-Royce',
  '벤틀리': 'Bentley',
  '재규어': 'Jaguar',
  '알파로메오': 'Alfa Romeo',
  '피아트': 'Fiat',
  '푸조': 'Peugeot',
  '르노': 'Renault',
  '시트로엥': 'Citroën',
  '미니': 'MINI',
  '스마트': 'Smart',
  '쌍용': 'SsangYong',
  '르노삼성': 'Renault Samsung',
  '한국GM': 'GM Korea',
  '대우': 'Daewoo',
  '삼성': 'Samsung',
  '인피니티': 'Infiniti',
  '아큐라': 'Acura',
  '스바루': 'Subaru',
  '마쯔다': 'Mazda',
  '미쓰비시': 'Mitsubishi',
  '스즈키': 'Suzuki',
};

export const FUEL_MAP: Record<string, string> = {
  '디젤': 'Naftë',
  '가솔린': 'Benzinë',
  '하이브리드': 'Hibrid',
  '플러그인하이브리드': 'Plug-in Hibrid',
  '전기': 'Elektrik',
  'LPG': 'LPG',
  'LPI': 'LPI',
  '수소': 'Hidrogjen',
  'CNG': 'CNG',
};

export const TRANS_MAP: Record<string, string> = {
  'A': 'Automatik',
  'M': 'Manual',
  'CVT': 'CVT',
  'DCT': 'DCT (Doppio)',
  'AMT': 'AMT',
};

export const COLOR_MAP: Record<string, string> = {
  '흰색': 'E bardhë',
  '백색': 'E bardhë',
  '검은색': 'E zezë',
  '검정색': 'E zezë',
  '회색': 'Gri',
  '은색': 'Argjendi',
  '은회색': 'Gri argjendi',
  '빨간색': 'E kuqe',
  '적색': 'E kuqe',
  '파란색': 'E kaltër',
  '청색': 'E kaltër',
  '남색': 'Blu e errët',
  '갈색': 'Kafe',
  '베이지': 'Bezhë',
  '노란색': 'E verdhë',
  '황색': 'E verdhë',
  '녹색': 'E gjelbër',
  '초록색': 'E gjelbër',
  '주황색': 'Portokalli',
  '보라색': 'Vjollcë',
  '금색': 'Ari',
  '하늘색': 'Blu qielli',
  '분홍색': 'Rozë',
  '자주색': 'Burgundy',
  '청록색': 'Teal',
};

export const REGION_MAP: Record<string, string> = {
  '서울': 'Seoul',
  '부산': 'Busan',
  '인천': 'Incheon',
  '대구': 'Daegu',
  '대전': 'Daejeon',
  '광주': 'Gwangju',
  '울산': 'Ulsan',
  '경기': 'Gyeonggi',
  '강원': 'Gangwon',
  '충북': 'Chungbuk',
  '충남': 'Chungnam',
  '전북': 'Jeonbuk',
  '전남': 'Jeonnam',
  '경북': 'Gyeongbuk',
  '경남': 'Gyeongnam',
  '제주': 'Jeju',
  '세종': 'Sejong',
};

export const VEHICLE_TYPE_MAP: Record<string, string> = {
  '세단': 'Sedan',
  'SUV': 'SUV',
  '해치백': 'Hatchback',
  '왜건': 'Wagon',
  '쿠페': 'Coupe',
  '컨버터블': 'Kabriolet',
  '카브리올레': 'Kabriolet',
  '승합': 'Van',
  '픽업': 'Pickup',
  '버스': 'Autobus',
  '트럭': 'Kamion',
  '밴': 'Van',
  '미니밴': 'Minivan',
  '소형': 'E vogël',
  '중형': 'E mesme',
  '대형': 'E madhe',
};

export const DRIVE_TYPE_MAP: Record<string, string> = {
  '2WD': '2WD (Dyshe)',
  '4WD': '4WD (Katërshe)',
  'AWD': 'AWD (Gjithëterren)',
  'FWD': 'FWD (Përpara)',
  'RWD': 'RWD (Prapa)',
};

export const PANEL_STATUS_MAP: Record<string, string> = {
  '1': 'Origjinal', 'X': 'Origjinal',
  '2': 'Ripikturuar', 'W': 'Ripikturuar',
  '3': 'Zëvendësuar', 'C': 'Zëvendësuar',
  '4': 'Riparuar pas aksidentit', 'A': 'Riparuar pas aksidentit',
};

export const OPTION_MAP: Record<string, string> = {
  '내비게이션': 'Navigacion',
  '후방카메라': 'Kamera prapa',
  '전방카메라': 'Kamera para',
  '360도카메라': 'Kamera 360°',
  '열선시트': 'Ulëse me ngrohje',
  '통풍시트': 'Ulëse me ventilim',
  '전동시트': 'Ulëse elektrike',
  '선루프': 'Çati panoramike',
  '파노라마선루프': 'Çati panoramike',
  '썬루프': 'Sunroof',
  '리어선루프': 'Sunroof prapa',
  '가죽시트': 'Ulëse lëkure',
  '스마트키': 'Çelës inteligjent',
  '어댑티브크루즈컨트롤': 'Kontroll automatik shpejtësie',
  '크루즈컨트롤': 'Kontroll shpejtësie',
  '주차보조': 'Asistent parkimi',
  '자동주차': 'Parkim automatik',
  '차선유지': 'Mbajtja e korsisë',
  '충돌방지': 'Parandalim aksidentesh',
  '블루투스': 'Bluetooth',
  '애플카플레이': 'Apple CarPlay',
  '안드로이드오토': 'Android Auto',
  '헤드업디스플레이': 'HUD Display',
  '전동트렁크': 'Portbagazhier elektrik',
  '에어서스펜션': 'Suspension ajri',
  '4WD': '4WD',
  'AWD': 'AWD',
  '통합콜': 'Sistem zëri',
  '후측방경보': 'Alarm anësor prapa',
  '고속도로주행보조': 'Asistent autostradë',
  '빌트인캠': 'Kamera e integruar',
  '스마트크루즈': 'Kontroll inteligjent',
  '디지털계기판': 'Panel dixhital',
  '무선충전': 'Karikues me valë',
  '통합충전': 'Karikues i integruar',
  '메모리시트': 'Ulëse me memorie',
  '마사지시트': 'Ulëse masazhi',
  '어드밴스드드라이빙': 'Sistem drejtimi i avancuar',
  '후방충돌경고': 'Alarm goditje prapa',
  '차로이탈경보': 'Alarm dalje nga korsia',
  '사각지대감지': 'Detektim këndi i vdekur',
  '전방충돌경보': 'Alarm goditje para',
  '긴급자동제동': 'Frenazh emergjent',
  '어라운드뷰': 'Pamje rrethore',
  'LED헤드라이트': 'Drita LED',
  '레이더크루즈': 'Kryqëzim me radar',
  '자동긴급제동': 'Frenazh automatik emergjent',
  '차선변경보조': 'Asistent ndryshim korsia',
  '후측방모니터': 'Monitor anësor prapa',
  '원격시동': 'Ndezje në distancë',
  '전자식사이드브레이크': 'Frena parkimi elektronike',
  '어댑티브라이트': 'Drita adaptive',
  '파워트렁크': 'Portbagazhier elektrik',
  '전동접이사이드미러': 'Pasqyra elektrike palosëse',
  '통합주행안전': 'Sistem sigurie drejtimi',
  '야간투시': 'Vizion nate',
  '주행거리제한': 'Kufizim distance',
  '스포츠시트': 'Ulëse sportive',
  '통기사이드미러': 'Pasqyra me ngrohje',
  '열선핸들': 'Timon me ngrohje',
};

// ── Brand list for filter sidebar ────────────────────────────────────────────

export const POPULAR_BRANDS: { label: string; encarValue: string }[] = [
  { label: 'BMW', encarValue: 'BMW' },
  { label: 'Mercedes-Benz', encarValue: '벤츠' },
  { label: 'Audi', encarValue: '아우디' },
  { label: 'Volkswagen', encarValue: '폭스바겐' },
  { label: 'Hyundai', encarValue: '현대' },
  { label: 'Kia', encarValue: '기아' },
  { label: 'Genesis', encarValue: '제네시스' },
  { label: 'Toyota', encarValue: '토요타' },
  { label: 'Lexus', encarValue: '렉서스' },
  { label: 'Honda', encarValue: '혼다' },
  { label: 'Porsche', encarValue: '포르쉐' },
  { label: 'Land Rover', encarValue: '랜드로버' },
  { label: 'Volvo', encarValue: '볼보' },
  { label: 'Tesla', encarValue: '테슬라' },
  { label: 'Chevrolet', encarValue: '쉐보레' },
];

// ── Fuel options for filter (display → API value) ────────────────────────────

export const FUEL_OPTIONS: { label: string; value: string }[] = [
  { label: 'Naftë', value: '디젤' },
  { label: 'Benzinë', value: '가솔린' },
  { label: 'Hibrid', value: '하이브리드' },
  { label: 'Elektrik', value: '전기' },
  { label: 'LPG', value: 'LPG' },
];

// ── Helper functions ─────────────────────────────────────────────────────────

const HANGUL_REGEX = /[ᄀ-ᇿ㄰-㆏가-힯]/g;

export function tr(s: string | undefined, map?: Record<string, string>): string {
  if (!s) return '—';
  if (map && map[s]) return map[s];
  const stripped = s.replace(HANGUL_REGEX, '').trim();
  return stripped || '—';
}

export function translateManufacturer(s: string): string {
  return MANUFACTURER_MAP[s] ?? s;
}

export function translateFuel(s: string): string {
  return FUEL_MAP[s] ?? tr(s);
}

export function translateTrans(s: string): string {
  return TRANS_MAP[s] ?? s;
}

export function translateColor(s: string): string {
  return COLOR_MAP[s] ?? tr(s);
}

export function translateRegion(s: string): string {
  return REGION_MAP[s] ?? s;
}

export function translateOption(name: string): string {
  return OPTION_MAP[name] ?? tr(name);
}

export function panelClass(status: string | undefined): string {
  if (!status) return 'panel-none';
  const s = status.toUpperCase();
  if (s === '1' || s === 'X') return 'panel-ok';
  if (s === '2' || s === 'W') return 'panel-paint';
  if (s === '3' || s === 'C') return 'panel-rep';
  if (s === '4' || s === 'A') return 'panel-acc';
  return 'panel-none';
}

export function panelLabel(status: string | undefined): string {
  if (!status) return '—';
  return PANEL_STATUS_MAP[status.toUpperCase()] ?? '—';
}

// 만원 → EUR (1 EUR ≈ 1450 KRW)
const KRW_PER_EUR = 1450;

export function krwToEur(manwon: number): number {
  return Math.round((manwon * 10000) / KRW_PER_EUR);
}

export function fmtEur(eur: number): string {
  return '€' + eur.toLocaleString('de-DE');
}

export function fmtKm(km: number): string {
  return km.toLocaleString('de-DE') + ' km';
}

export interface PriceBreakdown {
  carPrice: number;
  shipping: number;
  customs: number;
  vat: number;
  registration: number;
  total: number;
  note?: string;
}

export function kosovoPriceBreakdown(eurPrice: number): PriceBreakdown {
  const shipping = 1000;
  const customs = Math.round((eurPrice + shipping) * 0.10);
  const vat = Math.round((eurPrice + shipping + customs) * 0.18);
  const registration = 150;
  const total = eurPrice + shipping + customs + vat + registration;
  return { carPrice: eurPrice, shipping, customs, vat, registration, total };
}

export function albaniaPriceBreakdown(eurPrice: number, year: number): PriceBreakdown {
  const currentYear = new Date().getFullYear();
  const isOld = currentYear - year > 10;
  const shipping = 850;
  const customsRate = isOld ? 0.05 : 0.05;
  const customs = Math.round(eurPrice * customsRate);
  const vat = Math.round((eurPrice + shipping + customs) * 0.20);
  const registration = 120;
  const total = eurPrice + shipping + customs + vat + registration;
  const note = isOld ? 'Makinë mbi 10 vjeç — shkallë e reduktuar doganore' : undefined;
  return { carPrice: eurPrice, shipping, customs, vat, registration, total, note };
}

export function photoUrl(path: string): string {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  // Base-path format from search results ends with `_` — append first photo suffix
  const normalised = path.endsWith('_') ? `${path}001.jpg` : path;
  return `https://ci.encar.com${normalised}`;
}

/** Returns the best available photo URL from a car object */
export function carPhotoUrl(car: { Photo?: string; Photos?: { location?: string; RealName?: string }[] }): string {
  const first = car.Photos?.[0];
  const path = first?.location ?? first?.RealName ?? car.Photo;
  return path ? photoUrl(path) : '/placeholder.svg';
}

export function carDisplayName(manufacturer: string, model: string, badge?: string): string {
  const mfr = translateManufacturer(manufacturer);
  const mdl = tr(model);
  const bdg = badge ? tr(badge) : '';
  return [mfr, mdl !== '—' ? mdl : '', bdg !== '—' ? bdg : ''].filter(Boolean).join(' ');
}

export function formatFormYear(formYear: string): string {
  if (!formYear || formYear.length < 4) return formYear ?? '—';
  const y = formYear.slice(0, 4);
  const m = formYear.slice(4, 6);
  return m ? `${y}/${m}` : y;
}
