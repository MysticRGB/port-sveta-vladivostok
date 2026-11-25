const evenings=[
  [['21:00–21:15','Музыкально-световое шоу открытия'],['21:15–21:30','Официальное открытие и представление финалистов'],['21:30–22:10','Основной показ конкурсных работ'],['22:10–22:40','Старт голосования и повтор программы'],['22:40–23:00','Музыка, встречи и анонс второго дня']],
  [['21:00–21:40','Финальный показ конкурсных работ'],['21:40–22:00','Завершение голосования и подведение итогов жюри'],['22:00–22:20','Внеконкурсный мэпинг-спектакль организаторов'],['22:20–22:40','Награждение победителей'],['22:40–23:00','Финальное светомедийное шоу и закрытие']]
];
function showEvening(day){
 const rows=evenings[day].map(([range,title])=>{
   const row=document.createElement('div'),time=document.createElement('time'),name=document.createElement('strong');
   row.className='show';time.dateTime=range.slice(0,5);time.textContent=range;name.textContent=title;row.append(time,name);return row;
 });
 document.querySelector('#shows').replaceChildren(...rows);
 document.querySelectorAll('[data-day]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.day)===day)));
}
document.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>showEvening(Number(b.dataset.day))));showEvening(0);


const stops = [
  { name: 'Мастерская', place: 'Квартал Миллионка', coords: [43.11955, 131.88115], kind: 'Образование', copy: 'В одном из помещений квартала предлагаем собрать дневную мастерскую. Здесь можно спроецировать свою сцену на макет здания и подготовить её к вечернему показу.', status: 'Предложение · помещение подбирается' },
  { name: 'Зал приливов', place: 'Светланская, 5', coords: [43.117071, 131.880636], kind: 'В помещении', copy: 'Вариант площадки для инсталляции — галерея «Арка». Полоса света поднимается по стенам затемнённого зала, а записи с причалов ведут зрителя от входа к выходу.', status: 'Предложение · галерея «Арка»' },
  { name: 'Сигналы порта', place: 'Улица Адмирала Фокина', coords: [43.117525, 131.882732], kind: 'На улице', copy: 'На пешеходном участке предлагаем поставить световые створы. Издалека они сходятся в один квадрат. Во время прогулки каждый створ открывается под новым углом.', status: 'Предложение · пешеходная улица' },
  { name: 'Конкурс мэпинга', place: 'Дальрыбвтуз', coords: [43.116162, 131.885112], kind: 'На фасаде', copy: 'Два вечера работ финалистов, зрительское голосование и награждение на углу Светланской улицы и Океанского проспекта.', status: 'Площадка в конкурсном плане' },
  { name: 'Шоу на воде', place: 'Корабельная набережная', coords: [43.1129187, 131.8905407], kind: 'На воде', copy: 'Предлагаем смотреть шоу на барже с берега бухты Золотой Рог. Метка показывает возможную точку для зрителей. Место установки баржи уточняется.', status: 'Предложение · точка обзора с берега' }
];
const map = L.map('city-map', {
  attributionControl: false, zoomControl: false, scrollWheelZoom: false,
  zoomSnap: 0.05, zoomDelta: 0.75, maxZoom: 18.5, zoomAnimation: false,
  maxBoundsViscosity: 1, keyboard: true
});
const coverage = L.latLngBounds([43.109, 131.873], [43.124, 131.898]);
const stopBounds = L.latLngBounds(stops.map(stop => stop.coords));
map.setMaxBounds(coverage);
L.imageOverlay('./media/vladivostok.svg', coverage, {interactive: false}).addTo(map);
L.control.zoom({position:'bottomleft', zoomInTitle:'Приблизить карту', zoomOutTitle:'Отдалить карту'}).addTo(map);
L.control.attribution({position:'bottomright', prefix:false}).addTo(map)
  .addAttribution('<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap</a>');
const places = [
  ['Миллионка', 43.12075, 131.88064],
  ['Светланская ул.', 43.11585, 131.88111],
  ['Семёновская ул.', 43.11920, 131.88670],
  ['Центральная площадь', 43.11540, 131.88674],
  ['Золотой Рог', 43.11129, 131.88923]
];
for (const [name,lat,lng] of places) {
  const icon = L.divIcon({className:'place-label', html:name, iconSize:[0,0], iconAnchor:[0,0]});
  L.marker([lat,lng], {icon, interactive:false, keyboard:false, zIndexOffset:-2000}).addTo(map);
}
const markerButtons = [], listButtons = [];
const routeCard = document.querySelector('.route-card');
const stackedMap = window.matchMedia('(max-width:780px)');
function chooseStop(index, centerIfHidden) {
  const stop = stops[index];
  document.getElementById('point-kind').textContent = stop.kind;
  document.getElementById('point-title').textContent = stop.place;
  document.getElementById('point-copy').textContent = stop.copy;
  document.getElementById('point-status').textContent = stop.status;
  for (const [i, button] of markerButtons.entries()) {
    button.setAttribute('aria-pressed', String(i === index));
    listButtons[i].setAttribute('aria-pressed', String(i === index));
  }
  if (centerIfHidden && !map.getBounds().pad(-0.1).contains(stop.coords)) map.panTo(stop.coords);
}
function fitStops() {
  map.invalidateSize({pan:false});
  const min = map.getBoundsZoom(coverage, true);
  map.setMinZoom(min);
  map.fitBounds(stopBounds, {paddingTopLeft:[36,38], paddingBottomRight:[48,38], animate:false});
}
fitStops();
for (const [index, stop] of stops.entries()) {
  const pin = document.createElement('button');
  pin.type = 'button'; pin.className = 'pin'; pin.textContent = String(index + 1).padStart(2,'0');
  pin.title = stop.name + ' — ' + stop.place;
  pin.setAttribute('aria-label', pin.title);
  const icon = L.divIcon({className:'stop-marker', html:pin, iconSize:[40,40], iconAnchor:[20,20]});
  L.marker(stop.coords, {icon,keyboard:false}).addTo(map);
  L.DomEvent.disableClickPropagation(pin);
  pin.addEventListener('click', () => {
    chooseStop(index, false);
    if (stackedMap.matches && routeCard.getBoundingClientRect().bottom > window.innerHeight) {
      routeCard.scrollIntoView({block: 'nearest'});
    }
  });
  markerButtons.push(pin);
  const button = document.createElement('button'); button.type='button'; button.textContent=pin.textContent+'  '+stop.name;
  button.addEventListener('click', () => chooseStop(index,true));
  document.getElementById('route-list').append(button); listButtons.push(button);
}
chooseStop(0, false);
new ResizeObserver(fitStops).observe(document.getElementById('city-map'));
document.querySelector('.map-reset').addEventListener('click', fitStops);
