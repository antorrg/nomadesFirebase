Claro, te dejo una guía **clara y resumida** con los **parámetros** y **tipos esperados** por cada método de tu clase `FirestoreRepository`, para que no pierdas tiempo tratando de interpretarlo. También incluyo qué tipo de datos espera cada función de Firestore que estás usando. Al final, te pongo también los **tipos generales que se repiten**.

---

## 🔧 Parámetros Generales (útiles en varias funciones)

| Parámetro             | Tipo          | Descripción                                                                 |
|-----------------------|---------------|-----------------------------------------------------------------------------|
| `field`               | `string`      | Nombre del campo a consultar                                                |
| `operator`            | `string`      | Operador lógico: `'=='`, `'>'`, `'<'`, `'>='`, `'<='`, `'array-contains'`, etc |
| `value`               | `any`         | Valor a comparar                                                            |
| `orderBy`             | `Array`       | Arreglo de objetos: `{ field: string, direction: 'asc' | 'desc' }`         |
| `limit`               | `number`      | Número máximo de documentos a retornar                                     |
| `startAfter`, `endBefore`, `startAt`, `endAt` | `any` | Para paginación (normalmente el valor de un campo ordenado o un doc snapshot) |
| `data`                | `object`      | Objeto con los datos del documento                                          |
| `customId`            | `string|null` | ID personalizado opcional                                                   |
| `operations`          | `Function`    | Función que recibe `batch` y ejecuta operaciones Firestore                  |

---

## 📚 Métodos y Parámetros

### `constructor(collectionName, options)`
- `collectionName: string`
- `options: object` (opcional)
  - `dataTransformer: function`
  - `emptyHandler: function`
  - `docTransformer: function`
  - `addTimestamps: boolean`

---

### `getAll(options)`
- `options: object` (opcional)
  - `where: Array<{field: string, operator: string, value: any}>`
  - `orderBy: Array<{field: string, direction?: 'asc' | 'desc'}>`
  - `limit: number`
  - `startAfter: any`

---

### `getAlguno()`
- No recibe parámetros

---

### `getById(id)`
- `id: string`

---

### `getOne(conditions)`
- `conditions: object`
  - `field: string`
  - `operator: string`
  - `value: any`

---

### `getByField(field, operator, value, options)`
- `field: string`
- `operator: string`
- `value: any`
- `options: object` (opcional)
  - `orderBy: Array<{field: string, direction?: 'asc' | 'desc'}>`
  - `limit: number`

---

### `create(data, customId)`
- `data: object`
- `customId: string` (opcional)

---

### `update(id, data)`
- `id: string`
- `data: object`

---

### `delete(id)`
- `id: string`

---

### `existsByField(field, value)`
- `field: string`
- `value: any`

---

### `executeBatch(operations)`
- `operations: Function`
  - Recibe `(batch, collectionRef) => { ... }`

---

## 🔥 Firestore Functions y Tipos Esperados

| Función Firestore         | Parámetros                                                              |
|---------------------------|-------------------------------------------------------------------------|
| `collection(db, name)`    | `db: Firestore`, `name: string`                                         |
| `doc(ref, id)`            | `ref: CollectionReference`, `id: string`                                |
| `getDocs(query)`          | `query: Query`                                                          |
| `getDoc(docRef)`          | `docRef: DocumentReference`                                             |
| `query(ref, ...clauses)`  | `ref: CollectionReference`, y luego: `where`, `orderBy`, `limit`, etc   |
| `where(field, op, val)`   | `field: string`, `op: string`, `val: any`                               |
| `orderBy(field, dir?)`    | `field: string`, `dir: 'asc' | 'desc'` (opcional)                      |
| `limit(number)`           | `number: number`                                                        |
| `startAfter(value)`       | `value: any` (usualmente valor de campo ordenado o snapshot)            |
| `addDoc(ref, data)`       | `ref: CollectionReference`, `data: object`                              |
| `setDoc(docRef, data)`    | `docRef: DocumentReference`, `data: object`                             |
| `updateDoc(docRef, data)` | `docRef: DocumentReference`, `data: object`                             |
| `deleteDoc(docRef)`       | `docRef: DocumentReference`                                             |
| `writeBatch(db)`          | `db: Firestore`                                                         |
| `serverTimestamp()`       | No parámetros                                                           |

---

¿Te gustaría que también te prepare un snippet tipo **archivo `.d.ts`** o esquema de Tipado para TypeScript o JSDoc?