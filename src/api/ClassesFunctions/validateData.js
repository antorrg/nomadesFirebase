import customError from './customError'

class ValidData {
  static middError (message, status = 500) {
    const error = new Error(message)
    error.status = status
    return error
  }

  static validateBoolean (value) {
    if (typeof value === 'boolean') return value
    if (value === 'true') return true
    if (value === 'false') return false
    customError('Invalid boolean value',400)
  }

  static validateInt (value) {
    const intValue = Number(value)
    if (isNaN(intValue) || !Number.isInteger(intValue)) customError('Invalid integer value', 400)
    return intValue
  }

  static validateFloat (value) {
    const floatValue = parseFloat(value)
    if (isNaN(floatValue)) customError('Invalid float value', 400)
    return floatValue
  }

  // Nueva función para aislar la lógica de validación
  static validateValue (value, fieldType, fieldName, itemIndex = null) {
    const indexInfo = itemIndex !== null ? ` in item[${itemIndex}]` : ''

    switch (fieldType) {
      case 'boolean':
        return ValidData.validateBoolean(value)
      case 'int':
        return ValidData.validateInt(value)
      case 'float':
        return ValidData.validateFloat(value)
      case 'array':
        if (!Array.isArray(value)) {
          customError(`Invalid array value for field ${fieldName}${indexInfo}`, 400)
        }
        return value
      case 'string':
      default:
        if (typeof value !== 'string') {
          customError(`Invalid string value for field ${fieldName}${indexInfo}`,400)
        }
        return value
    }
  }

  static validateFields (newData, requiredFields = []) {
      const newData = value
      if (!newData || Object.keys(newData).length === 0) {
        customError('Invalid parameters', 400)
      }
      const missingFields = requiredFields.filter(field => !(field.name in newData))
      if (missingFields.length > 0) {
        customError(`Missing parameters: ${missingFields.map(f => f.name).join(', ')}`, 400)
      }
        requiredFields.forEach(field => {
          const value = newData[field.name]
          newData[field.name] = ValidData.validateValue(value, field.type, field.name)
        })

        Object.keys(newData).forEach(key => {
          if (!requiredFields.some(field => field.name === key)) {
            delete newData[key]
          }
        })
      
      return newData
  }

  static validateFieldsWithItems (newData ,requiredFields = [], secondFields = [], arrayFieldName) {
        const firstData = { ...newData } // Datos principales
        const secondData = Array.isArray(newData[arrayFieldName])
          ? [...newData[arrayFieldName]] // Array dinámico
          : null

        // Validar existencia de `firstData`
        if (!firstData || Object.keys(firstData).length === 0) {
          customError('Invalid parameters', 400)
        }

        // Verificar campos faltantes en `firstData`
        const missingFields = requiredFields.filter((field) => !(field.name in firstData))
        if (missingFields.length > 0) {
          customError(`Missing parameters: ${missingFields.map(f => f.name).join(', ')}`, 400)
        }

        try {
          requiredFields.forEach(field => {
            const value = firstData[field.name]
            firstData[field.name] = ValidData.validateValue(value, field.type, field.name)
          })

          // Filtrar campos adicionales no permitidos en `firstData`
          Object.keys(firstData).forEach(key => {
            if (!requiredFields.some(field => field.name === key)) {
              delete firstData[key]
            }
          })
        } catch (error) {
          customError(error.message, 400)
        }

        // Validar existencia y estructura de `secondData`
        if (!secondData || secondData.length === 0) {
          customError(`Missing ${arrayFieldName} array or empty array`, 400)
        }

        // Validar contenido de `secondData` (no debe contener strings)
        const invalidStringItems = secondData.filter((item) => typeof item === 'string')
        if (invalidStringItems.length > 0) {
          customError(`Invalid "${arrayFieldName}" content: expected objects but found strings (e.g., ${invalidStringItems[0]})`,
              400
            )
        }

        // Validar cada objeto dentro de `secondData`
        const validatedSecondData = secondData.map((item, index) => {
          const missingItemFields = secondFields.filter((field) => !(field.name in item))
          if (missingItemFields.length > 0) {
            customError(
              `Missing parameters in ${arrayFieldName}[${index}]: ${missingItemFields.map(f => f.name).join(', ')}`,
              400
            )
          }

          // Validar tipos de campos en cada `item` usando la función aislada
          secondFields.forEach(field => {
            const value = item[field.name]
            item[field.name] = ValidData.validateValue(value, field.type, field.name, index)
          })

          // Filtrar campos adicionales en cada `item`
          return secondFields.reduce((acc, field) => {
            acc[field.name] = item[field.name]
            return acc
          }, {})
        })

        // Actualizar `req.body` con datos validados
        return {
          ...firstData,
          [arrayFieldName]: validatedSecondData // Asignar dinámicamente
        }
    
  }

  // MiddlewareHandler.validateQuery([{name: 'authorId', type: 'int', required: true}]),
  static validateQuery (queryObject={}, requiredFields = []) {

        requiredFields.forEach(field => {
          let value = queryObject[field.name]

          if (value === undefined) {
            if (field.required) {
              customError(`El parámetro "${field.name}" es obligatorio.`, 400)
            }

            // Si no es obligatorio, asignamos valores por defecto
            switch (field.type) {
              case 'boolean':
                value = false
                break
              case 'int':
                value = 1
                break
              case 'float':
                value = 1.0
                break
              case 'string':
              default:
                value = ''
            }
          } else {
            // Validar el valor si está presente
            value = ValidData.validateValue(value, field.type, field.name)
          }

          queryObject[field.name] = value
        })

        // Eliminar parámetros no esperados
        Object.keys(queryObject).forEach(key => {
          if (!requiredFields.some(field => field.name === key)) {
            delete queryObject[key]
          }
        })
      
      return queryObject
    }

    static validateRegex(field, validRegex, nameOfField, message = null) {
      if (!field || !validRegex || !nameOfField || nameOfField.trim() === '') {
        throw new Error('ValidRegex: faltan parametros en la funcion!');
      }
      const personalizedMessage = message ? ' ' + message : '';
      if (typeof field !== 'string' || field.trim() === '') {
        throw new Error(`Falta ${nameOfField}`);
      }
      if (!validRegex.test(field)) {
        throw new Error(`El formato de ${nameOfField} no es valido!${personalizedMessage}`);
      }
      return field;
    }
 
}

export default ValidData 
