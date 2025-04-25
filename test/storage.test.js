// ImageService.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import {ImageService} from "../src/api/ClassesFunctions/ImageService";

vi.mock("../src/api/ClassesFunctions/FirestoreRepository", () => {
  return {
    default: class {
      constructor() {}
      getOne = vi.fn();
      create = vi.fn();
      getAll = vi.fn();
      delete = vi.fn();
      getById = vi.fn();
    }
  };
});

vi.mock("../src/api/ClassesFunctions/firebaseConfig", () => ({
  storage: {}
}));

vi.mock("firebase/storage", () => {
  return {
    ref: vi.fn(() => ({})),
    uploadBytes: vi.fn(() => Promise.resolve()),
    getDownloadURL: vi.fn(() => Promise.resolve("https://example.com/image.jpg")),
    deleteObject: vi.fn(() => Promise.resolve()),
  };
});

vi.mock("./customError", () => ({
  default: (msg, code, shouldThrow) => {
    if (shouldThrow) throw new Error(msg);
  }
}));

describe("ImageService", () => {
  let service;

  beforeEach(() => {
    service = new ImageService();
  });

  it("should upload a file and return URL", async () => {
    const fakeFile = { name: "test.jpg" };
    const url = await service.uploadFile(fakeFile);
    expect(url).toBe("https://example.com/image.jpg");
  });

  it("should resave image if not found", async () => {
    service.repo.getOne.mockResolvedValue(null);
    service.repo.create.mockResolvedValue({});
    const msg = await service.resaveImageFromStorage("url.jpg");
    expect(msg).toBe("Imagen guardada exitosamente");
  });

  it("should throw if image already exists", async () => {
    service.repo.getOne.mockResolvedValue({ imageUrl: "url.jpg" });
    expect(() => service.resaveImageFromStorage("url.jpg")).rejects.toThrow(
      "Esta imagen ya existe"
    );
  });
});
