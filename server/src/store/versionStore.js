/**
 * RYZE AI — Version Store
 * In-memory version history for rollback support.
 */

class VersionStore {
  constructor() {
    this.versions = [];
    this.currentIndex = -1;
  }

  save({ code, plan, explanation, prompt }) {
    const version = {
      id: this.versions.length + 1,
      code,
      plan,
      explanation,
      prompt,
      timestamp: new Date().toISOString(),
    };

    // If we rolled back and then generate new, discard forward history
    if (this.currentIndex < this.versions.length - 1) {
      this.versions = this.versions.slice(0, this.currentIndex + 1);
    }

    this.versions.push(version);
    this.currentIndex = this.versions.length - 1;
    return version;
  }

  getAll() {
    return this.versions.map(v => ({
      id: v.id,
      prompt: v.prompt,
      timestamp: v.timestamp,
      isCurrent: this.versions.indexOf(v) === this.currentIndex,
    }));
  }

  getById(id) {
    return this.versions.find(v => v.id === id) || null;
  }

  getCurrent() {
    if (this.currentIndex < 0) return null;
    return this.versions[this.currentIndex];
  }

  rollback(id) {
    const idx = this.versions.findIndex(v => v.id === id);
    if (idx < 0) return null;
    this.currentIndex = idx;
    return this.versions[idx];
  }

  clear() {
    this.versions = [];
    this.currentIndex = -1;
  }
}

// Singleton instance
const store = new VersionStore();
export default store;
