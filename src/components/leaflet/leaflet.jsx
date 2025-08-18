import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const routes = {
  武汉: { latitude: 30.504124, longitude: 114.448153 },
  宜昌: { latitude: 30.690556, longitude: 111.277778 },
  宣恩: { latitude: 29.986878, longitude: 109.489945 },
  重庆: { latitude: 29.563333, longitude: 106.55 },
  成都: { latitude: 30.578994, longitude: 104.072747 },
  陇南: { latitude: 33.343889, longitude: 104.982778 },
  临夏: { latitude: 35.592778, longitude: 103.348611 },
  刘家峡: { latitude: 35.931389, longitude: 103.341389 },
  黄洮交汇: { latitude: 35.883333, longitude: 103.25 },
  炳灵寺石窟: { latitude: 35.810556, longitude: 103.048333 },
  西宁: { latitude: 36.5675, longitude: 101.754722 },
  塔尔寺: { latitude: 36.480556, longitude: 101.728056 },
  青海湖: { latitude: 36.85, longitude: 99.933333 },
  张掖: { latitude: 38.933333, longitude: 100.45 },
  柳园: { latitude: 40.283333, longitude: 95.133333 },
  瓜洲: { latitude: 40.533333, longitude: 95.766667 },
  榆林窟: { latitude: 40.183333, longitude: 94.75 },
  敦煌: { latitude: 40.133333, longitude: 94.483333 },
  大柴旦: { latitude: 37.833333, longitude: 95.3 },
  黑独山: { latitude: 38.016667, longitude: 94.85 },
  冷湖: { latitude: 38.7, longitude: 93.25 },
  茫崖市: { latitude: 38.483333, longitude: 90.95 },
  若羌县: { latitude: 39.033333, longitude: 88.15 },
  且末: { latitude: 38.133333, longitude: 85.516667 },
  塔中: { latitude: 39.016667, longitude: 83.65 },
  民丰: { latitude: 37.075, longitude: 82.633333 },
  和田: { latitude: 37.116667, longitude: 79.916667 },
  叶城: { latitude: 37.883333, longitude: 77.05 },
  莎车: { latitude: 38.483333, longitude: 77.25 },
  小刀村: { latitude: 39.466667, longitude: 75.933333 },
  喀什: { latitude: 39.481667, longitude: 75.978333 },
  喀什古城: { latitude: 39.478333, longitude: 75.981667 },
  奥依塔克冰川: { latitude: 38.35, longitude: 75.216667 },
  塔县: { latitude: 37.766667, longitude: 75.233333 },
  红其拉甫: { latitude: 37.033333, longitude: 75.556111 },
  盘龙古道: { latitude: 37.633358, longitude: 75.529773 },
  班迪尔湖: { latitude: 37.6, longitude: 75.3 },
  帕米尔之眼: { latitude: 37.483333, longitude: 75.15 },
  塔合曼湿地: { latitude: 37.683333, longitude: 75.266667 },
  树洞公路: { latitude: 37.716667, longitude: 75.25 },
  慕士塔格冰川: { latitude: 38.166667, longitude: 75.033333 },
  喀拉库勒湖: { latitude: 38.116667, longitude: 75.083333 },
  白沙湖: { latitude: 38.233333, longitude: 75.116667 },
  木吉火山: { latitude: 38.416667, longitude: 74.75 },
  西极乌恰: { latitude: 39.819659, longitude: 74.1069 },
  阿克苏: { latitude: 41.125, longitude: 80.266667 },
  温宿大峡谷: { latitude: 41.533333, longitude: 79.95 },
  库车: { latitude: 41.75, longitude: 82.966667 },
  库车大寺: { latitude: 41.748333, longitude: 82.965 },
  克孜尔千佛洞: { latitude: 41.733333, longitude: 82.433333 },
  巴音布鲁克: { latitude: 43.016667, longitude: 84.05 },
  独山子: { latitude: 44.291667, longitude: 85.158333 },
  乌鲁木齐: { latitude: 43.825556, longitude: 87.616667 },
};

