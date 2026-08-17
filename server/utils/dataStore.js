const fs = require('fs');
const path = require('path');

class DataStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = new Map();
    this._writePromise = Promise.resolve();
    this._pendingSave = false;
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileData = fs.readFileSync(this.filePath, 'utf8');
        const jsonData = JSON.parse(fileData);
        this.data = new Map(Object.entries(jsonData));
        console.log(`✅ Loaded ${this.data.size} assessments from disk`);
        console.log(`📁 Data file location: ${this.filePath}`);
        console.log(`💾 File size: ${(fs.statSync(this.filePath).size / 1024).toFixed(2)} KB`);
      } else {
        console.log('📝 No existing data file found, starting fresh');
        console.log(`📁 Will create new file at: ${this.filePath}`);
      }
    } catch (error) {
      console.error('❌ Error loading data from disk:', error);
      console.error('❌ File path:', this.filePath);
      
      // Try to recover from backup if available
      const backupPath = this.filePath + '.backup';
      if (fs.existsSync(backupPath)) {
        console.log('🔄 Attempting to restore from backup...');
        try {
          const backupData = fs.readFileSync(backupPath, 'utf8');
          const jsonData = JSON.parse(backupData);
          this.data = new Map(Object.entries(jsonData));
          console.log(`✅ Restored ${this.data.size} assessments from backup`);
          this.saveData();
          return;
        } catch (backupError) {
          console.error('❌ Failed to restore from backup:', backupError);
        }
      }
      
      this.data = new Map();
    }
  }

  saveData() {
    if (this._pendingSave) return;
    this._pendingSave = true;

    // Queue write asynchronously to avoid blocking Node.js event loop
    this._writePromise = this._writePromise.then(async () => {
      this._pendingSave = false;
      try {
        const jsonData = Object.fromEntries(this.data);
        const dirPath = path.dirname(this.filePath);
        
        await fs.promises.mkdir(dirPath, { recursive: true });
        
        // Backup existing file asynchronously
        try {
          if (fs.existsSync(this.filePath)) {
            await fs.promises.copyFile(this.filePath, this.filePath + '.backup');
          }
        } catch (backupError) {
          console.warn('⚠️  Failed to create backup:', backupError.message);
        }
        
        // Atomic write via temporary file
        const tempPath = this.filePath + '.tmp';
        await fs.promises.writeFile(tempPath, JSON.stringify(jsonData, null, 2), 'utf8');
        await fs.promises.rename(tempPath, this.filePath);
      } catch (error) {
        console.error('❌ CRITICAL: Error saving data asynchronously to disk:', error);
      }
    });
  }

  isDirectoryWritable(dirPath) {
    try {
      fs.accessSync(dirPath, fs.constants.W_OK);
      return true;
    } catch {
      return false;
    }
  }

  set(key, value) {
    console.log(`📝 DataStore.set() called for key: ${key}`);
    console.log(`📝 Current data size before set: ${this.data.size}`);
    this.data.set(key, value);
    console.log(`📝 Current data size after set: ${this.data.size}`);
    console.log(`📝 Calling saveData()...`);
    this.saveData();
    console.log(`📝 saveData() completed`);
  }

  get(key) {
    return this.data.get(key);
  }

  has(key) {
    return this.data.has(key);
  }

  delete(key) {
    const result = this.data.delete(key);
    this.saveData();
    return result;
  }

  values() {
    return this.data.values();
  }

  keys() {
    return this.data.keys();
  }

  clear() {
    this.data.clear();
    this.saveData();
  }

  get size() {
    return this.data.size;
  }

  getAll() {
    return Object.fromEntries(this.data);
  }

  entries() {
    return this.data.entries();
  }
}

module.exports = DataStore;

