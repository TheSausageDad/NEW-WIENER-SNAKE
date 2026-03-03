// Play.fun (OpenGameProtocol) integration
// Wires game events to Play.fun points tracking

const GAME_ID = '15aa8543-2a14-424a-9017-18eb6cfb05cc';

let sdk = null;
let initialized = false;

export async function initPlayFun() {
  if (typeof OpenGameSDK === 'undefined') {
    console.warn('Play.fun SDK not loaded — skipping');
    return;
  }

  sdk = new OpenGameSDK({
    gameId: GAME_ID,
    ui: { usePointsWidget: true },
  });

  await sdk.init();
  initialized = true;
  console.log('Play.fun SDK initialized');
}

export function addPlayFunPoints(points) {
  if (sdk && initialized && points > 0) {
    sdk.addPoints(points);
  }
}

export function savePlayFunPoints() {
  if (sdk && initialized) {
    sdk.savePoints();
  }
}

// Save on page unload
window.addEventListener('beforeunload', () => {
  savePlayFunPoints();
});
