// Archivo de validación centralizado
// Contiene funciones de validación reutilizables para el formulario

import type { Postulante } from "../types/postulante";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  message?: string;
}

// Validación de DNI peruano (8 dígitos numéricos)
export const validateDNI = (dni: string): ValidationResult => {
  const dniClean = dni.replace(/[^0-9]/g, '');
  if (dniClean.length !== 8) {
    return { isValid: false, errors: { dni: 'DNI debe tener 8 dígitos' } };
  }
  return { isValid: true, errors: {} };
};

// Validación de email básico
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { isValid: false, errors: { email: 'Email inválido' } };
  }
  return { isValid: true, errors: {} };
};

// Validación de celular (9 dígitos numéricos)
export const validateCelular = (celular: string): ValidationResult => {
  const celularClean = celular.replace(/[^0-9]/g, '');
  if (celularClean.length !== 9) {
    return { isValid: false, errors: { celular: 'Celular debe tener 9 dígitos' } };
  }
  return { isValid: true, errors: {} };
};

// Validación de documentos que no son DNI (C.E. / pasaporte): entre 6 y 12 caracteres alfanuméricos.
// El error se registra en 'dni' porque es el campo de la ficha donde se escribe el documento.
export const validateDocumentoNoDNI = (documento: string): ValidationResult => {
  const limpio = documento.replace(/[^A-Za-z0-9]/g, '');
  if (limpio.length < 6 || limpio.length > 12) {
    return { isValid: false, errors: { dni: 'El documento debe tener entre 6 y 12 caracteres' } };
  }
  return { isValid: true, errors: {} };
};

// Validación de campos requeridos básicos
export const validateRequired = (field: string, value: unknown): ValidationResult => {
  if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
    return { 
      isValid: false, 
      errors: { [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} es requerido` } 
    };
  }
  return { isValid: true, errors: {} };
};

// Validación de edad (numérica y razonable)
export const validateEdad = (edad: string): ValidationResult => {
  const edadNum = parseInt(edad, 10);
  if (isNaN(edadNum) || edadNum < 0 || edadNum > 120) {
    return { isValid: false, errors: { edad: 'Edad debe ser un número entre 0 y 120' } };
  }
  return { isValid: true, errors: {} };
};

// Validación de fecha (no vacía y formato válido)
export const validateFecha = (fecha: string): ValidationResult => {
  if (!fecha) {
    return { isValid: false, errors: { fechaNacimiento: 'Fecha de nacimiento es requerida' } };
  }
  // Validar formato YYYY-MM-DD básico
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(fecha)) {
    return { isValid: false, errors: { fechaNacimiento: 'Formato de fecha inválido' } };
  }
  return { isValid: true, errors: {} };
};

// Validador completo para el formulario
export const validatePostulante = (postulante: Postulante): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Campos personales requeridos
  const personalFields = ['apat', 'nombres', 'dni', 'fechaNacimiento', 'edad'];
  personalFields.forEach(field => {
    const result = validateRequired(field, postulante[field as keyof Postulante]);
    if (!result.isValid) errors[field] = result.errors[field];
  });
  
  // Validaciones específicas
  const dniResult = validateDNI(postulante.dni);
  if (!dniResult.isValid) errors.dni = dniResult.errors.dni;
  
  const emailResult = validateEmail(postulante.email);
  if (!emailResult.isValid) errors.email = emailResult.errors.email;
  
  const celularResult = validateCelular(postulante.celular);
  if (!celularResult.isValid) errors.celular = celularResult.errors.celular;
  
  const edadResult = validateEdad(postulante.edad.toString());
  if (!edadResult.isValid) errors.edad = edadResult.errors.edad;
  
  const fechaResult = validateFecha(postulante.fechaNacimiento);
  if (!fechaResult.isValid) errors.fechaNacimiento = fechaResult.errors.fechaNacimiento;
  
  const allValid = Object.keys(errors).length === 0;
  return { 
    isValid: allValid, 
    errors,
    message: allValid ? undefined : 'Complete los campos marcados en rojo'
  };
};