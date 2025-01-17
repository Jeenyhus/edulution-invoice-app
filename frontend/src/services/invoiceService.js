import api from './api';

class InvoiceService {
  async getInvoices() {
    const response = await api.get('/api/invoices');
    return response.data;
  }

  async createInvoice(data) {
    const response = await api.post('/api/invoices', data);
    return response.data;
  }

  async updateInvoice(id, data) {
    const response = await api.put(`/api/invoices/${id}`, data);
    return response.data;
  }

  async deleteInvoice(id) {
    const response = await api.delete(`/api/invoices/${id}`);
    return response.data;
  }
}

export const invoiceService = new InvoiceService(); 