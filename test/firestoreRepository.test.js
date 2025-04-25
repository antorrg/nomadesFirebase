const fakeDb = {}; // Inicializamos fakeDb aquí primero

vi.mock('../src/api/ClassesFunctions/firebaseConfig', () => ({
  db: fakeDb,
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  orderBy: vi.fn(),
  writeBatch: vi.fn(() => ({
    commit: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));
// Ahora importamos nuestro módulo y los helpers de prueba
import * as firestore from 'firebase/firestore';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FirestoreRepository from '../src/api/ClassesFunctions/FirestoreRepository';

describe('FirestoreRepository', () => {
  let repo;

  beforeEach(() => {
    firestore.collection.mockReturnValue('collectionRef');
    repo = new FirestoreRepository('testCollection');
  });

  it('should get all documents', async () => {
    const fakeSnapshot = {
      empty: false,
      docs: [fakeDoc]
    };
    firestore.getDocs.mockResolvedValue(fakeSnapshot);

    const result = await repo.getAll();
    expect(result).toEqual([{ id: '123', name: 'Test' }]);
  });

  it('should return emptyHandler when no documents', async () => {
    firestore.getDocs.mockResolvedValue({ empty: true });

    const result = await repo.getAll();
    expect(result).toEqual([]);
  });

  it('should get document by ID', async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      id: 'abc',
      data: () => ({ title: 'Hello' })
    });

    const result = await repo.getById('abc');
    expect(result).toEqual({ id: 'abc', title: 'Hello' });
  });

  it('should get document by conditions', async () => {
    firestore.getDocs.mockResolvedValue({
      empty: false,
      docs: [fakeDoc]
    });

    const result = await repo.getOne({ field: 'name', operator: '==', value: 'Test' });
    expect(result).toEqual([{ id: '123', name: 'Test' }]);
  });

  it('should create document with custom ID', async () => {
    const mockSetDoc = vi.fn();
    firestore.doc.mockReturnValue('docRef');
    firestore.setDoc.mockImplementation(mockSetDoc);

    const result = await repo.create({ name: 'Test' }, 'custom-id');
    expect(result).toMatchObject({ id: 'custom-id', name: 'Test' });
    expect(mockSetDoc).toHaveBeenCalled();
  });

  it('should create document without custom ID', async () => {
    firestore.addDoc.mockResolvedValue({ id: 'new-id' });

    const result = await repo.create({ name: 'Auto' });
    expect(result).toMatchObject({ id: 'new-id', name: 'Auto' });
  });

  it('should update document', async () => {
    const mockUpdateDoc = vi.fn();
    firestore.doc.mockReturnValue('docRef');
    firestore.getDoc.mockResolvedValue({ exists: () => true, data: () => ({ title: 'Test' }) });
    firestore.updateDoc.mockImplementation(mockUpdateDoc);

    const result = await repo.update('123', { title: 'Updated' });
    expect(result).toEqual({ id: '123', title: 'Test', updatedAt: expect.any(Date) });
    expect(mockUpdateDoc).toHaveBeenCalled();
  });

  it('should throw error when updating non-existent document', async () => {
    firestore.getDoc.mockResolvedValue({ exists: () => false });

    await expect(repo.update('non-existent-id', { title: 'Updated' })).rejects.toThrowError();
  });

  it('should delete document', async () => {
    const mockDeleteDoc = vi.fn();
    firestore.doc.mockReturnValue('docRef');
    firestore.getDoc.mockResolvedValue({ exists: () => true });
    firestore.deleteDoc.mockImplementation(mockDeleteDoc);

    const result = await repo.delete('123');
    expect(result).toBe(true);
    expect(mockDeleteDoc).toHaveBeenCalled();
  });

  it('should throw error when deleting non-existent document', async () => {
    firestore.getDoc.mockResolvedValue({ exists: () => false });

    await expect(repo.delete('non-existent-id')).rejects.toThrowError();
  });

  it('should check if document exists by field', async () => {
    const fakeSnapshot = {
      empty: false,
    };
    firestore.getDocs.mockResolvedValue(fakeSnapshot);

    const result = await repo.existsByField('name', 'Test');
    expect(result).toBe(true);
  });

  it('should return false if document does not exist by field', async () => {
    const fakeSnapshot = {
      empty: true,
    };
    firestore.getDocs.mockResolvedValue(fakeSnapshot);

    const result = await repo.existsByField('name', 'Nonexistent');
    expect(result).toBe(false);
  });

  it('should execute batch operations', async () => {
    const mockCommit = vi.fn();
    const mockOperations = vi.fn();
    firestore.writeBatch.mockReturnValue({
      commit: mockCommit
    });

    const result = await repo.executeBatch(mockOperations);
    expect(result).toBe(true);
    expect(mockCommit).toHaveBeenCalled();
  });

  it('should handle errors in batch operations', async () => {
    firestore.writeBatch.mockImplementation(() => {
      throw new Error('Batch error');
    });

    await expect(repo.executeBatch(() => {})).rejects.toThrowError();
  });
});