const geojsonFeature = {
  type: 'Feature',
  properties: {
    name: 'Coors Field',
    amenity: 'Baseball Stadium',
    popupContent: 'this is where the Rockies play',
  },
  geometry: {
    type: 'Point',
    coordinates: [114, 31],
  },
};

const geoLines = [
  {
    type: 'LineString',
    coordinates: Object.values(routes).map(({ latitude, longitude }) => [
      latitude,
      longitude,
    ]),
  },
  {
    type: 'LineString',
    coordinates: [
      [114, 30],
      [113.8, 29.9],
      [114.2, 29.9],
    ],
  },
];

export default function Leaflet() {
  const initLeafletMap = (latitude, longtitude) => {
    const map = L.map('leaflet-map').fitWorld(); //setView([latitude, longtitude], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.locate({ setView: true, maxZoom: 13 });

    map.on('locationfound', (e) => {
      const { latlng, accuracy } = e;
      // L.marker(latlng)
      //   .addTo(map)
      //   .bindPopup('yoou are within ' + accuracy + ' meters from this point')
      //   .openPopup;

      // L.circle(latlng, accuracy).addTo(map);

      // L.geoJSON(geojsonFeature).addTo(map);

      // const myLayer = L.geoJSON(geoLines, {
      //   color: 'red',
      //   weight: 5,
      // }).addTo(map);

      const names = Object.keys(routes);
      const latlngs = Object.values(routes).map(({ latitude, longitude }) => [
        latitude,
        longitude,
      ]);
      latlngs.forEach(([latitude, longitude], index) => {
        L.marker([latitude, longitude])
          .addTo(map)
          .bindTooltip(
            `<div>${names[index]}</div><div>纬度: ${latitude}</div><div>经度: ${longitude}</div>`,
          );
      });
      const curvePaths = ['M', latlngs[0]];
      for (let i = 1; i < latlngs.length; i++) {
        const [prev, curr] = [latlngs[i - 1], latlngs[i]];
        const c1 = [
          (prev[0] + curr[0]) / 2 + (curr[1] - prev[1]) * 0.02,
          (prev[1] + curr[1]) / 2 - (curr[0] - prev[0]) * 0.02,
        ];
        const c2 = [
          (prev[0] + curr[0]) / 2 + (curr[1] - prev[1]) * 0.01,
          (prev[1] + curr[1]) / 2 - (curr[0] - prev[0]) * 0.01,
        ];
        curvePaths.push('C', c1, c2, curr);
      }

      // version incompatible
      // L.curve(curvePaths, {
      //   color: 'red',
      //   weight: 3,
      //   dashArray: '5,5',
      //   lineCap: 'round',
      // }).addTo(map);

      const polyline = L.polyline(latlngs).addTo(map);
      map.fitBounds(polyline.getBounds());
    });

    // const commonPopup = L.popup();
    // map.on('click', (e) => {
    //   console.log(e);
    //   commonPopup
    //     .setLatLng(e.latlng)
    //     .setContent('click Position ' + e.latlng.toString())
    //     .openOn(map);
    // });

    // const marker = L.marker([latitude, longtitude]).addTo(map);

    // const circle = L.circle([latitude, longtitude], {
    //   color: 'red',
    //   fillColor: '#f03',
    //   fillOpacity: 0.5,
    //   radius: 500,
    // }).addTo(map);

    // const polygon = L.polygon([
    //   [latitude + 0.1, longtitude + 0.1],
    //   [latitude - 0.1, longtitude + 0.1],
    //   [latitude, longtitude],
    // ]).addTo(map);

    // marker.bindPopup('<b>Hello</b><br>I am a popup</br>');
    // circle.bindPopup('i am a circle');
    // polygon.bindPopup('i am a polygon');

    // const popup = L.popup()
    //   .setLatLng([latitude, longtitude - 0.1])
    //   .setContent('i am a popup')
    //   .openOn(map);
  };

  useEffect(() => {
    initLeafletMap();
  }, []);

  return (
    <div
      id="leaflet-map"
      style={{ height: '100%', border: '1px solid', overflow: 'auto' }}
    ></div>
  );
}
