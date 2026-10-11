import { ref } from 'vue';

export type MobileDrawer = 'left' | 'right';

export const activeMobileDrawer = ref<MobileDrawer | null>(null);
export const drawerProgress = ref(0);
export const drawerOffset = ref(0);
export const isDrawerDragging = ref(false);

interface DrawerGesture {
  pointerId: number;
  drawer: MobileDrawer;
  action: 'open' | 'close';
  startX: number;
  startY: number;
  lastX: number;
  lastTime: number;
  velocityX: number;
  width: number;
  horizontal: boolean;
}

const EDGE_SAFE_WIDTH = 24;
const EDGE_SWIPE_WIDTH = 44;
const DRAG_THRESHOLD = 0.35;
const VELOCITY_THRESHOLD = 0.5;
const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [contenteditable="true"]';

function setScrollLock(lock: boolean): void {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = lock ? 'hidden' : '';
}

export function toggleMobileDrawer(drawer: MobileDrawer): void {
  if (activeMobileDrawer.value === drawer) {
    closeMobileDrawer();
    return;
  }

  activeMobileDrawer.value = drawer;
  drawerProgress.value = 1;
  drawerOffset.value = 0;
  isDrawerDragging.value = false;
  setScrollLock(true);
}

export function closeMobileDrawer(): void {
  activeMobileDrawer.value = null;
  drawerProgress.value = 0;
  drawerOffset.value = 0;
  isDrawerDragging.value = false;
  setScrollLock(false);
}

export function installMobileDrawerGestures(): () => void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return () => {};

  let gesture: DrawerGesture | null = null;

  function onPointerDown(event: PointerEvent): void {
    if (
      gesture ||
      !event.isPrimary ||
      (event.pointerType !== 'touch' && event.pointerType !== 'pen') ||
      !window.matchMedia('(max-width: 960px)').matches ||
      (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR))
    ) {
      return;
    }

    const width = window.innerWidth;
    let drawer: MobileDrawer | null = null;
    let action: DrawerGesture['action'] = 'open';
    let panel: HTMLElement | null = null;

    if (activeMobileDrawer.value) {
      drawer = activeMobileDrawer.value;
      panel = document.querySelector<HTMLElement>(drawer === 'left' ? '.sidebar-left' : '.sidebar-right');
      if (!panel || !(event.target instanceof Node) || !panel.contains(event.target)) return;
      action = 'close';
    } else if (
      event.clientX >= EDGE_SAFE_WIDTH &&
      event.clientX <= EDGE_SAFE_WIDTH + EDGE_SWIPE_WIDTH
    ) {
      drawer = 'left';
      panel = document.querySelector<HTMLElement>('.sidebar-left');
    } else if (
      event.clientX <= width - EDGE_SAFE_WIDTH &&
      event.clientX >= width - EDGE_SAFE_WIDTH - EDGE_SWIPE_WIDTH
    ) {
      drawer = 'right';
      panel = document.querySelector<HTMLElement>('.sidebar-right');
    }

    if (!drawer || !panel) return;

    gesture = {
      pointerId: event.pointerId,
      drawer,
      action,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocityX: 0,
      width: panel.offsetWidth || Math.min(280, width - 48),
      horizontal: false,
    };
  }

  function onPointerMove(event: PointerEvent): void {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    if (gesture.horizontal && activeMobileDrawer.value !== gesture.drawer) {
      gesture = null;
      isDrawerDragging.value = false;
      return;
    }

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;
    if (!gesture.horizontal) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 8) return;
      if (Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) {
        gesture = null;
        return;
      }

      const opensTowardRight = gesture.drawer === 'left';
      const openingDirection = opensTowardRight ? deltaX > 0 : deltaX < 0;
      if ((gesture.action === 'open') !== openingDirection) {
        gesture = null;
        return;
      }

      gesture.horizontal = true;
      isDrawerDragging.value = true;
      if (gesture.action === 'open') {
        activeMobileDrawer.value = gesture.drawer;
        drawerProgress.value = 0;
        drawerOffset.value = 0;
        setScrollLock(true);
      }
    }

    if (event.cancelable) event.preventDefault();

    const now = event.timeStamp;
    const elapsed = Math.max(1, now - gesture.lastTime);
    gesture.velocityX = (event.clientX - gesture.lastX) / elapsed;
    gesture.lastX = event.clientX;
    gesture.lastTime = now;

    const openingDistance = gesture.drawer === 'left' ? deltaX : -deltaX;
    const progress =
      gesture.action === 'open'
        ? openingDistance / gesture.width
        : 1 + openingDistance / gesture.width;
    drawerProgress.value = Math.max(0, Math.min(1, progress));
    drawerOffset.value = drawerProgress.value * gesture.width;
  }

  function onPointerUp(event: PointerEvent): void {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    const current = gesture;
    gesture = null;
    if (!current.horizontal) return;

    const openingVelocity = current.drawer === 'left' ? current.velocityX : -current.velocityX;
    if (current.action === 'open') {
      const shouldOpen =
        drawerProgress.value >= DRAG_THRESHOLD || openingVelocity >= VELOCITY_THRESHOLD;
      isDrawerDragging.value = false;
      if (shouldOpen) {
        activeMobileDrawer.value = current.drawer;
        drawerProgress.value = 1;
        drawerOffset.value = current.width;
        setScrollLock(true);
      } else {
        closeMobileDrawer();
      }
      return;
    }

    const shouldClose =
      drawerProgress.value <= 1 - DRAG_THRESHOLD || openingVelocity <= -VELOCITY_THRESHOLD;
    isDrawerDragging.value = false;
    if (shouldClose) {
      closeMobileDrawer();
    } else {
      activeMobileDrawer.value = current.drawer;
      drawerProgress.value = 1;
      drawerOffset.value = current.width;
      setScrollLock(true);
    }
  }

  document.addEventListener('pointerdown', onPointerDown, { passive: true });
  document.addEventListener('pointermove', onPointerMove, { passive: false });
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp);

  return () => {
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerUp);
    gesture = null;
    if (isDrawerDragging.value) closeMobileDrawer();
  };
}
