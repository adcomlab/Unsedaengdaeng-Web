// 무료운세댕댕 웹 푸시 Service Worker
// Flutter Web에서 firebase_messaging 동작을 위해 필요.
// Firebase Console → Cloud Messaging → Web Push certificates 에서 VAPID 키를 발급받아
// 빌드 시 --dart-define=FCM_VAPID_KEY=... 로 주입한다.

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDb0EVqKKgB95KLfmYAsy5G3uvdi1MBwQk',
  appId: '1:404204334970:android:8aba1b313c8ae2f34270c3',
  messagingSenderId: '404204334970',
  projectId: 'unsedd-65be3',
  storageBucket: 'unsedd-65be3.firebasestorage.app',
});

const messaging = firebase.messaging();

// 백그라운드 메시지 수신 — notification 페이로드가 있으면 브라우저가 자동 표시하지만
// 커스텀 아이콘/데이터 포함을 위해 명시 처리.
messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const title = notification.title || '무료운세댕댕';
  const options = {
    body: notification.body || '',
    icon: '/icons/Icon-192.png',
    badge: '/icons/Icon-192.png',
    data: payload.data || {},
  };
  self.registration.showNotification(title, options);
});

// 알림 클릭 → 해당 결과 화면으로 이동
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const targetUrl = buildTargetUrl(data);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.focus();
          if (targetUrl && 'navigate' in client) {
            client.navigate(targetUrl);
          }
          return;
        }
      }
      if (clients.openWindow && targetUrl) {
        return clients.openWindow(targetUrl);
      }
    }),
  );
});

function buildTargetUrl(data) {
  // Flutter 기본 hash URL 전략 — '/#/' 접두사 사용
  switch (data.kind) {
    case 'saju':
      return data.sajuId ? `/#/main/saju/${data.sajuId}` : '/';
    case 'compatibility':
      return data.compatibilityId
        ? `/#/compatibility/result/${data.compatibilityId}`
        : '/';
    case 'fortune_daily':
      return data.sajuId ? `/#/main/fortune/daily/${data.sajuId}` : '/';
    case 'fortune_yearly':
      return data.sajuId ? `/#/main/fortune/yearly/${data.sajuId}` : '/';
    case 'gift_received':
    case 'gift_accepted':
    case 'gift_returned':
      return '/#/gift/received';
    default:
      return '/';
  }
}
