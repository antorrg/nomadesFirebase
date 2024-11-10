Para implementar tests unitarios con Firestore sin usar los mocks de Jest, podemos crear un entorno de testing usando el emulador de Firebase. Aquí te muestro cómo podrías adaptarlo:



```javascript
// testSetup.js
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'test-project',
  // Otras configuraciones necesarias para testing
};

// Inicializar Firebase para testing
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Conectar al emulador de Firestore
connectFirestoreEmulator(db, 'localhost', 8080);

// Función helper para limpiar la base de datos
export async function clearFirestoreData() {
  const collections = ['users', 'products', 'items', 'landing', 'images', 'media', 'work', 'about'];
  
  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();
    
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  }
}

// Exportar la instancia de db para usar en los tests
export { db };

// test.js
import { db, clearFirestoreData } from './testSetup';
import { collection, getDocs } from 'firebase/firestore';

describe('Tests de Firestore', () => {
  // Limpiar la base de datos antes/después de cada test
  beforeEach(async () => {
    await clearFirestoreData();
  });

  afterAll(async () => {
    console.log("Finalizando todas las pruebas...");
    await clearFirestoreData();
  });

  it("Debería retornar colecciones vacías", async () => {
    const collections = ['users', 'products', 'items', 'landing', 'images', 'media', 'work', 'about'];
    
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      expect(snapshot.empty).toBe(true);
      expect(snapshot.docs).toHaveLength(0);
    }
  });

  it("Debería poder crear y recuperar un documento", async () => {
    const userRef = collection(db, 'users');
    await addDoc(userRef, {
      name: 'Test User',
      email: 'test@test.com'
    });

    const snapshot = await getDocs(userRef);
    expect(snapshot.empty).toBe(false);
    expect(snapshot.docs).toHaveLength(1);
    expect(snapshot.docs[0].data()).toEqual({
      name: 'Test User',
      email: 'test@test.com'
    });
  });
});

```

Para usar esta configuración necesitarás:

1. Instalar y configurar el emulador de Firebase:
```bash
npm install -g firebase-tools
firebase init emulators
firebase emulators:start
```

2. Configurar tu package.json para correr los tests con el emulador:
```json
{
  "scripts": {
    "test": "firebase emulators:exec --only firestore 'jest'"
  }
}
```

Las principales ventajas de este enfoque son:

1. Tests reales contra una base de datos (aunque emulada)
2. No necesitas mockear las funciones de Firestore
3. Los tests son más cercanos al comportamiento real
4. Puedes probar operaciones complejas de Firestore

¿Te gustaría que te muestre cómo implementar algún test específico o necesitas ayuda con alguna parte de la configuración?