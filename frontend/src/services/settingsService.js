import api from './api';

class SettingsService {
  async getSettings() {
    const response = await api.get('/api/settings');
    return response;
  }

  async updateSettings(settings) {
    const response = await api.put('/api/settings', settings);
    return response;
  }
}

const settingsService = new SettingsService();
export default settingsService; 