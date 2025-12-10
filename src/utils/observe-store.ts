type EventType = string | symbol;
type EventHandler<T = any> = (payload: T) => void

class ObserveStore {
  private events: Map<EventType, Set<EventHandler>>;
  constructor() {
    this.events = new Map()
  }
  on<T = any>(event: EventType, handler: EventHandler<T>) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);
  }
  emit<T = any>(event: EventType, payload?: T) {
    if (!this.events.has(event)) {
      return;
    }
    const handlers = new Set(this.events.get(event)!);
    handlers.forEach((handler) => {
      handler(payload!);
    });
  }
}
export default new ObserveStore();
